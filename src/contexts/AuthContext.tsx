'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { getCurrentUser, setCurrentUser, loginUser, registerUser, logout, AuthResult } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string, name: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (email: string, password: string): Promise<AuthResult> => {
    const result = await loginUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setCurrentUser(result.user);
    }
    return result;
  };

  const handleRegister = async (email: string, password: string, name: string): Promise<AuthResult> => {
    const result = await registerUser(email, password, name);
    if (result.success && result.user) {
      setUser(result.user);
      setCurrentUser(result.user);
    }
    return result;
  };

  const handleLogout = () => {
    setUser(null);
    logout();
  };

  const value = {
    user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
