'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, AuthState } from '@/types/admin/auth';
import * as authService from '@/services/admin/auth';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const checkAuth = useCallback(async () => {
    try {
      const user = await authService.checkAuth();
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
    } catch {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setState({
      user: response.user,
      isLoading: false,
      isAuthenticated: true,
    });
    // Use router.replace for client-side navigation after login
    router.replace('/admin');
  }, [router]);

  const logout = useCallback(async () => {
    await authService.logout();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.replace('/admin/login');
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect unauthenticated users (except on login page)
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [state.isLoading, state.isAuthenticated, pathname, router]);

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (!state.isLoading && state.isAuthenticated && pathname === '/admin/login') {
      router.replace('/admin');
    }
  }, [state.isLoading, state.isAuthenticated, pathname, router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
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
