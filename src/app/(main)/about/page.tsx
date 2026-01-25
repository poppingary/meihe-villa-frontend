import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { HeroSection } from '@/components/sections/HeroSection';
import { TimelineSection } from '@/components/sections/TimelineSection';
import { getFeaturedSite } from '@/services/heritage';
import { getMajorTimelineEvents } from '@/services/timeline';
import { siteConfig } from '@/config/site';
import { heroImages } from '@/lib/placeholders';
import { cdnUrl } from '@/lib/cdn';

export const metadata: Metadata = {
  title: '關於山莊',
  description: '了解梅鶴山莊的歷史背景、文化意義與建築特色。',
};

export const revalidate = 86400; // Revalidate every 24 hours

export default async function AboutPage() {
  const [site, timelineEvents] = await Promise.all([
    getFeaturedSite(),
    getMajorTimelineEvents(),
  ]);

  // Transform timeline events to the format expected by TimelineSection
  const timelineItems = timelineEvents.map((event) => ({
    year: event.era_year || event.year.toString(),
    title: event.title_zh,
    description: event.description_zh || event.description || '',
  }));

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="關於山莊"
        subtitle="About Meihe Villa"
        description="探索梅鶴山莊的歷史與文化"
        backgroundImage={cdnUrl(site?.featured_image) || heroImages.about}
        className="min-h-[40vh]"
      />

      {/* Introduction */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
              {siteConfig.name_zh}的故事
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-[var(--wood-brown-light)]">
              {site?.description_zh ? (
                <p>{site.description_zh}</p>
              ) : (
                <>
                  <p>
                    梅鶴山莊是台灣珍貴的文化資產，見證了數百年的歷史變遷。這座古蹟不僅是建築藝術的傑作，更是先人智慧與美學的結晶。
                  </p>
                  <p>
                    山莊的建築融合了傳統閩南風格與在地特色，從精緻的木雕、石雕到獨特的格局設計，處處展現著匠人的巧思與用心。
                  </p>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* History Section */}
      <section className="bg-[var(--terracotta)] py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
              歷史沿革
            </h2>
            {site?.history_zh ? (
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-[var(--wood-brown-light)]">
                {site.history_zh.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="mt-8 text-center text-[var(--wood-brown-light)]">
                歷史資料整理中...
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      {timelineItems.length > 0 && (
        <TimelineSection title="發展歷程" items={timelineItems} />
      )}

      {/* Designation Info */}
      {site?.designation_level && (
        <section className="bg-[var(--dark-ochre)] py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-[var(--warm-white)] md:text-4xl">
                文化資產指定
              </h2>
              <div className="mt-8 rounded-lg bg-[var(--dark-ochre)]/80 p-8">
                <p className="text-lg text-[var(--terracotta)]">指定等級</p>
                <p className="mt-2 text-2xl font-bold text-[var(--warm-white)]">
                  {site.designation_level}
                </p>
                {site.designation_date && (
                  <>
                    <p className="mt-6 text-lg text-[var(--terracotta)]">指定日期</p>
                    <p className="mt-2 text-xl text-[var(--warm-white)]">
                      {new Date(site.designation_date).toLocaleDateString(
                        'zh-TW',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Cultural Significance */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
                文化意義
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-[var(--wood-brown-light)]">
                <p>
                  梅鶴山莊不僅是一座建築，更是台灣歷史文化的縮影。它承載著先人的生活記憶、建築智慧與美學追求。
                </p>
                <p>
                  作為文化資產，山莊的保存與活化工作具有重要意義。透過適當的維護與推廣，讓更多人能夠認識並欣賞這份珍貴的文化遺產。
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg bg-[var(--terracotta)] p-6">
                <h3 className="text-xl font-semibold text-[var(--wood-brown)]">
                  建築價值
                </h3>
                <p className="mt-2 text-[var(--wood-brown-light)]">
                  展現傳統閩南建築工藝與在地特色的融合
                </p>
              </div>
              <div className="rounded-lg bg-[var(--terracotta)] p-6">
                <h3 className="text-xl font-semibold text-[var(--wood-brown)]">
                  歷史價值
                </h3>
                <p className="mt-2 text-[var(--wood-brown-light)]">
                  見證台灣社會發展與時代變遷的重要史蹟
                </p>
              </div>
              <div className="rounded-lg bg-[var(--terracotta)] p-6">
                <h3 className="text-xl font-semibold text-[var(--wood-brown)]">
                  教育價值
                </h3>
                <p className="mt-2 text-[var(--wood-brown-light)]">
                  提供認識傳統文化與建築藝術的學習場域
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
