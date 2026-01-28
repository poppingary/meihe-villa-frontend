import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cdnUrl, cdnUrls } from '@/lib/cdn';

describe('cdnUrl', () => {
  const originalEnv = process.env.NEXT_PUBLIC_CDN_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_CDN_URL = 'https://cdn.example.com';
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_CDN_URL = originalEnv;
  });

  describe('with CDN configured', () => {
    it('should return empty string for null', () => {
      expect(cdnUrl(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(cdnUrl(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(cdnUrl('')).toBe('');
    });

    it('should return http URL as-is', () => {
      const url = 'http://example.com/image.jpg';
      expect(cdnUrl(url)).toBe(url);
    });

    it('should return https URL as-is', () => {
      const url = 'https://example.com/image.jpg';
      expect(cdnUrl(url)).toBe(url);
    });

    it('should prefix relative path with CDN URL', () => {
      expect(cdnUrl('/images/photo.jpg')).toBe(
        'https://cdn.example.com/images/photo.jpg'
      );
    });

    it('should add leading slash to path without one', () => {
      expect(cdnUrl('images/photo.jpg')).toBe(
        'https://cdn.example.com/images/photo.jpg'
      );
    });

    it('should handle paths with special characters', () => {
      expect(cdnUrl('/images/photo with spaces.jpg')).toBe(
        'https://cdn.example.com/images/photo with spaces.jpg'
      );
    });

    it('should handle deeply nested paths', () => {
      expect(cdnUrl('/images/2024/01/15/photo.jpg')).toBe(
        'https://cdn.example.com/images/2024/01/15/photo.jpg'
      );
    });
  });

  describe('without CDN configured', () => {
    beforeEach(() => {
      delete process.env.NEXT_PUBLIC_CDN_URL;
    });

    it('should return relative path as-is when CDN not configured', () => {
      expect(cdnUrl('/images/photo.jpg')).toBe('/images/photo.jpg');
    });

    it('should return path without leading slash as-is', () => {
      expect(cdnUrl('images/photo.jpg')).toBe('images/photo.jpg');
    });
  });
});

describe('cdnUrls', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CDN_URL = 'https://cdn.example.com';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_CDN_URL;
  });

  it('should convert array of paths to CDN URLs', () => {
    const paths = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
    const expected = [
      'https://cdn.example.com/img1.jpg',
      'https://cdn.example.com/img2.jpg',
      'https://cdn.example.com/img3.jpg',
    ];
    expect(cdnUrls(paths)).toEqual(expected);
  });

  it('should handle empty array', () => {
    expect(cdnUrls([])).toEqual([]);
  });

  it('should handle mixed paths (relative and absolute)', () => {
    const paths = ['/local.jpg', 'https://external.com/image.jpg'];
    const expected = [
      'https://cdn.example.com/local.jpg',
      'https://external.com/image.jpg',
    ];
    expect(cdnUrls(paths)).toEqual(expected);
  });

  it('should handle paths without leading slashes', () => {
    const paths = ['img1.jpg', 'img2.jpg'];
    const expected = [
      'https://cdn.example.com/img1.jpg',
      'https://cdn.example.com/img2.jpg',
    ];
    expect(cdnUrls(paths)).toEqual(expected);
  });
});
