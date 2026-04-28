import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export function AuthoritySidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 border-r-4 border-black bg-gray-100 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b-4 border-black">
        <div className="w-12 h-12 border-2 border-black bg-white mb-3"></div>
        <div className="font-mono font-bold text-lg">GreenWatch</div>
        <div className="text-xs font-mono text-gray-600">AUTHORITY PORTAL</div>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="mt-3 bg-black text-white px-3 py-2 font-mono text-xs font-bold">
            🔔 {unreadCount} NEW REPORT{unreadCount !== 1 ? 'S' : ''}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          <Link
            to="/authority/dashboard"
            className={`block p-3 font-mono font-bold transition-colors ${
              isActive('/authority/dashboard')
                ? 'bg-black text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            DASHBOARD
          </Link>
          <Link
            to="/authority/reports"
            className={`block p-3 font-mono font-bold transition-colors ${
              isActive('/authority/reports')
                ? 'bg-black text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            REPORTS
          </Link>
          <Link
            to="/authority/analytics"
            className={`block p-3 font-mono font-bold transition-colors ${
              isActive('/authority/analytics')
                ? 'bg-black text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            ANALYTICS
          </Link>
        </div>

        <div className="mt-8 pt-4 border-t-2 border-gray-300">
          <Link
            to="/dashboard"
            className="block p-3 font-mono text-sm hover:bg-gray-200 transition-colors"
          >
            ← Citizen View
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 font-mono text-sm hover:bg-gray-200 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </nav>
    </div>
  );
}