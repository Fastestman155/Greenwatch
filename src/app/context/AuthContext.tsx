import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  password: string;
  role: 'citizen' | 'authority';
}

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: 'citizen' | 'authority' | null;
  userEmail: string | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (email: string, password: string, role: 'citizen' | 'authority') => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'greenwatch_users';
const SESSION_KEY = 'greenwatch_session';

// Demo accounts pre-seeded for testing
const DEMO_ACCOUNTS: User[] = [
  { email: 'citizen@demo.com', password: 'citizen123', role: 'citizen' },
  { email: 'authority@demo.com', password: 'authority123', role: 'authority' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'citizen' | 'authority' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Initialize demo accounts and restore session
  useEffect(() => {
    // Initialize demo accounts if not already present
    const existingUsers = localStorage.getItem(STORAGE_KEY);
    if (!existingUsers) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ACCOUNTS));
    }

    // Restore session if exists
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
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const getUsers = (): User[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  };

  const register = (email: string, password: string, role: 'citizen' | 'authority') => {
    // Validate email format
    if (!validateEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Validate password length
    if (!validatePassword(password)) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const users = getUsers();

    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Account already exists with this email' };
    }

    // Create new user
    const newUser: User = { email, password, role };
    users.push(newUser);
    saveUsers(users);

    return { success: true, message: 'Account created successfully' };
  };

  const login = (email: string, password: string) => {
    // Validate email format
    if (!validateEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'No account found with this email' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }

    // Login successful
    setIsLoggedIn(true);
    setUserRole(user.role);
    setUserEmail(user.email);

    // Save session
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, role: user.role }));

    return { success: true, message: 'Login successful' };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserEmail(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userEmail, login, register, logout }}>
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
