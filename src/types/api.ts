/**
 * TypeScript interfaces for API responses and requests.
 */

export interface ApiError {
  detail: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ListParams {
  skip?: number;
  limit?: number;
}

export interface HeritageSiteListParams extends ListParams {
  city?: string;
  category_id?: number;
  published_only?: boolean;
}
