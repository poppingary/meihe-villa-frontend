import { describe, it, expect } from 'vitest';
import { cn, truncateText, formatDate, parseImages } from '@/lib/utils';

describe('cn (className merge utility)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz');
  });

  it('should merge Tailwind classes correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });
});

describe('truncateText', () => {
  it('should return original text if shorter than maxLength', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('should return original text if equal to maxLength', () => {
    expect(truncateText('hello', 5)).toBe('hello');
  });

  it('should truncate and add ellipsis if longer than maxLength', () => {
    expect(truncateText('hello world', 5)).toBe('hello...');
  });

  it('should trim whitespace before adding ellipsis', () => {
    expect(truncateText('hello world', 6)).toBe('hello...');
  });

  it('should handle empty string', () => {
    expect(truncateText('', 5)).toBe('');
  });

  it('should handle maxLength of 0', () => {
    expect(truncateText('hello', 0)).toBe('...');
  });
});

describe('formatDate', () => {
  it('should format date in Traditional Chinese locale', () => {
    const result = formatDate('2024-01-15');
    // Result should contain year, month, day in Chinese format
    expect(result).toContain('2024');
    expect(result).toContain('1');
    expect(result).toContain('15');
  });

  it('should handle ISO date strings', () => {
    const result = formatDate('2024-06-30T12:00:00Z');
    expect(result).toContain('2024');
  });

  it('should handle date with timezone', () => {
    const result = formatDate('2024-12-25T00:00:00+08:00');
    expect(result).toContain('2024');
    expect(result).toContain('12');
  });
});

describe('parseImages', () => {
  it('should return empty array for null', () => {
    expect(parseImages(null)).toEqual([]);
  });

  it('should return empty array for undefined', () => {
    expect(parseImages(undefined)).toEqual([]);
  });

  it('should return empty array for empty string', () => {
    expect(parseImages('')).toEqual([]);
  });

  it('should return array as-is if already an array', () => {
    const input = ['/img1.jpg', '/img2.jpg'];
    expect(parseImages(input)).toEqual(input);
  });

  it('should parse JSON string array', () => {
    const input = '["/img1.jpg", "/img2.jpg"]';
    expect(parseImages(input)).toEqual(['/img1.jpg', '/img2.jpg']);
  });

  it('should return empty array for invalid JSON', () => {
    expect(parseImages('not valid json')).toEqual([]);
  });

  it('should return empty array for JSON that is not an array', () => {
    expect(parseImages('{"key": "value"}')).toEqual([]);
    expect(parseImages('"string"')).toEqual([]);
    expect(parseImages('123')).toEqual([]);
  });

  it('should handle empty JSON array', () => {
    expect(parseImages('[]')).toEqual([]);
  });
});
