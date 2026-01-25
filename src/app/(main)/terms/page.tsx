import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: '服務條款',
  description: `${siteConfig.name_zh}網站使用條款與規範。`,
};

export default function TermsPage() {
  return (
    <div className="bg-[var(--warm-white)] py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
            服務條款
          </h1>
          <p className="mt-2 text-lg text-[var(--wood-brown-light)]">
            Terms of Service
          </p>

          <div className="mt-12 space-y-8 text-[var(--wood-brown-light)]">
            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                使用規範
              </h2>
              <p className="mt-4 leading-relaxed">
                歡迎使用{siteConfig.name_zh}網站。使用本網站即表示您同意遵守以下條款與規範。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                智慧財產權
              </h2>
              <p className="mt-4 leading-relaxed">
                本網站所有內容，包括文字、圖片、影音及設計，均受著作權法保護。未經授權，不得擅自複製、修改或散佈。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                內容使用
              </h2>
              <p className="mt-4 leading-relaxed">
                您可基於個人、非商業目的瀏覽本網站內容。如需引用或轉載，請事先取得授權並註明出處。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                免責聲明
              </h2>
              <p className="mt-4 leading-relaxed">
                本網站盡力確保內容正確性，但不保證資訊完全無誤。對於因使用本網站資訊所造成的任何損失，本網站不負賠償責任。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                連結網站
              </h2>
              <p className="mt-4 leading-relaxed">
                本網站可能包含連結至第三方網站。這些網站的內容與隱私政策不在本網站控制範圍內，請自行評估使用風險。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                條款修改
              </h2>
              <p className="mt-4 leading-relaxed">
                本網站保留隨時修改服務條款之權利。修改後將於本頁面公告，繼續使用本網站即表示您接受修改後的條款。
              </p>
            </section>

            <p className="mt-12 text-sm text-[var(--wood-brown-light)]/70">
              最後更新日期：2024年1月
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
