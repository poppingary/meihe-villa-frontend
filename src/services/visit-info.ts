/**
 * Visit Info API service functions.
 */

import { fetchApi } from './api';
import type { VisitInfo } from '@/types/heritage';

const REVALIDATE_TIME = 86400; // 24 hours

/**
 * Get all active visit info items.
 */
export async function getVisitInfo(): Promise<VisitInfo[]> {
  try {
    const info = await fetchApi<VisitInfo[]>('/api/v1/visit-info', {
      revalidate: REVALIDATE_TIME,
      tags: ['visit-info'],
    });
    // Filter to only active items and sort by display_order
    return info
      .filter((item) => item.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  } catch (error) {
    console.error('Failed to fetch visit info:', error);
    return [];
  }
}

/**
 * Get visit info by section.
 */
export async function getVisitInfoBySection(
  section: string
): Promise<VisitInfo | null> {
  try {
    return await fetchApi<VisitInfo>(`/api/v1/visit-info/section/${section}`, {
      revalidate: REVALIDATE_TIME,
      tags: ['visit-info', `visit-info-${section}`],
    });
  } catch (error) {
    console.error(`Failed to fetch visit info for section ${section}:`, error);
    return null;
  }
}

/**
 * Parse extra_data JSON string from visit info.
 */
export function parseExtraData<T = Record<string, unknown>>(
  extraData: string | null
): T | null {
  if (!extraData) return null;
  try {
    return JSON.parse(extraData) as T;
  } catch {
    return null;
  }
}
