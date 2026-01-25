import { adminFetch, createCrudService } from './api';
import type {
  VisitInfo,
  VisitInfoCreate,
  VisitInfoUpdate,
} from '@/types/heritage';

// Visit Info CRUD
export const visitInfoService = createCrudService<
  VisitInfo,
  VisitInfoCreate,
  VisitInfoUpdate
>('/api/v1/visit-info');

// Extended list function with admin params
export async function listVisitInfo(params?: {
  active_only?: boolean;
}): Promise<VisitInfo[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  // Default to show all (including inactive) for admin
  if (!searchParams.has('active_only')) {
    searchParams.append('active_only', 'false');
  }
  const query = searchParams.toString();
  return adminFetch<VisitInfo[]>(`/api/v1/visit-info${query ? `?${query}` : ''}`);
}
