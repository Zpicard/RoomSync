import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../../frontend/src/api/client';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  householdId?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await auth.getProfile();
          setUser(response.data as User);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          logout();
        }
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await auth.login({ email, password });
      const { token, user } = response.data as AuthResponse;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      await auth.register({ username, email, password });
      await login(email, password);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 