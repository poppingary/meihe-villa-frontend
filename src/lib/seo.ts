/**
 * SEO utilities and JSON-LD schema generators.
 */

import { siteConfig } from '@/config/site';
import { cdnUrl } from '@/lib/cdn';
import type { HeritageSite } from '@/types/heritage';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate JSON-LD schema for a heritage site (LandmarksOrHistoricalBuildings).
 */
export function generateHeritageSiteSchema(site: HeritageSite) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LandmarksOrHistoricalBuildings',
    name: site.name_zh,
    alternateName: site.name,
    description: site.description_zh || site.description,
    image: cdnUrl(site.featured_image),
    address: site.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: site.address,
          addressLocality: site.city,
          addressCountry: 'TW',
        }
      : undefined,
    geo:
      site.latitude && site.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: site.latitude,
            longitude: site.longitude,
          }
        : undefined,
    url: `${siteConfig.url}/architecture/${site.slug}`,
  };
}

/**
 * Generate JSON-LD schema for breadcrumb navigation.
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD schema for the organization.
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name_zh,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description_zh,
  };
}

/**
 * Generate JSON-LD schema for the website.
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name_zh,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description_zh,
    inLanguage: ['zh-TW', 'en'],
  };
}
