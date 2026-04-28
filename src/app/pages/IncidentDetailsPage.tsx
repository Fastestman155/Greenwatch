import { useParams, useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { WireframePlaceholder } from '../components/WireframePlaceholder';
import { useIncidents } from '../context/IncidentsContext';

export default function IncidentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIncidentById } = useIncidents();
  const incident = getIncidentById(id || '');

  if (!incident) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center font-mono">Incident not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 font-mono text-sm border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
        >
          ← BACK
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-mono font-bold mb-2">INCIDENT DETAILS</h1>
          <p className="text-gray-600 font-mono text-sm">ID: {incident.id}</p>
        </div>

        {/* Main Content */}
        <div className="border-4 border-black p-8 bg-gray-50 space-y-8">
          {/* Status Badge */}
          <div className="flex items-center gap-4 pb-6 border-b-2 border-gray-300">
            <span className={`px-4 py-2 text-sm font-mono font-bold border-2 border-black ${
              incident.status === 'Pending' ? 'bg-gray-200' :
              incident.status === 'Approved' ? 'bg-gray-400 text-white' :
              'bg-gray-600 text-white'
            }`}>
              STATUS: {incident.status.toUpperCase()}
            </span>
            <span className={`px-4 py-2 text-sm font-mono font-bold ${
              incident.severity === 'High' ? 'border-2 border-black' :
              'border border-gray-400'
            }`}>
              SEVERITY: {incident.severity.toUpperCase()}
            </span>
          </div>

          {/* Image Placeholder */}
          <div>
            <div className="text-sm font-mono font-bold mb-2">EVIDENCE</div>
            {incident.attachment ? (
              <div className="border-2 border-black bg-white p-4">
                {incident.attachment.type.startsWith('image/') ? (
                  <img 
                    src={incident.attachment.url} 
                    alt={incident.attachment.name}
                    className="max-h-96 mx-auto border-2 border-gray-400"
                  />
                ) : incident.attachment.type.startsWith('video/') ? (
                  <video 
                    src={incident.attachment.url} 
                    controls
                    className="max-h-96 mx-auto border-2 border-gray-400"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="font-mono text-sm mb-2">📄 {incident.attachment.name}</div>
                    <a 
                      href={incident.attachment.url} 
                      download={incident.attachment.name}
                      className="inline-block border-2 border-black px-4 py-2 font-mono text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      DOWNLOAD FILE
                    </a>
                  </div>
                )}
                <div className="text-xs font-mono text-gray-600 mt-2 text-center">
                  {incident.attachment.name}
                </div>
              </div>
            ) : (
              <WireframePlaceholder label="IMAGE: No evidence attached" height="300px" />
            )}
          </div>

          {/* Incident Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-mono font-bold mb-2 text-gray-600">TYPE</div>
              <div className="font-mono">{incident.type}</div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold mb-2 text-gray-600">DATE REPORTED</div>
              <div className="font-mono">{incident.date}</div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold mb-2 text-gray-600">LOCATION</div>
              <div className="font-mono">{incident.location}</div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold mb-2 text-gray-600">REPORTED BY</div>
              <div className="font-mono">{incident.reportedBy}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="text-sm font-mono font-bold mb-2 text-gray-600">DESCRIPTION</div>
            <div className="font-mono border-2 border-gray-300 p-4 bg-white">
              {incident.description}
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="text-sm font-mono font-bold mb-2 text-gray-600">MAP LOCATION</div>
            <WireframePlaceholder label="MAP: Incident Location" height="250px" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t-2 border-gray-300">
            <button className="flex-1 border-2 border-black p-3 font-mono font-bold hover:bg-black hover:text-white transition-colors">
              SHARE
            </button>
            <button className="flex-1 border-2 border-black p-3 font-mono font-bold hover:bg-black hover:text-white transition-colors">
              FOLLOW UPDATES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}