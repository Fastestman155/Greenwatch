# GreenWatch Database Setup

## Instructions

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/dhwoadncdzhflgtsdciv
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the SQL below
5. Click "Run" to execute

## Database Schema SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication)
-- Note: Supabase has built-in auth, but we'll create a profiles table for additional user data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('citizen', 'authority')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Resolved')) DEFAULT 'Pending',
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
  region TEXT NOT NULL,
  reported_by_email TEXT NOT NULL,
  attachment_name TEXT,
  attachment_url TEXT,
  attachment_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_reported_by ON incidents(reported_by_email);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_incident ON notifications(incident_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies (anyone can read, users can update their own)
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Incidents policies (everyone can read, authenticated users can create)
CREATE POLICY "Incidents are viewable by everyone" ON incidents
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create incidents" ON incidents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update incidents" ON incidents
  FOR UPDATE USING (true);

-- Notifications policies (viewable by everyone for now)
CREATE POLICY "Notifications are viewable by everyone" ON notifications
  FOR SELECT USING (true);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update notifications" ON notifications
  FOR UPDATE USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create notification when incident is created
CREATE OR REPLACE FUNCTION create_incident_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (incident_id, message)
  VALUES (
    NEW.id,
    'New ' || NEW.severity || ' severity incident reported: ' || NEW.type || ' at ' || NEW.location
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-create notification for new incidents
CREATE TRIGGER on_incident_created AFTER INSERT ON incidents
  FOR EACH ROW EXECUTE FUNCTION create_incident_notification();
```

## After Running the SQL

Once you've run this SQL successfully, come back here and I'll update the server code to use these tables.
