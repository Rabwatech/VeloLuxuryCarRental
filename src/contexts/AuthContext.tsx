import { createContext, useContext, useEffect, useState } from 'react';
import { adminAPI } from '../utils/api';
import type { Admin } from '../types';

interface AuthContextType {
  user: Admin | null;
  session: Admin | null; // For compatibility, using Admin as session
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'velo_admin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session in localStorage
    const storedSession = localStorage.getItem(ADMIN_SESSION_KEY);
    if (storedSession) {
      try {
        const admin = JSON.parse(storedSession);
        setUser(admin);
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await adminAPI.login({ email, password });
    if (!result.success) {
      throw new Error(result.error || 'Login failed');
    }
    if (!result.data) {
      throw new Error('Login failed: No user data returned');
    }
    
    // Store admin session in localStorage
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(result.data));
    setUser(result.data);
  };

  const signOut = async () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session: user, loading, signIn, signOut }}>
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
