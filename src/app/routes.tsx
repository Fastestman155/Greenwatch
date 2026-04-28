import { createBrowserRouter, Navigate } from 'react-router';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import ReportIncidentPage from './pages/ReportIncidentPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AnalyticsPage from './pages/AnalyticsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/dashboard',
    element: <CitizenDashboard />
  },
  {
    path: '/report',
    element: <ReportIncidentPage />
  },
  {
    path: '/incident/:id',
    element: <IncidentDetailsPage />
  },
  {
    path: '/authority/dashboard',
    element: <AuthorityDashboard />
  },
  {
    path: '/authority/reports',
    element: <AuthorityDashboard />
  },
  {
    path: '/authority/analytics',
    element: <AnalyticsPage />
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold mb-4">404</div>
          <div className="text-xl font-mono mb-4">PAGE NOT FOUND</div>
          <a href="/login" className="font-mono underline">Go to Login</a>
        </div>
      </div>
    )
  }
]);
