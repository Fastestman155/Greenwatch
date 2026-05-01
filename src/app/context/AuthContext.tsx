import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../../utils/api';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: 'citizen' | 'authority' | null;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, role: 'citizen' | 'authority') => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'greenwatch_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'citizen' | 'authority' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const { email, role } = JSON.parse(session);
        setIsLoggedIn(true);
        setUserRole(role);
        setUserEmail(email);
      } catch (error) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const register = async (email: string, password: string, role: 'citizen' | 'authority') => {
    // Validate email format
    if (!validateEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Validate password length
    if (!validatePassword(password)) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    try {
      const response = await authApi.register(email, password, role);

      if (response.success) {
        return { success: true, message: 'Account created successfully' };
      } else {
        return { success: false, message: response.error || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const login = async (email: string, password: string) => {
    // Validate email format
    if (!validateEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    try {
      const response = await authApi.login(email, password);

      if (response.success && response.user) {
        setIsLoggedIn(true);
        setUserRole(response.user.role);
        setUserEmail(response.user.email);

        // Save session
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          email: response.user.email,
          role: response.user.role,
          token: response.session.access_token
        }));

        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: response.error || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserEmail(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userEmail, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
