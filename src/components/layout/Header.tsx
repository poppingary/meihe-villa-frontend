'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Navigation } from './Navigation';
import { siteConfig } from '@/config/site';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--warm-white)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--warm-white)]/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-[var(--wood-brown)]">
              {siteConfig.name_zh}
            </span>
          </Link>

          {/* Navigation */}
          <Navigation />
        </div>
      </Container>
    </header>
  );
}
