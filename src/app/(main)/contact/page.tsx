import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: '聯絡我們',
  description: `與${siteConfig.name_zh}聯繫，歡迎洽詢參觀或合作事宜。`,
};

export default function ContactPage() {
  return (
    <div className="bg-[var(--warm-white)] py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
            聯絡我們
          </h1>
          <p className="mt-2 text-lg text-[var(--wood-brown-light)]">
            Contact Us
          </p>

          <div className="mt-12 space-y-8">
            <p className="text-lg leading-relaxed text-[var(--wood-brown-light)]">
              歡迎與我們聯繫，無論是參觀預約、合作洽詢或任何問題，我們都很樂意為您服務。
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-[var(--terracotta)] p-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-[var(--wood-brown)]" />
                  <h2 className="text-lg font-semibold text-[var(--wood-brown)]">
                    電子郵件
                  </h2>
                </div>
                <p className="mt-3 text-[var(--wood-brown-light)]">
                  info@meihevilla.com
                </p>
              </div>

              <div className="rounded-lg bg-[var(--terracotta)] p-6">
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-[var(--wood-brown)]" />
                  <h2 className="text-lg font-semibold text-[var(--wood-brown)]">
                    聯絡電話
                  </h2>
                </div>
                <p className="mt-3 text-[var(--wood-brown-light)]">
                  (02) 1234-5678
                </p>
              </div>

              <div className="rounded-lg bg-[var(--terracotta)] p-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-[var(--wood-brown)]" />
                  <h2 className="text-lg font-semibold text-[var(--wood-brown)]">
                    地址
                  </h2>
                </div>
                <p className="mt-3 text-[var(--wood-brown-light)]">
                  台灣台北市
                </p>
              </div>

              <div className="rounded-lg bg-[var(--terracotta)] p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-[var(--wood-brown)]" />
                  <h2 className="text-lg font-semibold text-[var(--wood-brown)]">
                    服務時間
                  </h2>
                </div>
                <p className="mt-3 text-[var(--wood-brown-light)]">
                  週一至週五 09:00 - 17:00
                </p>
              </div>
            </div>

            <div className="mt-12 rounded-lg bg-[var(--dark-ochre)] p-8 text-center">
              <h2 className="text-xl font-semibold text-[var(--warm-white)]">
                團體參觀預約
              </h2>
              <p className="mt-4 text-[var(--terracotta)]">
                如需團體導覽服務，請提前來電或來信預約，我們將安排專人為您服務。
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
