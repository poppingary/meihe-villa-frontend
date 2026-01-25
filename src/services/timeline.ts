/**
 * Timeline API service functions.
 */

import { fetchApi } from './api';
import type { TimelineEvent } from '@/types/heritage';

const REVALIDATE_TIME = 86400; // 24 hours

/**
 * Get all published timeline events.
 */
export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  try {
    const events = await fetchApi<TimelineEvent[]>('/api/v1/timeline', {
      revalidate: REVALIDATE_TIME,
      tags: ['timeline'],
    });
    // Filter to only published events and sort by year ascending
    return events
      .filter((event) => event.is_published)
      .sort((a, b) => a.year - b.year);
  } catch (error) {
    console.error('Failed to fetch timeline events:', error);
    return [];
  }
}

/**
 * Get major timeline events only (for summary display).
 */
export async function getMajorTimelineEvents(): Promise<TimelineEvent[]> {
  const events = await getTimelineEvents();
  return events.filter((event) => event.importance === 'major');
}
