import { adminFetch } from './api';

export interface DashboardStats {
  total_sites: number;
  published_sites: number;
  draft_sites: number;
  total_categories: number;
  total_news: number;
  published_news: number;
  total_timeline_events: number;
  published_timeline_events: number;
  total_visit_info: number;
  active_visit_info: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return adminFetch<DashboardStats>('/api/v1/dashboard/stats');
}
