export interface Incident {
  id: string;
  type: string;
  description: string;
  location: string;
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
}

export const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'Illegal Logging',
    description: 'Trees being cut down in protected forest area',
    location: 'North Forest, Zone A',
    status: 'Pending',
    date: '2026-03-28',
    severity: 'High',
    region: 'North',
    reportedBy: 'John Citizen'
  },
  {
    id: '2',
    type: 'Water Pollution',
    description: 'Chemical waste detected in river',
    location: 'River Valley, Sector 3',
    status: 'Approved',
    date: '2026-03-27',
    severity: 'High',
    region: 'East',
    reportedBy: 'Jane Doe'
  },
  {
    id: '3',
    type: 'Forest Fire',
    description: 'Small fire spotted near camping area',
    location: 'South Forest, Zone C',
    status: 'Resolved',
    date: '2026-03-25',
    severity: 'Medium',
    region: 'South',
    reportedBy: 'Mike Smith'
  },
  {
    id: '4',
    type: 'Wildlife Poaching',
    description: 'Suspicious activity near wildlife sanctuary',
    location: 'West Sanctuary',
    status: 'Pending',
    date: '2026-03-29',
    severity: 'High',
    region: 'West',
    reportedBy: 'Sarah Johnson'
  },
  {
    id: '5',
    type: 'Waste Dumping',
    description: 'Illegal waste disposal site discovered',
    location: 'Industrial Area, Block 7',
    status: 'Approved',
    date: '2026-03-26',
    severity: 'Medium',
    region: 'North',
    reportedBy: 'Tom Anderson'
  }
];

export const incidentTypes = [
  'Illegal Logging',
  'Water Pollution',
  'Forest Fire',
  'Wildlife Poaching',
  'Waste Dumping',
  'Air Pollution',
  'Soil Contamination'
];