'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  FolderTree,
  Newspaper,
  Clock,
  Info,
  Image,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/heritage', label: '古蹟景點', icon: Building2 },
  { href: '/admin/categories', label: '景點分類', icon: FolderTree },
  { href: '/admin/news', label: '最新消息', icon: Newspaper },
  { href: '/admin/timeline', label: '歷史大事記', icon: Clock },
  { href: '/admin/visit-info', label: '參觀資訊', icon: Info },
  { href: '/admin/media', label: '媒體庫', icon: Image },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    // Close drawer on mobile when nav item clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 border-r bg-background transition-transform duration-300 ease-in-out',
          // Mobile: hidden by default, slide in when open
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Tablet+: always visible
          'md:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link href="/admin" className="text-xl font-bold" onClick={handleNavClick}>
            梅鶴山莊 CMS
          </Link>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            aria-label="關閉選單"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
