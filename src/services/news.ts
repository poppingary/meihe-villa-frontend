/**
 * News API service functions.
 */

import { fetchApi } from './api';
import type { NewsItem } from '@/types/heritage';

const REVALIDATE_TIME = 900; // 15 minutes

/**
 * Get all published news items.
 */
export async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const news = await fetchApi<NewsItem[]>('/api/v1/news', {
      revalidate: REVALIDATE_TIME,
      tags: ['news'],
    });
    // Filter to only published items and sort by published_at descending
    return news
      .filter((item) => item.is_published)
      .sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      });
  } catch (error) {
    console.error('Failed to fetch news items:', error);
    return [];
  }
}

/**
 * Get a news item by slug.
 */
export async function getNewsItemBySlug(
  slug: string
): Promise<NewsItem | null> {
  try {
    return await fetchApi<NewsItem>(`/api/v1/news/slug/${slug}`, {
      revalidate: REVALIDATE_TIME,
      tags: ['news', `news-${slug}`],
    });
  } catch (error) {
    console.error(`Failed to fetch news item with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all news slugs for static generation.
 */
export async function getAllNewsSlugs(): Promise<string[]> {
  const news = await getNewsItems();
  return news.map((item) => item.slug);
}
