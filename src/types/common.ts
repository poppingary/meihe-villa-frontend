/**
 * Common TypeScript types used across the application.
 */

export type Locale = 'en' | 'zh-TW';

export interface NavItem {
  label: string;
  label_zh: string;
  href: string;
}

export interface SiteMetadata {
  name: string;
  name_zh: string;
  description: string;
  description_zh: string;
  url: string;
}
