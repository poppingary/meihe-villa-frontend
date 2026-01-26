const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Use status text if JSON parsing fails
    }
    throw new ApiError(response.status, errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Generic CRUD functions
export function createCrudService<T, CreateT, UpdateT>(basePath: string) {
  return {
    list: async (params?: Record<string, string | number | boolean>): Promise<T[]> => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }
      const query = searchParams.toString();
      return adminFetch<T[]>(`${basePath}${query ? `?${query}` : ''}`);
    },

    get: async (id: string | number): Promise<T> => {
      return adminFetch<T>(`${basePath}/${id}`);
    },

    create: async (data: CreateT): Promise<T> => {
      return adminFetch<T>(basePath, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string | number, data: UpdateT): Promise<T> => {
      return adminFetch<T>(`${basePath}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string | number): Promise<void> => {
      return adminFetch<void>(`${basePath}/${id}`, {
        method: 'DELETE',
      });
    },
  };
}
