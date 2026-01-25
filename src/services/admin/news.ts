import { adminFetch, createCrudService } from './api';
import type { NewsItem, NewsItemCreate, NewsItemUpdate } from '@/types/heritage';

// News CRUD
export const newsService = createCrudService<
  NewsItem,
  NewsItemCreate,
  NewsItemUpdate
>('/api/v1/news');

// Extended list function with admin params
export async function listNews(params?: {
  skip?: number;
  limit?: number;
  category?: string;
  published_only?: boolean;
}): Promise<NewsItem[]> {
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
  return adminFetch<NewsItem[]>(`/api/v1/news${query ? `?${query}` : ''}`);
}
