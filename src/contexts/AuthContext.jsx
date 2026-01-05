import React, { createContext, useState, useContext, useEffect } from 'react';
import { storageService } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = storageService.loadSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic - in a real app this would call Firebase/API
    // Accepting any email/password for demo purposes, or specific one
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'user_123',
          email: email,
          name: email.split('@')[0],
          avatar: 'https://ui-avatars.com/api/?name=' + email.split('@')[0]
        };
        setUser(mockUser);
        storageService.saveSession(mockUser);
        resolve(mockUser);
      }, 800); // Simulate network delay
    });
  };

  const register = (name, email, password) => {
    // Mock register logic
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'user_' + Date.now(),
          email: email,
          name: name,
          avatar: 'https://ui-avatars.com/api/?name=' + name
        };
        setUser(mockUser);
        storageService.saveSession(mockUser);
        resolve(mockUser);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    storageService.clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
