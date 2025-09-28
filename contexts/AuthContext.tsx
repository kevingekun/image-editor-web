import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { login as apiLogin, register as apiRegister, getPoints as apiGetPoints } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string, turnstileToken: string) => Promise<void>;
  register: (username: string, password: string, turnstileToken: string) => Promise<void>;
  logout: () => void;
  updateUserPoints: (newPoints: number) => void;
  refreshUserPoints: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const fetchUserData = useCallback(async () => {
    if (token) {
      try {
        const { points } = await apiGetPoints();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser({...parsedUser, points});
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
        logout();
      }
    }
  }, [token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleAuthSuccess = (userData: { token: string; user: Omit<User, 'points'> }) => {
    setToken(userData.token);
    setUser({...userData.user, points: 0 }); // Points will be fetched separately
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    fetchUserData();
  };

  const login = async (username: string, password: string, turnstileToken: string) => {
    const data = await apiLogin(username, password, turnstileToken);
    handleAuthSuccess(data);
  };

  const register = async (username: string, password: string, turnstileToken: string) => {
    const data = await apiRegister(username, password, turnstileToken);
    handleAuthSuccess(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUserPoints = (newPoints: number) => {
      if (user) {
          setUser({...user, points: newPoints });
      }
  }
  
  const refreshUserPoints = async () => {
      if(user) {
          const { points } = await apiGetPoints();
          updateUserPoints(points);
      }
  }

  const value = {
    isAuthenticated: !!token,
    user,
    login,
    register,
    logout,
    updateUserPoints,
    refreshUserPoints
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};