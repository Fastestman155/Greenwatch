import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b8d06af6/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTH ENDPOINTS ============

// Register new user
app.post("/make-server-b8d06af6/auth/register", async (c) => {
  try {
    const { email, password, role } = await c.req.json();

    // Validate input
    if (!email || !password || !role) {
      return c.json({ error: 'Email, password, and role are required' }, 400);
    }

    if (!['citizen', 'authority'].includes(role)) {
      return c.json({ error: 'Role must be citizen or authority' }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since we don't have email server
      user_metadata: { role }
    });

    if (authError) {
      console.log('Auth error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: authData.user.id, email, role }]);

    if (profileError) {
      console.log('Profile error:', profileError);
      return c.json({ error: 'Failed to create profile' }, 500);
    }

    return c.json({
      success: true,
      message: 'User registered successfully',
      user: { id: authData.user.id, email, role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Login user
app.post("/make-server-b8d06af6/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return c.json({ error: authError.message }, 401);
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({
      success: true,
      user: {
        id: authData.user.id,
        email: profile.email,
        role: profile.role
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// ============ INCIDENTS ENDPOINTS ============

// Get all incidents
app.get("/make-server-b8d06af6/incidents", async (c) => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get incidents error:', error);
      return c.json({ error: 'Failed to fetch incidents' }, 500);
    }

    return c.json({ incidents: data });
  } catch (error) {
    console.error('Get incidents error:', error);
    return c.json({ error: 'Failed to fetch incidents' }, 500);
  }
});

// Get single incident
app.get("/make-server-b8d06af6/incidents/:id", async (c) => {
  try {
    const id = c.req.param('id');

    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return c.json({ error: 'Incident not found' }, 404);
    }

    return c.json({ incident: data });
  } catch (error) {
    console.error('Get incident error:', error);
    return c.json({ error: 'Failed to fetch incident' }, 500);
  }
});

// Create new incident
app.post("/make-server-b8d06af6/incidents", async (c) => {
  try {
    const incident = await c.req.json();

    const { data, error } = await supabase
      .from('incidents')
      .insert([{
        type: incident.type,
        description: incident.description,
        location: incident.location,
        latitude: incident.coordinates?.lat,
        longitude: incident.coordinates?.lng,
        severity: incident.severity || 'Medium',
        region: incident.region,
        reported_by_email: incident.reportedBy,
        attachment_name: incident.attachment?.name,
        attachment_url: incident.attachment?.url,
        attachment_type: incident.attachment?.type
      }])
      .select()
      .single();

    if (error) {
      console.error('Create incident error:', error);
      return c.json({ error: 'Failed to create incident' }, 500);
    }

    return c.json({ success: true, incident: data });
  } catch (error) {
    console.error('Create incident error:', error);
    return c.json({ error: 'Failed to create incident' }, 500);
  }
});

// Update incident status
app.put("/make-server-b8d06af6/incidents/:id/status", async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();

    if (!['Pending', 'Approved', 'Resolved'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const { data, error } = await supabase
      .from('incidents')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update status error:', error);
      return c.json({ error: 'Failed to update status' }, 500);
    }

    return c.json({ success: true, incident: data });
  } catch (error) {
    console.error('Update status error:', error);
    return c.json({ error: 'Failed to update status' }, 500);
  }
});

// ============ NOTIFICATIONS ENDPOINTS ============

// Get all notifications
app.get("/make-server-b8d06af6/notifications", async (c) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get notifications error:', error);
      return c.json({ error: 'Failed to fetch notifications' }, 500);
    }

    return c.json({ notifications: data });
  } catch (error) {
    console.error('Get notifications error:', error);
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

// Mark notification as read
app.put("/make-server-b8d06af6/notifications/:id/read", async (c) => {
  try {
    const id = c.req.param('id');

    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('incident_id', id)
      .select();

    if (error) {
      console.error('Mark read error:', error);
      return c.json({ error: 'Failed to mark as read' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    return c.json({ error: 'Failed to mark as read' }, 500);
  }
});

// Mark all notifications as read
app.put("/make-server-b8d06af6/notifications/read-all", async (c) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);

    if (error) {
      console.error('Mark all read error:', error);
      return c.json({ error: 'Failed to mark all as read' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Mark all read error:', error);
    return c.json({ error: 'Failed to mark all as read' }, 500);
  }
});

Deno.serve(app.fetch);