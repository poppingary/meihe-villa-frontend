/**
 * Site configuration and metadata.
 */

import { cdnUrl } from '@/lib/cdn';

export const siteConfig = {
  name: 'Meihe Villa',
  name_zh: '梅鶴山莊',
  description:
    'Meihe Villa is a historic heritage site in Taiwan, showcasing traditional architecture and rich cultural history.',
  description_zh:
    '梅鶴山莊是台灣的歷史古蹟，展示傳統建築與豐富的文化歷史。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  locale: 'zh-TW',
  keywords: [
    '梅鶴山莊',
    'Meihe Villa',
    '台灣古蹟',
    'Taiwan heritage',
    '歷史建築',
    'historic architecture',
    '文化資產',
    'cultural heritage',
  ],
  author: {
    name: '梅鶴山莊',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  ogImage: cdnUrl('/images/og-image.jpg'),
  links: {
    facebook: '',
    instagram: '',
  },
};

export type SiteConfig = typeof siteConfig;
