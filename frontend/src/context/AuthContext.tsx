import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/user';

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const savedHouseholdId = localStorage.getItem('householdId');
      
      if (storedToken) {
        try {
          const response = await auth.getProfile();
          const userData = response.data as User;
          
          // If we have a saved householdId and the user doesn't have one, use the saved one
          if (savedHouseholdId && !userData.householdId) {
            userData.householdId = savedHouseholdId;
          }
          
          setUser(userData);
          setToken(storedToken);
          
          // Save householdId if it exists
          if (userData.householdId) {
            localStorage.setItem('householdId', userData.householdId);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('householdId');
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await auth.login(email, password);
      const { token, user } = response.data as AuthResponse;
      
      // Set token first
      setToken(token);
      localStorage.setItem('token', token);
      
      // Then set user
      setUser(user);
      
      // Save householdId if it exists
      if (user.householdId) {
        localStorage.setItem('householdId', user.householdId);
      }
      
      // Navigate to dashboard after successful login
      navigate('/');
      
      return Promise.resolve();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', error);
      return Promise.reject(error);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      const response = await auth.register(username, email, password);
      const { token, user } = response.data as AuthResponse;
      
      // Set token first
      setToken(token);
      localStorage.setItem('token', token);
      
      // Then set user
      setUser(user);
      
      // Save householdId if it exists
      if (user.householdId) {
        localStorage.setItem('householdId', user.householdId);
      }
      
      // Navigate to dashboard after successful registration
      navigate('/');
      
      return Promise.resolve();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', error);
      return Promise.reject(error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('householdId');
    navigate('/login');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    
    // Update householdId in localStorage if it changed
    if (updatedUser.householdId) {
      localStorage.setItem('householdId', updatedUser.householdId);
    } else {
      localStorage.removeItem('householdId');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    // Implementation for signup method
  };

  return (
    <AuthContext.Provider value={{ user, token, error, isAuthenticated, login, register, logout, updateUser, signup }}>
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