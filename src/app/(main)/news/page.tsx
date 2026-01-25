import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { HeroSection } from '@/components/sections/HeroSection';
import {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { heroImages } from '@/lib/placeholders';
import { getNewsItems } from '@/services/news';
import { cdnUrl } from '@/lib/cdn';

export const metadata: Metadata = {
  title: '最新消息',
  description: '梅鶴山莊的最新活動、展覽與公告資訊。',
};

export const revalidate = 900; // Revalidate every 15 minutes

// Category display names mapping
const categoryNames: Record<string, string> = {
  event: '活動',
  announcement: '公告',
  exhibition: '展覽',
  restoration: '修復',
};

export default async function NewsPage() {
  const newsItems = await getNewsItems();

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="最新消息"
        subtitle="News"
        description="山莊的最新動態與活動資訊"
        backgroundImage={heroImages.news}
        className="min-h-[40vh]"
      />

      {/* News List */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {newsItems.map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="block">
                <Card className="h-full transition-transform hover:-translate-y-1">
                  <CardImage
                    src={cdnUrl(item.featured_image) || cdnUrl('/images/news/default.jpg')}
                    alt={item.title_zh}
                    className="bg-[var(--terracotta-dark)]"
                  />
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[var(--terracotta)] px-2 py-1 text-xs font-medium text-[var(--wood-brown-light)]">
                        {categoryNames[item.category || ''] || item.category || '消息'}
                      </span>
                      {item.published_at && (
                        <span className="text-sm text-[var(--wood-brown-light)]/70">
                          {new Date(item.published_at).toLocaleDateString('zh-TW', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                    <CardTitle className="mt-3">{item.title_zh}</CardTitle>
                    <CardDescription>
                      {item.summary_zh || item.content_zh?.slice(0, 100) + '...'}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {newsItems.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-[var(--wood-brown-light)]">目前沒有最新消息</p>
            </div>
          )}
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[var(--dark-ochre)] py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-[var(--warm-white)] md:text-4xl">
              訂閱電子報
            </h2>
            <p className="mt-4 text-lg text-[var(--terracotta)]">
              訂閱我們的電子報，第一時間獲得山莊的最新消息與活動資訊
            </p>
            <form className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="請輸入您的 Email"
                className="rounded-md border-0 px-4 py-3 text-[var(--wood-brown)] shadow-sm focus:ring-2 focus:ring-white sm:w-72"
              />
              <button
                type="submit"
                className="rounded-md bg-[var(--warm-white)] px-6 py-3 font-medium text-[var(--dark-ochre)] transition-colors hover:bg-[var(--terracotta)]"
              >
                訂閱
              </button>
            </form>
            <p className="mt-4 text-sm text-[var(--wood-brown-light)]/70">
              我們尊重您的隱私，不會將您的資料提供給第三方
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
