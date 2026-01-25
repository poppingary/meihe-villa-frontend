import { adminFetch, createCrudService } from './api';
import type {
  TimelineEvent,
  TimelineEventCreate,
  TimelineEventUpdate,
} from '@/types/heritage';

// Timeline CRUD
export const timelineService = createCrudService<
  TimelineEvent,
  TimelineEventCreate,
  TimelineEventUpdate
>('/api/v1/timeline');

// Extended list function with admin params
export async function listTimelineEvents(params?: {
  skip?: number;
  limit?: number;
  category?: string;
  published_only?: boolean;
}): Promise<TimelineEvent[]> {
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
  return adminFetch<TimelineEvent[]>(`/api/v1/timeline${query ? `?${query}` : ''}`);
}
