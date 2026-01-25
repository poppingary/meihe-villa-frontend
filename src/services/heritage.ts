/**
 * Heritage sites API service.
 */

import { fetchApi } from './api';
import type { HeritageSite, HeritageSiteCreate, HeritageSiteUpdate } from '@/types/heritage';
import type { HeritageSiteListParams } from '@/types/api';

const BASE_PATH = '/api/v1/heritage/sites';

// Cache durations in seconds
const REVALIDATE_1H = 3600;
const REVALIDATE_15M = 900;

export async function getHeritageSites(
  params: HeritageSiteListParams = {}
): Promise<HeritageSite[]> {
  const searchParams = new URLSearchParams();

  if (params.skip !== undefined) {
    searchParams.set('skip', params.skip.toString());
  }
  if (params.limit !== undefined) {
    searchParams.set('limit', params.limit.toString());
  }
  if (params.city) {
    searchParams.set('city', params.city);
  }
  if (params.category_id !== undefined) {
    searchParams.set('category_id', params.category_id.toString());
  }
  if (params.published_only !== undefined) {
    searchParams.set('published_only', params.published_only.toString());
  }

  const query = searchParams.toString();
  const endpoint = query ? `${BASE_PATH}?${query}` : BASE_PATH;

  return fetchApi<HeritageSite[]>(endpoint, {
    revalidate: REVALIDATE_1H,
    tags: ['heritage-sites'],
  });
}

export async function getHeritageSiteById(id: number): Promise<HeritageSite> {
  return fetchApi<HeritageSite>(`${BASE_PATH}/${id}`, {
    revalidate: REVALIDATE_1H,
    tags: ['heritage-sites', `heritage-site-${id}`],
  });
}

export async function getHeritageSiteBySlug(slug: string): Promise<HeritageSite> {
  return fetchApi<HeritageSite>(`${BASE_PATH}/slug/${slug}`, {
    revalidate: REVALIDATE_1H,
    tags: ['heritage-sites', `heritage-site-${slug}`],
  });
}

export async function createHeritageSite(
  data: HeritageSiteCreate
): Promise<HeritageSite> {
  return fetchApi<HeritageSite>(BASE_PATH, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateHeritageSite(
  id: number,
  data: HeritageSiteUpdate
): Promise<HeritageSite> {
  return fetchApi<HeritageSite>(`${BASE_PATH}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteHeritageSite(id: number): Promise<void> {
  return fetchApi<void>(`${BASE_PATH}/${id}`, {
    method: 'DELETE',
  });
}

// Helper to get featured/main site data (for home page)
export async function getFeaturedSite(): Promise<HeritageSite | null> {
  try {
    return await getHeritageSiteBySlug('meihe-villa');
  } catch {
    return null;
  }
}

// Helper to get all published sites
export async function getPublishedSites(): Promise<HeritageSite[]> {
  try {
    return await getHeritageSites({ published_only: true });
  } catch {
    return [];
  }
}
