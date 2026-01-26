/**
 * Base API client with SSG caching support.
 * This is used for server-side rendering (SSR/SSG) which requires full URL.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

export interface FetchOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate, tags, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const nextOptions: { revalidate?: number | false; tags?: string[] } = {};
  if (revalidate !== undefined) {
    nextOptions.revalidate = revalidate;
  }
  if (tags) {
    nextOptions.tags = tags;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    next: Object.keys(nextOptions).length > 0 ? nextOptions : undefined,
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Use status text if JSON parsing fails
    }
    throw new ApiError(response.status, response.statusText, errorMessage);
  }

  return response.json();
}
