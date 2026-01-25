/**
 * Navigation configuration.
 */

import type { NavItem } from '@/types/common';

export const mainNavItems: NavItem[] = [
  {
    label: 'Home',
    label_zh: '首頁',
    href: '/',
  },
  {
    label: 'About',
    label_zh: '關於',
    href: '/about',
  },
  {
    label: 'Architecture',
    label_zh: '建築',
    href: '/architecture',
  },
  {
    label: 'Gallery',
    label_zh: '相簿',
    href: '/gallery',
  },
  {
    label: 'Visit',
    label_zh: '參觀',
    href: '/visit',
  },
  {
    label: 'News',
    label_zh: '最新消息',
    href: '/news',
  },
];

export const footerNavItems: NavItem[] = [
  {
    label: 'Privacy Policy',
    label_zh: '隱私政策',
    href: '/privacy',
  },
  {
    label: 'Terms of Service',
    label_zh: '服務條款',
    href: '/terms',
  },
  {
    label: 'Contact',
    label_zh: '聯絡我們',
    href: '/contact',
  },
];
