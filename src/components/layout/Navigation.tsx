'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mainNavItems } from '@/config/navigation';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <ul className="hidden items-center gap-1 md:flex">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--terracotta)] text-[var(--brick-red)]'
                    : 'text-[var(--wood-brown-light)] hover:bg-[var(--terracotta)] hover:text-[var(--brick-red)]'
                )}
              >
                {item.label_zh}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-[var(--wood-brown-light)] hover:bg-[var(--terracotta)] hover:text-[var(--brick-red)] md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-expanded={mobileMenuOpen}
        aria-label="Toggle menu"
      >
        <span className="sr-only">開啟選單</span>
        {mobileMenuOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-md bg-[var(--warm-white)] py-1 shadow-lg ring-1 ring-[var(--border)] md:hidden">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-4 py-2 text-sm',
                  isActive
                    ? 'bg-[var(--terracotta)] text-[var(--brick-red)]'
                    : 'text-[var(--wood-brown-light)] hover:bg-[var(--terracotta)] hover:text-[var(--brick-red)]'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label_zh}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
