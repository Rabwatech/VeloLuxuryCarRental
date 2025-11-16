import { createContext, useContext, useEffect, useState } from 'react';
import { adminAPI } from '../utils/api';
import type { Admin } from '../types';

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'velo_admin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
    if (sessionData) {
      try {
        const adminData = JSON.parse(sessionData);
        setAdmin(adminData);
      } catch (error) {
        console.error('Failed to parse admin session:', error);
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await adminAPI.login({ email, password });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Login failed');
      }

      // Store admin session
      setAdmin(result.data);
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(result.data));
    } catch (error: any) {
      throw new Error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
