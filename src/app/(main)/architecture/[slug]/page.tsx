import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroSection } from '@/components/sections/HeroSection';
import { GalleryGrid } from '@/components/sections/GalleryGrid';
import { getHeritageSiteBySlug, getPublishedSites } from '@/services/heritage';
import { parseImages } from '@/lib/utils';
import { generateHeritageSiteSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { cdnUrl } from '@/lib/cdn';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const sites = await getPublishedSites();
    return sites.map((site) => ({
      slug: site.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const site = await getHeritageSiteBySlug(slug);
    return {
      title: site.name_zh,
      description: site.description_zh || site.description || `${site.name_zh}的建築特色與歷史介紹`,
      openGraph: {
        title: site.name_zh,
        description: site.description_zh || site.description || undefined,
        images: site.featured_image ? [cdnUrl(site.featured_image)] : undefined,
      },
    };
  } catch {
    return {
      title: '建築特色',
    };
  }
}

export const revalidate = 3600; // Revalidate every hour

export default async function ArchitectureDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let site;
  try {
    site = await getHeritageSiteBySlug(slug);
  } catch {
    notFound();
  }

  const images = parseImages(site.images);
  const galleryImages = images.map((src, index) => ({
    src,
    alt: `${site.name_zh} - 照片 ${index + 1}`,
  }));

  // Add featured image if exists and not in gallery
  const featuredImageUrl = cdnUrl(site.featured_image);
  if (featuredImageUrl && !images.includes(featuredImageUrl)) {
    galleryImages.unshift({
      src: featuredImageUrl,
      alt: site.name_zh,
    });
  }

  // JSON-LD structured data
  const jsonLd = generateHeritageSiteSchema(site);
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: '首頁', url: siteConfig.url },
    { name: '建築', url: `${siteConfig.url}/architecture` },
    { name: site.name_zh, url: `${siteConfig.url}/architecture/${site.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <HeroSection
        title={site.name_zh}
        subtitle={site.name}
        description={site.designation_level || undefined}
        backgroundImage={cdnUrl(site.featured_image) || cdnUrl('/images/architecture-hero.jpg')}
        className="min-h-[50vh]"
      />

      {/* Breadcrumb */}
      <section className="border-b border-stone-200 bg-white py-4">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="hover:text-stone-900">
              首頁
            </Link>
            <span>/</span>
            <Link href="/architecture" className="hover:text-stone-900">
              建築
            </Link>
            <span>/</span>
            <span className="text-stone-900">{site.name_zh}</span>
          </nav>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Description */}
            {(site.description_zh || site.description) && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">
                  簡介
                </h2>
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-stone-600">
                  {site.description_zh && <p>{site.description_zh}</p>}
                  {site.description && site.description !== site.description_zh && (
                    <p className="text-stone-500 italic">{site.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* History */}
            {(site.history_zh || site.history) && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">
                  歷史沿革
                </h2>
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-stone-600">
                  {site.history_zh &&
                    site.history_zh.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  {site.history && site.history !== site.history_zh && (
                    <div className="mt-8 border-t border-stone-200 pt-6">
                      <p className="text-sm text-stone-400 uppercase tracking-wide mb-4">
                        English
                      </p>
                      {site.history.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-stone-500">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Site Information */}
            <div className="mb-12 rounded-lg bg-stone-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">
                基本資訊
              </h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {site.address && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500">地址</dt>
                    <dd className="mt-1 text-stone-900">{site.address}</dd>
                  </div>
                )}
                {site.city && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500">城市</dt>
                    <dd className="mt-1 text-stone-900">{site.city}</dd>
                  </div>
                )}
                {site.designation_level && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500">
                      指定等級
                    </dt>
                    <dd className="mt-1 text-stone-900">
                      {site.designation_level}
                    </dd>
                  </div>
                )}
                {site.designation_date && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500">
                      指定日期
                    </dt>
                    <dd className="mt-1 text-stone-900">
                      {new Date(site.designation_date).toLocaleDateString(
                        'zh-TW',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </dd>
                  </div>
                )}
                {site.category && (
                  <div>
                    <dt className="text-sm font-medium text-stone-500">類別</dt>
                    <dd className="mt-1 text-stone-900">
                      {site.category.name_zh}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="bg-stone-100 py-16 md:py-24">
          <Container>
            <h2 className="mb-8 text-center text-2xl font-bold text-stone-900 md:text-3xl">
              照片集
            </h2>
          </Container>
          <GalleryGrid images={galleryImages} />
        </section>
      )}

      {/* Navigation */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/architecture">
              <Button variant="outline">返回建築列表</Button>
            </Link>
            <Link href="/visit">
              <Button>參觀資訊</Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
