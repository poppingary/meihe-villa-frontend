/**
 * TypeScript interfaces for heritage site data.
 * These interfaces match the backend Pydantic schemas from /backend/app/schemas/heritage.py
 */

export interface HeritageCategory {
  id: number;
  name: string;
  name_zh: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeritageSite {
  id: number;
  name: string;
  name_zh: string;
  slug: string;
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  description_zh: string | null;
  history: string | null;
  history_zh: string | null;
  featured_image: string | null;
  images: string | null; // JSON array as string
  designation_level: string | null;
  designation_date: string | null;
  is_published: boolean;
  category_id: number | null;
  category: HeritageCategory | null;
  created_at: string;
  updated_at: string;
}

export interface HeritageSiteCreate {
  name: string;
  name_zh: string;
  slug: string;
  address?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  description_zh?: string | null;
  history?: string | null;
  history_zh?: string | null;
  featured_image?: string | null;
  images?: string | null;
  designation_level?: string | null;
  designation_date?: string | null;
  is_published?: boolean;
  category_id?: number | null;
}

export interface HeritageSiteUpdate {
  name?: string | null;
  name_zh?: string | null;
  slug?: string | null;
  address?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  description_zh?: string | null;
  history?: string | null;
  history_zh?: string | null;
  featured_image?: string | null;
  images?: string | null;
  designation_level?: string | null;
  designation_date?: string | null;
  is_published?: boolean | null;
  category_id?: number | null;
}

// News types
export interface NewsItem {
  id: number;
  title: string;
  title_zh: string;
  slug: string;
  summary: string | null;
  summary_zh: string | null;
  content: string | null;
  content_zh: string | null;
  featured_image: string | null;
  images: string | null; // JSON array of image URLs
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsItemCreate {
  title: string;
  title_zh: string;
  slug: string;
  summary?: string | null;
  summary_zh?: string | null;
  content?: string | null;
  content_zh?: string | null;
  featured_image?: string | null;
  images?: string | null;
  category?: string | null;
  is_published?: boolean;
  published_at?: string | null;
}

export interface NewsItemUpdate {
  title?: string | null;
  title_zh?: string | null;
  slug?: string | null;
  summary?: string | null;
  summary_zh?: string | null;
  content?: string | null;
  content_zh?: string | null;
  featured_image?: string | null;
  images?: string | null;
  category?: string | null;
  is_published?: boolean | null;
  published_at?: string | null;
}

// Timeline types
export interface TimelineEvent {
  id: number;
  year: number;
  month: number | null;
  day: number | null;
  era: string | null;
  era_year: string | null;
  title: string;
  title_zh: string;
  description: string | null;
  description_zh: string | null;
  image: string | null;
  category: string | null;
  importance: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimelineEventCreate {
  year: number;
  month?: number | null;
  day?: number | null;
  era?: string | null;
  era_year?: string | null;
  title: string;
  title_zh: string;
  description?: string | null;
  description_zh?: string | null;
  image?: string | null;
  category?: string | null;
  importance?: string | null;
  is_published?: boolean;
}

export interface TimelineEventUpdate {
  year?: number | null;
  month?: number | null;
  day?: number | null;
  era?: string | null;
  era_year?: string | null;
  title?: string | null;
  title_zh?: string | null;
  description?: string | null;
  description_zh?: string | null;
  image?: string | null;
  category?: string | null;
  importance?: string | null;
  is_published?: boolean | null;
}

// Visit info types
export interface VisitInfo {
  id: number;
  section: string;
  title: string;
  title_zh: string;
  content: string | null;
  content_zh: string | null;
  extra_data: string | null; // JSON string
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VisitInfoCreate {
  section: string;
  title: string;
  title_zh: string;
  content?: string | null;
  content_zh?: string | null;
  extra_data?: string | null;
  display_order?: number;
  is_active?: boolean;
}

export interface VisitInfoUpdate {
  section?: string | null;
  title?: string | null;
  title_zh?: string | null;
  content?: string | null;
  content_zh?: string | null;
  extra_data?: string | null;
  display_order?: number | null;
  is_active?: boolean | null;
}
