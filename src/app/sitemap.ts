import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getPublishedSites } from '@/services/heritage';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/architecture`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/visit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  // Dynamic pages from heritage sites
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const sites = await getPublishedSites();
    dynamicPages = sites.map((site) => ({
      url: `${baseUrl}/architecture/${site.slug}`,
      lastModified: new Date(site.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // If API fails, continue with static pages only
  }

  // Static news pages (until backend supports news)
  const newsPages: MetadataRoute.Sitemap = [
    'spring-exhibition-2024',
    'guided-tour-program',
    'restoration-project-complete',
    'cultural-workshop',
  ].map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...dynamicPages, ...newsPages];
}
