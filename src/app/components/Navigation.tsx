import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function Navigation() {
  const { logout, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b-4 border-black bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black bg-white"></div>
          <span className="font-mono font-bold text-xl">GreenWatch</span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {userRole === 'authority' && (
            <Link 
              to="/authority/dashboard"
              className="font-mono text-sm border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
            >
              AUTHORITY PORTAL
            </Link>
          )}
          <div className="w-10 h-10 border-2 border-black bg-white"></div>
          <span className="font-mono text-sm">PROFILE</span>
          <button
            onClick={handleLogout}
            className="font-mono text-sm border-2 border-black px-4 py-2 bg-white hover:bg-black hover:text-white transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
}