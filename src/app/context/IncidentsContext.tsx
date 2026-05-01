import React, { createContext, useContext, useState, useEffect } from 'react';
import { incidentsApi } from '../../utils/api';

export interface Incident {
  id: string;
  type: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: 'Pending' | 'Approved' | 'Resolved';
  date: string;
  severity: 'Low' | 'Medium' | 'High';
  region: string;
  reportedBy: string;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface IncidentsContextType {
  incidents: Incident[];
  updateIncidentStatus: (id: string, status: 'Pending' | 'Approved' | 'Resolved') => Promise<void>;
  addIncident: (incident: Omit<Incident, 'id' | 'date' | 'status'>) => Promise<void>;
  getIncidentById: (id: string) => Incident | undefined;
  refreshIncidents: () => Promise<void>;
  loading: boolean;
}

const IncidentsContext = createContext<IncidentsContextType | undefined>(undefined);

export function IncidentsProvider({ children }: { children: React.ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshIncidents = async () => {
    try {
      setLoading(true);
      const response = await incidentsApi.getAll();

      if (response.incidents) {
        // Transform database format to frontend format
        const transformedIncidents = response.incidents.map((inc: any) => ({
          id: inc.id,
          type: inc.type,
          description: inc.description,
          location: inc.location,
          coordinates: inc.latitude && inc.longitude ? {
            lat: parseFloat(inc.latitude),
            lng: parseFloat(inc.longitude)
          } : undefined,
          status: inc.status,
          date: new Date(inc.created_at).toISOString().split('T')[0],
          severity: inc.severity,
          region: inc.region,
          reportedBy: inc.reported_by_email,
          attachment: inc.attachment_url ? {
            name: inc.attachment_name,
            url: inc.attachment_url,
            type: inc.attachment_type
          } : undefined,
          created_at: inc.created_at,
          updated_at: inc.updated_at
        }));

        setIncidents(transformedIncidents);
      }
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load incidents on mount
  useEffect(() => {
    refreshIncidents();
  }, []);

  const updateIncidentStatus = async (id: string, status: 'Pending' | 'Approved' | 'Resolved') => {
    try {
      await incidentsApi.updateStatus(id, status);
      // Update local state
      setIncidents(prevIncidents =>
        prevIncidents.map(incident =>
          incident.id === id ? { ...incident, status } : incident
        )
      );
    } catch (error) {
      console.error('Failed to update incident status:', error);
      throw error;
    }
  };

  const addIncident = async (incident: Omit<Incident, 'id' | 'date' | 'status'>) => {
    try {
      const response = await incidentsApi.create(incident);

      if (response.success && response.incident) {
        // Refresh incidents list to get the new one
        await refreshIncidents();
      }
    } catch (error) {
      console.error('Failed to create incident:', error);
      throw error;
    }
  };

  const getIncidentById = (id: string) => {
    return incidents.find(incident => incident.id === id);
  };

  return (
    <IncidentsContext.Provider value={{
      incidents,
      updateIncidentStatus,
      addIncident,
      getIncidentById,
      refreshIncidents,
      loading
    }}>
      {children}
    </IncidentsContext.Provider>
  );
}

export function useIncidents() {
  const context = useContext(IncidentsContext);
  if (!context) {
    throw new Error('useIncidents must be used within IncidentsProvider');
  }
  return context;
}
