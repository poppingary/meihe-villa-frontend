import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchApi, ApiError } from '@/services/api';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ApiError', () => {
  it('should create an error with status and statusText', () => {
    const error = new ApiError(404, 'Not Found', 'Resource not found');
    expect(error.status).toBe(404);
    expect(error.statusText).toBe('Not Found');
    expect(error.message).toBe('Resource not found');
    expect(error.name).toBe('ApiError');
  });

  it('should be an instance of Error', () => {
    const error = new ApiError(500, 'Server Error', 'Something went wrong');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('fetchApi', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8888';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  describe('successful requests', () => {
    it('should fetch data from API and return JSON', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchApi('/api/v1/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8888/api/v1/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should merge custom headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await fetchApi('/api/v1/test', {
        headers: { Authorization: 'Bearer token123' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer token123',
          }),
        })
      );
    });

    it('should pass revalidate option to next config', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await fetchApi('/api/v1/test', { revalidate: 3600 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: expect.objectContaining({ revalidate: 3600 }),
        })
      );
    });

    it('should pass tags option to next config', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await fetchApi('/api/v1/test', { tags: ['heritage-sites'] });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: expect.objectContaining({ tags: ['heritage-sites'] }),
        })
      );
    });

    it('should handle POST requests with body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      });

      await fetchApi('/api/v1/test', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Test' }),
        })
      );
    });
  });

  describe('error handling', () => {
    it('should throw ApiError on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.reject(new Error('No JSON')),
      });

      await expect(fetchApi('/api/v1/notfound')).rejects.toThrow(ApiError);

      const error = await fetchApi('/api/v1/notfound').catch((e) => e);
      expect(error.status).toBe(404);
      expect(error.statusText).toBe('Not Found');
    });

    it('should extract error detail from JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ detail: 'Invalid input data' }),
      });

      await expect(fetchApi('/api/v1/test')).rejects.toMatchObject({
        message: 'Invalid input data',
      });
    });

    it('should use statusText if JSON parsing fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(fetchApi('/api/v1/test')).rejects.toMatchObject({
        message: 'Internal Server Error',
      });
    });

    it('should throw ApiError with correct properties', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: () => Promise.resolve({ detail: 'Access denied' }),
      });

      try {
        await fetchApi('/api/v1/protected');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(403);
        expect((error as ApiError).statusText).toBe('Forbidden');
        expect((error as ApiError).message).toBe('Access denied');
      }
    });
  });

  describe('URL construction', () => {
    // Note: API_BASE_URL is evaluated at module load time from process.env
    // The setup.ts file stubs NEXT_PUBLIC_API_URL to 'http://localhost:8888'
    // So all tests use this URL regardless of env changes at runtime

    it('should construct URL with API base and endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await fetchApi('/api/v1/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8888/api/v1/test',
        expect.any(Object)
      );
    });

    it('should handle endpoints with query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await fetchApi('/api/v1/test?page=1&limit=10');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8888/api/v1/test?page=1&limit=10',
        expect.any(Object)
      );
    });
  });
});
