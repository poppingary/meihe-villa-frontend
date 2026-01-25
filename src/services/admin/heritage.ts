import { adminFetch, createCrudService } from './api';
import type {
  HeritageSite,
  HeritageSiteCreate,
  HeritageSiteUpdate,
  HeritageCategory,
} from '@/types/heritage';

// Category create type
export interface HeritageCategoryCreate {
  name: string;
  name_zh: string;
  description?: string | null;
}

// Sites CRUD
export const heritageSitesService = createCrudService<
  HeritageSite,
  HeritageSiteCreate,
  HeritageSiteUpdate
>('/api/v1/heritage/sites');

// Extended list function with admin params
export async function listHeritageSites(params?: {
  skip?: number;
  limit?: number;
  city?: string;
  category_id?: number;
  published_only?: boolean;
}): Promise<HeritageSite[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  // Default to show all (including unpublished) for admin
  if (!searchParams.has('published_only')) {
    searchParams.append('published_only', 'false');
  }
  const query = searchParams.toString();
  return adminFetch<HeritageSite[]>(`/api/v1/heritage/sites${query ? `?${query}` : ''}`);
}

// Categories CRUD
export const heritageCategoriesService = createCrudService<
  HeritageCategory,
  HeritageCategoryCreate,
  Partial<HeritageCategoryCreate>
>('/api/v1/heritage/categories');

export async function listHeritageCategories(): Promise<HeritageCategory[]> {
  return adminFetch<HeritageCategory[]>('/api/v1/heritage/categories');
}
