import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { HeroSection } from '@/components/sections/HeroSection';
import { GalleryGrid } from '@/components/sections/GalleryGrid';
import { getPublishedSites } from '@/services/heritage';
import { parseImages } from '@/lib/utils';
import { heroImages, galleryImages as defaultGalleryImages } from '@/lib/placeholders';
import { cdnUrl } from '@/lib/cdn';

export const metadata: Metadata = {
  title: '相簿',
  description: '瀏覽梅鶴山莊的精選照片與歷史影像。',
};

export const revalidate = 3600; // Revalidate every hour

export default async function GalleryPage() {
  const sites = await getPublishedSites();

  // Collect all images from all sites
  const allImages: { src: string; alt: string; category: string }[] = [];
  const categories = new Set<string>();

  sites.forEach((site) => {
    const siteName = site.name_zh;
    categories.add(siteName);

    // Add featured image
    if (site.featured_image) {
      allImages.push({
        src: cdnUrl(site.featured_image),
        alt: `${siteName} - 主視覺`,
        category: siteName,
      });
    }

    // Add gallery images
    const images = parseImages(site.images);
    images.forEach((src, index) => {
      allImages.push({
        src: cdnUrl(src),
        alt: `${siteName} - 照片 ${index + 1}`,
        category: siteName,
      });
    });
  });

  // If no images from API, use local placeholder images
  const displayImages = allImages.length > 0 ? allImages : defaultGalleryImages;

  const displayCategories = allImages.length > 0
    ? Array.from(categories)
    : ['建築', '庭院', '工藝', '廳堂'];

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="相簿"
        subtitle="Gallery"
        description="透過影像感受歷史之美"
        backgroundImage={heroImages.gallery}
        className="min-h-[40vh]"
      />

      {/* Introduction */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
              影像紀錄
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[var(--wood-brown-light)]">
              我們用鏡頭記錄下梅鶴山莊的每一個角落，從宏偉的建築外觀到精緻的裝飾細節，
              每一張照片都訴說著這座古蹟的故事。歡迎瀏覽我們的照片集，感受歷史建築之美。
            </p>
          </div>
        </Container>
      </section>

      {/* Gallery Grid with Filter */}
      <section className="bg-[var(--terracotta)] py-16 md:py-24">
        <Container>
          <h2 className="mb-8 text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
            精選照片
          </h2>
        </Container>
        <GalleryGrid
          images={displayImages}
          categories={displayCategories}
        />
      </section>

      {/* Photography Info */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
              拍攝須知
            </h2>
            <div className="mt-8 rounded-lg bg-[var(--terracotta)] p-6 md:p-8">
              <ul className="space-y-4 text-[var(--wood-brown-light)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-xs">✓</span>
                  <span>歡迎一般拍照留念</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-xs">✓</span>
                  <span>可使用腳架拍攝（需注意不妨礙其他參觀者）</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs">✗</span>
                  <span>禁止使用閃光燈</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs">✗</span>
                  <span>商業攝影需事先申請許可</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs">✗</span>
                  <span>禁止使用空拍機</span>
                </li>
              </ul>
            </div>
            <p className="mt-6 text-center text-sm text-[var(--wood-brown-light)]">
              如需申請商業攝影或特殊拍攝許可，請聯繫我們的服務台
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
