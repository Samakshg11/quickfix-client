// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginAPI, registerAPI, registerMechanicAPI, getMeAPI } from '../api/auth.api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const TOKEN_KEY = 'qf_token';
const USER_KEY = 'qf_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [initialLoading, setInitialLoading] = useState(true);

  // Persist helpers
  const persist = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  // Validate token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) { setInitialLoading(false); return; }
      try {
        const res = await getMeAPI();
        setUser(res.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      } catch {
        clearAuth();
      } finally {
        setInitialLoading(false);
      }
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await loginAPI({ email, password });
    persist(res.data.token, res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (data) => {
    const res = await registerAPI(data);
    persist(res.data.token, res.data.user);
    return res.data.user;
  }, []);

  const registerMechanic = useCallback(async (data) => {
    const res = await registerMechanicAPI(data);
    toast.success('Registration submitted! Awaiting admin approval.');
    return res.data;
  }, []);

  const logout = useCallback((silent = false) => {
    clearAuth();
    if (!silent) toast.success('Logged out.');
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      initialLoading,
      isAuthenticated: !!user,
      isUser: user?.role === 'user',
      isMechanic: user?.role === 'mechanic',
      isAdmin: user?.role === 'admin',
      login,
      register,
      registerMechanic,
      logout,
      updateUser,
    }}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
