import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b8d06af6`;

interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Auth API
export const authApi = {
  register: async (email: string, password: string, role: 'citizen' | 'authority') => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  login: async (email: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Incidents API
export const incidentsApi = {
  getAll: async () => {
    return apiCall('/incidents');
  },

  getById: async (id: string) => {
    return apiCall(`/incidents/${id}`);
  },

  create: async (incident: any) => {
    return apiCall('/incidents', {
      method: 'POST',
      body: JSON.stringify(incident),
    });
  },

  updateStatus: async (id: string, status: 'Pending' | 'Approved' | 'Resolved') => {
    return apiCall(`/incidents/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async () => {
    return apiCall('/notifications');
  },

  markAsRead: async (incidentId: string) => {
    return apiCall(`/notifications/${incidentId}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return apiCall('/notifications/read-all', {
      method: 'PUT',
    });
  },
};
