import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { mainNavItems, footerNavItems } from '@/config/navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--terracotta)]">
      <Container>
        <div className="py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Brand */}
            <div>
              <Link href="/" className="font-serif text-xl font-bold text-[var(--wood-brown)]">
                {siteConfig.name_zh}
              </Link>
              <p className="mt-4 text-sm text-[var(--wood-brown-light)]">
                {siteConfig.description_zh}
              </p>
            </div>

            {/* Main Navigation */}
            <div>
              <h3 className="font-semibold text-[var(--wood-brown)]">網站導覽</h3>
              <ul className="mt-4 space-y-2">
                {mainNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--wood-brown-light)] transition-colors hover:text-[var(--brick-red)]"
                    >
                      {item.label_zh}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-[var(--wood-brown)]">相關連結</h3>
              <ul className="mt-4 space-y-2">
                {footerNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--wood-brown-light)] transition-colors hover:text-[var(--brick-red)]"
                    >
                      {item.label_zh}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-[var(--border)] pt-8">
            <p className="text-center text-sm text-[var(--wood-brown-light)]">
              © {currentYear} {siteConfig.name_zh}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
