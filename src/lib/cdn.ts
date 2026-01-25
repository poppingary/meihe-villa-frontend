/**
 * CDN URL utility for image paths.
 */

/**
 * Convert a local image path to CDN URL.
 * - Returns as-is if already a full URL (http/https)
 * - Returns as-is if path is empty/null
 * - Prefixes with CDN URL for relative paths
 *
 * @param path - The image path (can be relative or absolute URL)
 * @returns Full CDN URL or original path
 */
export function cdnUrl(path: string | null | undefined): string {
  if (!path) return '';

  // Already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cdnBase = process.env.NEXT_PUBLIC_CDN_URL;
  if (!cdnBase) return path;

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${cdnBase}${normalizedPath}`;
}

/**
 * Process an array of image paths to CDN URLs.
 */
export function cdnUrls(paths: string[]): string[] {
  return paths.map(cdnUrl);
}
