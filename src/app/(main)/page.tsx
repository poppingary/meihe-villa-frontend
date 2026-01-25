import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroSection } from '@/components/sections/HeroSection';
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { getFeaturedSite } from '@/services/heritage';
import { siteConfig } from '@/config/site';
import { heroImages, quickNavImages } from '@/lib/placeholders';
import { cdnUrl } from '@/lib/cdn';

export const revalidate = 3600; // Revalidate every hour

// Quick navigation cards for the home page
const quickNavItems = [
  {
    title: '關於山莊',
    description: '了解梅鶴山莊的歷史與文化意義',
    href: '/about',
    image: quickNavImages.about,
  },
  {
    title: '建築特色',
    description: '探索傳統建築的精緻工藝',
    href: '/architecture',
    image: quickNavImages.architecture,
  },
  {
    title: '相簿',
    description: '瀏覽山莊的精選照片',
    href: '/gallery',
    image: quickNavImages.gallery,
  },
  {
    title: '參觀資訊',
    description: '規劃您的參訪行程',
    href: '/visit',
    image: quickNavImages.visit,
  },
];

export default async function HomePage() {
  const site = await getFeaturedSite();

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title={siteConfig.name_zh}
        subtitle="Taiwan Heritage Site"
        description={site?.description_zh || siteConfig.description_zh}
        backgroundImage={cdnUrl(site?.featured_image) || heroImages.home}
        primaryAction={{
          label: '探索更多',
          href: '/about',
        }}
        secondaryAction={{
          label: '參觀資訊',
          href: '/visit',
        }}
      />

      {/* Introduction Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
              歡迎蒞臨梅鶴山莊
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[var(--wood-brown-light)]">
              {site?.description_zh ||
                '梅鶴山莊是台灣珍貴的文化資產，融合傳統建築工藝與歷史記憶。這座古蹟見證了時代的變遷，承載著先人的智慧與美學。我們誠摯邀請您一同探索這座歷史建築的魅力。'}
            </p>
          </div>
        </Container>
      </section>

      {/* Quick Navigation Section */}
      <section className="bg-[var(--terracotta)] py-16 md:py-24">
        <Container>
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
            探索山莊
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="block">
                <Card className="h-full transition-transform hover:-translate-y-1">
                  <CardImage
                    src={item.image}
                    alt={item.title}
                    className="bg-[var(--terracotta-dark)]"
                  />
                  <CardContent>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* History Highlight Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
                歷史沿革
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-[var(--wood-brown-light)]">
                {site?.history_zh
                  ? `${site.history_zh.slice(0, 300)}${site.history_zh.length > 300 ? '...' : ''}`
                  : '梅鶴山莊始建於清代，歷經百年風華，見證台灣歷史的演變。這座建築融合了傳統閩南建築風格與在地特色，從精緻的木雕、石雕到獨特的格局設計，處處展現著匠人的巧思與先人的建築智慧。'}
              </p>
              <Link href="/about" className="mt-8 inline-block">
                <Button variant="outline">閱讀完整歷史</Button>
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--terracotta-dark)]">
              <img
                src={cdnUrl(site?.featured_image) || heroImages.about}
                alt={site?.name_zh || '梅鶴山莊'}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--dark-ochre)] py-16 md:py-24">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--warm-white)] md:text-4xl">
              親臨體驗歷史之美
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--terracotta)]">
              歡迎預約參觀，親自感受傳統建築的魅力與文化底蘊
            </p>
            <Link href="/visit" className="mt-8 inline-block">
              <Button
                size="lg"
                className="bg-[var(--warm-white)] text-[var(--dark-ochre)] hover:bg-[var(--terracotta)]"
              >
                查看參觀資訊
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
