import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockIncidents, Incident } from '../data/mockData';

interface IncidentsContextType {
  incidents: Incident[];
  updateIncidentStatus: (id: string, status: 'Pending' | 'Approved' | 'Resolved') => void;
  addIncident: (incident: Omit<Incident, 'id' | 'date' | 'status'>) => void;
  getIncidentById: (id: string) => Incident | undefined;
}

const IncidentsContext = createContext<IncidentsContextType | undefined>(undefined);

export function IncidentsProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage or use mock data
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const stored = localStorage.getItem('greenwatch_incidents');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockIncidents;
      }
    }
    return mockIncidents;
  });

  // Persist to localStorage whenever incidents change
  useEffect(() => {
    localStorage.setItem('greenwatch_incidents', JSON.stringify(incidents));
  }, [incidents]);

  const updateIncidentStatus = (id: string, status: 'Pending' | 'Approved' | 'Resolved') => {
    setIncidents(prevIncidents =>
      prevIncidents.map(incident =>
        incident.id === id ? { ...incident, status } : incident
      )
    );
  };

  const addIncident = (incident: Omit<Incident, 'id' | 'date' | 'status'>) => {
    const newIncident: Incident = {
      ...incident,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      status: 'Pending'
    };
    setIncidents(prevIncidents => [newIncident, ...prevIncidents]);
  };

  const getIncidentById = (id: string) => {
    return incidents.find(incident => incident.id === id);
  };

  return (
    <IncidentsContext.Provider value={{ incidents, updateIncidentStatus, addIncident, getIncidentById }}>
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