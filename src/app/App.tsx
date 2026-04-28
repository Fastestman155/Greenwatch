import { RouterProvider } from 'react-router';
import { useNavigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IncidentsProvider } from './context/IncidentsContext';
import { NotificationProvider } from './context/NotificationContext';
import { router } from './routes';
import { useEffect } from 'react';

function AuthGuard() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <IncidentsProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </IncidentsProvider>
    </AuthProvider>
  );
}