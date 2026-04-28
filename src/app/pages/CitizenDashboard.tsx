import { Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { WireframePlaceholder } from '../components/WireframePlaceholder';
import { useIncidents } from '../context/IncidentsContext';

export default function CitizenDashboard() {
  const { incidents } = useIncidents();
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  const activeCount = incidents.filter(i => i.status !== 'Resolved').length;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-mono font-bold mb-2">CITIZEN DASHBOARD</h1>
          <p className="text-gray-600 font-mono text-sm">Monitor and report environmental incidents</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="border-4 border-black p-6 bg-gray-50">
            <div className="text-sm font-mono text-gray-600 mb-2">FOREST RISK</div>
            <div className="text-4xl font-mono font-bold mb-2">HIGH</div>
            <div className="text-xs font-mono text-gray-500">3 active alerts</div>
          </div>

          {/* Card 2 */}
          <div className="border-4 border-black p-6 bg-gray-50">
            <div className="text-sm font-mono text-gray-600 mb-2">WATER LEVELS</div>
            <div className="text-4xl font-mono font-bold mb-2">NORMAL</div>
            <div className="text-xs font-mono text-gray-500">Last updated: Today</div>
          </div>

          {/* Card 3 */}
          <div className="border-4 border-black p-6 bg-gray-50">
            <div className="text-sm font-mono text-gray-600 mb-2">ACTIVE INCIDENTS</div>
            <div className="text-4xl font-mono font-bold mb-2">{activeCount}</div>
            <div className="text-xs font-mono text-gray-500">{pendingCount} pending review</div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-mono font-bold">INCIDENT MAP</h2>
            <Link 
              to="/report"
              className="bg-black text-white px-6 py-3 font-mono font-bold hover:bg-gray-800 transition-colors"
            >
              + REPORT INCIDENT
            </Link>
          </div>
          <WireframePlaceholder label="MAP: Incident Locations" height="400px" />
        </div>

        {/* Recent Incidents */}
        <div>
          <h2 className="text-xl font-mono font-bold mb-4">RECENT INCIDENTS</h2>
          <div className="space-y-4">
            {incidents.slice(0, 3).map((incident) => (
              <Link
                key={incident.id}
                to={`/incident/${incident.id}`}
                className="block border-2 border-black p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-mono font-bold mb-1">{incident.type}</div>
                    <div className="text-sm font-mono text-gray-600 mb-2">{incident.location}</div>
                    <div className="text-xs font-mono text-gray-500">{incident.date}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-xs font-mono font-bold border-2 border-black ${
                      incident.status === 'Pending' ? 'bg-gray-200' :
                      incident.status === 'Approved' ? 'bg-gray-400 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {incident.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 text-xs font-mono font-bold ${
                      incident.severity === 'High' ? 'border-2 border-black' :
                      'border border-gray-400'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}