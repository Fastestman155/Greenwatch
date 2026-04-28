import { useState } from 'react';
import { Link } from 'react-router';
import { AuthoritySidebar } from '../components/AuthoritySidebar';
import { useIncidents } from '../context/IncidentsContext';
import { useNotifications } from '../context/NotificationContext';

export default function AuthorityDashboard() {
  const { incidents, updateIncidentStatus } = useIncidents();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [sortBy, setSortBy] = useState<'status' | 'severity' | 'date-new' | 'date-old'>('status');

  const filteredIncidents = incidents.filter(incident => {
    if (filterType !== 'all' && incident.type !== filterType) return false;
    if (filterStatus !== 'all' && incident.status !== filterStatus) return false;
    return true;
  });

  // Sort incidents based on the selected sort criteria
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    if (sortBy === 'status') {
      const statusOrder = { 'Pending': 1, 'Approved': 2, 'Resolved': 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    } else if (sortBy === 'severity') {
      const severityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    } else if (sortBy === 'date-new') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'date-old') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return 0;
  });

  const handleAction = (id: string, action: 'Approve' | 'Reject' | 'Resolve') => {
    if (action === 'Approve') {
      updateIncidentStatus(id, 'Approved');
    } else if (action === 'Reject') {
      // For rejected incidents, set them to Resolved
      updateIncidentStatus(id, 'Resolved');
    } else if (action === 'Resolve') {
      updateIncidentStatus(id, 'Resolved');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <AuthoritySidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-mono font-bold mb-2">AUTHORITY DASHBOARD</h1>
            <p className="text-gray-600 font-mono text-sm">Manage and review incident reports</p>
          </div>
          
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="border-2 border-black px-4 py-2 font-mono text-sm hover:bg-black hover:text-white transition-colors relative"
            >
              🔔 NOTIFICATIONS
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-mono px-2 py-1 min-w-[24px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notification Panel */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 border-4 border-black bg-white shadow-lg z-10 max-h-96 overflow-y-auto">
                <div className="p-4 bg-black text-white flex justify-between items-center">
                  <span className="font-mono font-bold text-sm">NOTIFICATIONS</span>
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-mono underline hover:no-underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-8 text-center font-mono text-gray-600 text-sm">
                    No notifications
                  </div>
                ) : (
                  <div>
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b-2 border-gray-200 ${
                          notif.read ? 'bg-gray-50' : 'bg-yellow-50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className={`text-xs font-mono ${notif.read ? 'text-gray-600' : 'font-bold'}`}>
                            {new Date(notif.timestamp).toLocaleString()}
                          </span>
                          {!notif.read && (
                            <span className="px-2 py-1 bg-black text-white text-xs font-mono">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-sm mb-3">{notif.message}</p>
                        <div className="flex gap-2">
                          <Link
                            to={`/incident/${notif.incidentId}`}
                            onClick={() => {
                              markAsRead(notif.incidentId);
                              setShowNotifications(false);
                            }}
                            className="border border-black px-3 py-1 text-xs font-mono hover:bg-black hover:text-white transition-colors"
                          >
                            VIEW INCIDENT
                          </Link>
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.incidentId)}
                              className="border border-gray-400 px-3 py-1 text-xs font-mono hover:bg-gray-200 transition-colors"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="border-2 border-black p-4 bg-gray-50">
            <div className="text-xs font-mono text-gray-600 mb-1">TOTAL REPORTS</div>
            <div className="text-2xl font-mono font-bold">{incidents.length}</div>
          </div>
          <div className="border-2 border-black p-4 bg-gray-50">
            <div className="text-xs font-mono text-gray-600 mb-1">PENDING</div>
            <div className="text-2xl font-mono font-bold">
              {incidents.filter(i => i.status === 'Pending').length}
            </div>
          </div>
          <div className="border-2 border-black p-4 bg-gray-50">
            <div className="text-xs font-mono text-gray-600 mb-1">APPROVED</div>
            <div className="text-2xl font-mono font-bold">
              {incidents.filter(i => i.status === 'Approved').length}
            </div>
          </div>
          <div className="border-2 border-black p-4 bg-gray-50">
            <div className="text-xs font-mono text-gray-600 mb-1">RESOLVED</div>
            <div className="text-2xl font-mono font-bold">
              {incidents.filter(i => i.status === 'Resolved').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-mono font-bold mb-2">FILTER BY TYPE</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border-2 border-black p-2 font-mono text-sm bg-white"
            >
              <option value="all">All Types</option>
              <option value="Illegal Logging">Illegal Logging</option>
              <option value="Water Pollution">Water Pollution</option>
              <option value="Forest Fire">Forest Fire</option>
              <option value="Wildlife Poaching">Wildlife Poaching</option>
              <option value="Waste Dumping">Waste Dumping</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-mono font-bold mb-2">FILTER BY STATUS</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border-2 border-black p-2 font-mono text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <button
            onClick={() => {
              setFilterType('all');
              setFilterStatus('all');
            }}
            className="border-2 border-black px-4 py-2 font-mono text-sm hover:bg-black hover:text-white transition-colors"
          >
            CLEAR
          </button>
        </div>

        {/* Sort Options */}
        <div className="mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-mono font-bold mb-2">SORT BY</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'status' | 'severity' | 'date-new' | 'date-old')}
              className="w-full border-2 border-black p-2 font-mono text-sm bg-white"
            >
              <option value="status">Status</option>
              <option value="severity">Severity</option>
              <option value="date-new">Date (Newest)</option>
              <option value="date-old">Date (Oldest)</option>
            </select>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="border-4 border-black overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-3 text-left font-mono text-xs">ID</th>
                <th className="p-3 text-left font-mono text-xs">TYPE</th>
                <th className="p-3 text-left font-mono text-xs">LOCATION</th>
                <th className="p-3 text-left font-mono text-xs">STATUS</th>
                <th className="p-3 text-left font-mono text-xs">SEVERITY</th>
                <th className="p-3 text-left font-mono text-xs">DATE</th>
                <th className="p-3 text-left font-mono text-xs">ATTACHMENT</th>
                <th className="p-3 text-left font-mono text-xs">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedIncidents.map((incident, index) => (
                <tr
                  key={incident.id}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="p-3 font-mono text-sm">{incident.id}</td>
                  <td className="p-3 font-mono text-sm">{incident.type}</td>
                  <td className="p-3 font-mono text-sm">{incident.location}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-mono font-bold border ${
                      incident.status === 'Pending' ? 'border-gray-400 bg-gray-200' :
                      incident.status === 'Approved' ? 'border-black bg-gray-400 text-white' :
                      'border-black bg-gray-600 text-white'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-sm">{incident.severity}</td>
                  <td className="p-3 font-mono text-sm">{incident.date}</td>
                  <td className="p-3 font-mono text-sm">
                    {incident.attachment ? (
                      <span className="px-2 py-1 text-xs font-mono border border-black bg-gray-200">
                        📎 {incident.attachment.name.substring(0, 15)}...
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No file</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/incident/${incident.id}`}
                        className="border border-black px-2 py-1 text-xs font-mono hover:bg-black hover:text-white transition-colors"
                      >
                        VIEW
                      </Link>
                      {incident.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleAction(incident.id, 'Approve')}
                            className="border border-black px-2 py-1 text-xs font-mono hover:bg-black hover:text-white transition-colors"
                          >
                            APPROVE
                          </button>
                          <button
                            onClick={() => handleAction(incident.id, 'Reject')}
                            className="border border-black px-2 py-1 text-xs font-mono hover:bg-black hover:text-white transition-colors"
                          >
                            REJECT
                          </button>
                        </>
                      )}
                      {incident.status === 'Approved' && (
                        <button
                          onClick={() => handleAction(incident.id, 'Resolve')}
                          className="border border-black px-2 py-1 text-xs font-mono hover:bg-black hover:text-white transition-colors"
                        >
                          RESOLVE
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedIncidents.length === 0 && (
          <div className="text-center p-8 font-mono text-gray-600">
            No incidents match the selected filters
          </div>
        )}
      </div>
    </div>
  );
}