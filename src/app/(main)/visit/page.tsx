import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { HeroSection } from '@/components/sections/HeroSection';
import { MapSection } from '@/components/sections/MapSection';
import { getFeaturedSite } from '@/services/heritage';
import { getVisitInfo, parseExtraData } from '@/services/visit-info';
import { heroImages } from '@/lib/placeholders';
import { cdnUrl } from '@/lib/cdn';

export const metadata: Metadata = {
  title: '參觀資訊',
  description: '梅鶴山莊參觀資訊、交通指南與開放時間。',
};

export const revalidate = 86400; // Revalidate every 24 hours

interface ContactExtraData {
  phone?: string;
  museum_phone?: string;
  address?: string;
  email?: string;
}

interface RulesExtraData {
  rules?: string[];
  rules_zh?: string[];
}

export default async function VisitPage() {
  const [site, visitInfoItems] = await Promise.all([
    getFeaturedSite(),
    getVisitInfo(),
  ]);

  // Get visit info by section
  const hoursInfo = visitInfoItems.find((item) => item.section === 'hours');
  const ticketsInfo = visitInfoItems.find((item) => item.section === 'tickets');
  const transportInfo = visitInfoItems.find(
    (item) => item.section === 'transport'
  );
  const contactInfo = visitInfoItems.find((item) => item.section === 'contact');
  const rulesInfo = visitInfoItems.find((item) => item.section === 'rules');

  // Parse extra data
  const contactData = parseExtraData<ContactExtraData>(
    contactInfo?.extra_data || null
  );
  const rulesData = parseExtraData<RulesExtraData>(rulesInfo?.extra_data || null);

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="參觀資訊"
        subtitle="Visit Information"
        description="規劃您的山莊之旅"
        backgroundImage={cdnUrl(site?.featured_image) || heroImages.visit}
        className="min-h-[40vh]"
      />

      {/* Opening Hours */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
              {hoursInfo?.title_zh || '開放時間'}
            </h2>
            <div className="mt-8 overflow-hidden rounded-lg bg-white p-8 shadow-lg">
              {hoursInfo?.content_zh ? (
                <div className="space-y-4 text-lg text-[var(--wood-brown-light)]">
                  {hoursInfo.content_zh.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[var(--wood-brown-light)]">資料載入中...</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Ticket Information */}
      <section className="bg-[var(--terracotta)] py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
              {ticketsInfo?.title_zh || '票價資訊'}
            </h2>
            <div className="mt-8 overflow-hidden rounded-lg bg-white p-8 shadow-lg">
              {ticketsInfo?.content_zh ? (
                <div className="space-y-4 text-lg text-[var(--wood-brown-light)]">
                  {ticketsInfo.content_zh.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[var(--wood-brown-light)]">資料載入中...</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Address and Map */}
      <section className="py-16 md:py-24">
        <Container>
          <h2 className="mb-8 text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
            地址與地圖
          </h2>
        </Container>
        <MapSection
          address={contactData?.address || site?.address || '台灣'}
          latitude={site?.latitude || undefined}
          longitude={site?.longitude || undefined}
        />
      </section>

      {/* Transportation */}
      <section className="bg-[var(--dark-ochre)] py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-[var(--warm-white)] md:text-4xl">
              {transportInfo?.title_zh || '交通指南'}
            </h2>
            <div className="mt-8 rounded-lg bg-[var(--dark-ochre)]/80 p-8">
              {transportInfo?.content_zh ? (
                <div className="space-y-6 text-lg text-[var(--terracotta)]">
                  {transportInfo.content_zh.split('\n\n').map((section, index) => (
                    <div key={index}>
                      {section.split('\n').map((line, lineIndex) => (
                        <p
                          key={lineIndex}
                          className={lineIndex === 0 ? 'font-semibold text-[var(--warm-white)]' : ''}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[var(--brick-red)]">資料載入中...</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
              {contactInfo?.title_zh || '聯絡我們'}
            </h2>
            <div className="mt-8 space-y-4 text-lg text-[var(--wood-brown-light)]">
              {contactData?.phone && (
                <p>
                  <span className="font-medium text-[var(--wood-brown)]">電話：</span>
                  {contactData.phone}
                </p>
              )}
              {contactData?.museum_phone && (
                <p>
                  <span className="font-medium text-[var(--wood-brown)]">
                    大溪木藝生態博物館：
                  </span>
                  {contactData.museum_phone}
                </p>
              )}
              {contactData?.address && (
                <p>
                  <span className="font-medium text-[var(--wood-brown)]">地址：</span>
                  {contactData.address}
                </p>
              )}
              {contactInfo?.content_zh && (
                <p className="mt-4 text-[var(--wood-brown-light)]">{contactInfo.content_zh}</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Notice */}
      <section className="bg-[var(--terracotta)] py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
              {rulesInfo?.title_zh || '參觀須知'}
            </h2>
            {rulesData?.rules_zh && rulesData.rules_zh.length > 0 ? (
              <ul className="mt-8 space-y-4 text-[var(--wood-brown-light)]">
                {rulesData.rules_zh.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-[var(--brick-red)]">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            ) : rulesInfo?.content_zh ? (
              <div className="mt-8 space-y-4 text-[var(--wood-brown-light)]">
                {rulesInfo.content_zh.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            ) : (
              <p className="mt-8 text-center text-[var(--wood-brown-light)]">資料載入中...</p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
