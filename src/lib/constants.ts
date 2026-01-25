/**
 * Application constants.
 */

import { cdnUrl } from './cdn';

// Revalidation times (in seconds)
export const REVALIDATE_1H = 3600;
export const REVALIDATE_15M = 900;
export const REVALIDATE_24H = 86400;

// Default pagination
export const DEFAULT_PAGE_SIZE = 10;

// Image placeholders
export const PLACEHOLDER_IMAGE = cdnUrl('/images/placeholder.jpg');

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
