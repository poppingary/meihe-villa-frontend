export type UserRole = 'admin' | 'superadmin';

export interface User {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  role: UserRole;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface UserCreate {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

export interface UserUpdate {
  email?: string;
  password?: string;
  name?: string;
  is_active?: boolean;
  role?: UserRole;
}

export interface UserListResponse {
  items: User[];
  total: number;
}
