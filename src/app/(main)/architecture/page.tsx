import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { HeroSection } from '@/components/sections/HeroSection';
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { getPublishedSites } from '@/services/heritage';
import { truncateText } from '@/lib/utils';
import { heroImages, architectureCardImages, defaultPlaceholder } from '@/lib/placeholders';
import { cdnUrl } from '@/lib/cdn';

export const metadata: Metadata = {
  title: '建築特色',
  description: '探索梅鶴山莊的傳統建築特色與精緻工藝。',
};

export const revalidate = 3600; // Revalidate every hour

export default async function ArchitecturePage() {
  const sites = await getPublishedSites();

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="建築特色"
        subtitle="Architecture"
        description="探索傳統建築的精緻工藝"
        backgroundImage={heroImages.architecture}
        className="min-h-[40vh]"
      />

      {/* Introduction */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
              傳統建築之美
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[var(--wood-brown-light)]">
              梅鶴山莊的建築融合了傳統閩南風格與在地特色，從精緻的木雕、石雕到獨特的格局設計，
              處處展現著匠人的巧思與先人的建築智慧。每一處細節都訴說著歷史的故事。
            </p>
          </div>
        </Container>
      </section>

      {/* Architecture Features Grid */}
      <section className="bg-[var(--terracotta)] py-16 md:py-24">
        <Container>
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
            建築特色一覽
          </h2>

          {sites.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sites.map((site) => (
                <Link
                  key={site.id}
                  href={`/architecture/${site.slug}`}
                  className="block"
                >
                  <Card className="h-full transition-transform hover:-translate-y-1">
                    <CardImage
                      src={cdnUrl(site.featured_image) || architectureCardImages[site.id % architectureCardImages.length] || defaultPlaceholder}
                      alt={site.name_zh}
                      className="bg-[var(--terracotta-dark)]"
                    />
                    <CardContent>
                      <CardTitle>{site.name_zh}</CardTitle>
                      <p className="mt-1 text-sm text-[var(--wood-brown-light)]">{site.name}</p>
                      {site.description_zh && (
                        <CardDescription>
                          {truncateText(site.description_zh, 100)}
                        </CardDescription>
                      )}
                      {site.designation_level && (
                        <span className="mt-3 inline-block rounded bg-[var(--terracotta)] px-2 py-1 text-xs text-[var(--wood-brown-light)]">
                          {site.designation_level}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-[var(--wood-brown-light)]">建築資料整理中...</p>
            </div>
          )}
        </Container>
      </section>

      {/* Architectural Elements */}
      <section className="py-16 md:py-24">
        <Container>
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
            建築元素
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--terracotta)]">
                <svg
                  className="h-6 w-6 text-[var(--wood-brown-light)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--wood-brown)]">格局配置</h3>
              <p className="mt-2 text-[var(--wood-brown-light)]">
                傳統合院建築格局，講究對稱與風水，展現先人的居住智慧。
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--terracotta)]">
                <svg
                  className="h-6 w-6 text-[var(--wood-brown-light)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--wood-brown)]">木雕工藝</h3>
              <p className="mt-2 text-[var(--wood-brown-light)]">
                精緻的木雕裝飾，包含花鳥、人物、吉祥圖案，展現匠人技藝。
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--terracotta)]">
                <svg
                  className="h-6 w-6 text-[var(--wood-brown-light)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--wood-brown)]">石雕藝術</h3>
              <p className="mt-2 text-[var(--wood-brown-light)]">
                門楣、柱礎等處的石雕裝飾，融合實用與美觀。
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--terracotta)]">
                <svg
                  className="h-6 w-6 text-[var(--wood-brown-light)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--wood-brown)]">屋頂形式</h3>
              <p className="mt-2 text-[var(--wood-brown-light)]">
                傳統燕尾脊、馬背等屋頂形式，展現閩南建築特色。
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--terracotta)]">
                <svg
                  className="h-6 w-6 text-[var(--wood-brown-light)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--wood-brown)]">彩繪裝飾</h3>
              <p className="mt-2 text-[var(--wood-brown-light)]">
                樑柱、門板上的彩繪，以傳統顏料繪製吉祥圖案。
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--terracotta)]">
                <svg
                  className="h-6 w-6 text-[var(--wood-brown-light)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--wood-brown)]">建材特色</h3>
              <p className="mt-2 text-[var(--wood-brown-light)]">
                使用在地建材，包含紅磚、石材、木材，展現地域特色。
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
