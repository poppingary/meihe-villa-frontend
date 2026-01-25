/**
 * Image paths for the Meihe Villa website.
 * These are local images downloaded from various sources documenting the actual 梅鶴山莊.
 */

import { cdnUrl } from './cdn';

// Hero images - large images for hero sections
export const heroImages = {
  home: cdnUrl('/images/hero/hero-main.jpg'), // 門樓 main entrance
  about: cdnUrl('/images/about/about-hero.jpg'), // 門樓
  architecture: cdnUrl('/images/hero/hero-architecture.jpg'), // 燕尾屋脊
  gallery: cdnUrl('/images/hero/hero-gallery.jpg'), // 吉慶堂
  visit: cdnUrl('/images/visit/visit-hero.jpg'), // 正門
  news: cdnUrl('/images/hero/hero-news.jpg'), // 靜遠堂
};

// Quick nav cards on home page
export const quickNavImages = {
  about: cdnUrl('/images/about/about-hero.jpg'),
  architecture: cdnUrl('/images/architecture/zhengting.jpg'), // 正廳
  gallery: cdnUrl('/images/gallery/gallery-1.jpg'),
  visit: cdnUrl('/images/visit/visit-hero.jpg'),
};

// Gallery images - photos of the villa
export const galleryImages = [
  {
    src: cdnUrl('/images/gallery/gallery-1.jpg'),
    alt: '山莊外觀',
    category: '建築',
  },
  {
    src: cdnUrl('/images/gallery/gallery-2.jpg'),
    alt: '庭院景觀',
    category: '庭院',
  },
  {
    src: cdnUrl('/images/gallery/gallery-3.jpg'),
    alt: '三合院整修',
    category: '建築',
  },
  {
    src: cdnUrl('/images/gallery/gallery-4.jpg'),
    alt: '榮封第門額',
    category: '工藝',
  },
  {
    src: cdnUrl('/images/gallery/gallery-5.jpg'),
    alt: '簷廊屋架',
    category: '建築',
  },
  {
    src: cdnUrl('/images/gallery/gallery-6.jpg'),
    alt: '燕尾屋脊',
    category: '建築',
  },
  {
    src: cdnUrl('/images/gallery/gallery-7.jpg'),
    alt: '靜遠堂',
    category: '廳堂',
  },
  {
    src: cdnUrl('/images/gallery/gallery-8.jpg'),
    alt: '吉慶堂',
    category: '廳堂',
  },
  {
    src: cdnUrl('/images/gallery/gallery-9.jpg'),
    alt: '山莊正門',
    category: '建築',
  },
];

// News images
export const newsImages = {
  'spring-exhibition-2024': cdnUrl('/images/news/news-1.jpg'),
  'guided-tour-program': cdnUrl('/images/news/news-2.jpg'),
  'restoration-project-complete': cdnUrl('/images/news/news-3.jpg'),
  'cultural-workshop': cdnUrl('/images/news/news-4.jpg'),
};

// Default placeholder for missing images
export const defaultPlaceholder = cdnUrl('/images/hero/hero-main.jpg');

// Architecture card placeholders
export const architectureCardImages = [
  cdnUrl('/images/architecture/zhengting.jpg'), // 正廳
  cdnUrl('/images/architecture/jiqing-tang.jpg'), // 吉慶堂
  cdnUrl('/images/architecture/jingyuan-tang.jpg'), // 靜遠堂
  cdnUrl('/images/architecture/rongfeng-di.jpg'), // 榮封第
  cdnUrl('/images/architecture/yanwei.jpg'), // 燕尾屋脊
  cdnUrl('/images/architecture/yanlang.jpg'), // 簷廊屋架
  cdnUrl('/images/architecture/zhengmen.jpg'), // 正門
];
