/**
 * Heritage categories API service.
 */

import { fetchApi } from './api';
import type { HeritageCategory } from '@/types/heritage';

const BASE_PATH = '/api/v1/heritage/categories';

// Cache duration in seconds
const REVALIDATE_24H = 86400;

export async function getCategories(): Promise<HeritageCategory[]> {
  return fetchApi<HeritageCategory[]>(BASE_PATH, {
    revalidate: REVALIDATE_24H,
    tags: ['categories'],
  });
}

export async function createCategory(data: {
  name: string;
  name_zh: string;
  description?: string;
}): Promise<HeritageCategory> {
  return fetchApi<HeritageCategory>(BASE_PATH, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
