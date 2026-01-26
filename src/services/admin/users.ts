import { adminFetch } from './api';
import type { User, UserCreate, UserUpdate, UserListResponse } from '@/types/admin/auth';

export async function listUsers(): Promise<UserListResponse> {
  return adminFetch<UserListResponse>('/api/v1/users');
}

export async function getUser(id: string): Promise<User> {
  return adminFetch<User>(`/api/v1/users/${id}`);
}

export async function createUser(data: UserCreate): Promise<User> {
  return adminFetch<User>('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: string, data: UserUpdate): Promise<User> {
  return adminFetch<User>(`/api/v1/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: string): Promise<void> {
  await adminFetch(`/api/v1/users/${id}`, {
    method: 'DELETE',
  });
}
