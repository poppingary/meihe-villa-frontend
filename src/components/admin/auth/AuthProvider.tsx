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
    console.log('[AuthProvider] checkAuth() called');
    try {
      const user = await authService.checkAuth();
      console.log('[AuthProvider] checkAuth() result:', user ? 'user found' : 'no user', user);
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
    } catch (error) {
      console.log('[AuthProvider] checkAuth() error:', error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    console.log('[AuthProvider] login() called');
    try {
      const response = await authService.login({ email, password });
      console.log('[AuthProvider] login() success, user:', response.user);
      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });
      console.log('[AuthProvider] Redirecting to /admin via window.location');
      window.location.href = '/admin';
    } catch (error) {
      console.log('[AuthProvider] login() error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.push('/admin/login');
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect unauthenticated users (except on login page)
  useEffect(() => {
    console.log('[AuthProvider] Redirect check (unauthenticated):', {
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated,
      pathname,
      shouldRedirect: !state.isLoading && !state.isAuthenticated && pathname !== '/admin/login'
    });
    if (!state.isLoading && !state.isAuthenticated && pathname !== '/admin/login') {
      console.log('[AuthProvider] Redirecting to /admin/login');
      router.replace('/admin/login');
    }
  }, [state.isLoading, state.isAuthenticated, pathname, router]);

  // Redirect authenticated users away from login page
  useEffect(() => {
    console.log('[AuthProvider] Redirect check (authenticated):', {
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated,
      pathname,
      shouldRedirect: !state.isLoading && state.isAuthenticated && pathname === '/admin/login'
    });
    if (!state.isLoading && state.isAuthenticated && pathname === '/admin/login') {
      console.log('[AuthProvider] Redirecting to /admin');
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
