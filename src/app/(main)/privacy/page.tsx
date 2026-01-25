import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: '隱私政策',
  description: `${siteConfig.name_zh}的隱私權政策與個人資料保護聲明。`,
};

export default function PrivacyPage() {
  return (
    <div className="bg-[var(--warm-white)] py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-[var(--wood-brown)] md:text-4xl">
            隱私政策
          </h1>
          <p className="mt-2 text-lg text-[var(--wood-brown-light)]">
            Privacy Policy
          </p>

          <div className="mt-12 space-y-8 text-[var(--wood-brown-light)]">
            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                資料收集
              </h2>
              <p className="mt-4 leading-relaxed">
                本網站可能會收集您的基本瀏覽資訊，包括但不限於瀏覽器類型、造訪時間及頁面瀏覽紀錄，以改善網站服務品質。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                資料使用
              </h2>
              <p className="mt-4 leading-relaxed">
                收集之資料僅供網站營運分析使用，不會將您的個人資料提供給第三方，除非經您同意或法律要求。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                Cookie 使用
              </h2>
              <p className="mt-4 leading-relaxed">
                本網站使用 Cookie 技術以提供更好的使用體驗。您可以透過瀏覽器設定選擇是否接受 Cookie。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                安全保護
              </h2>
              <p className="mt-4 leading-relaxed">
                我們採取適當的安全措施保護您的資料，防止未經授權的存取、使用或揭露。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
                政策更新
              </h2>
              <p className="mt-4 leading-relaxed">
                本隱私政策可能會不定期更新，更新後將於本頁面公告。繼續使用本網站即表示您同意更新後的政策。
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
