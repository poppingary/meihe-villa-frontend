'use client';

import { LogOut, Menu, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/admin/auth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.email?.split('@')[0] || '使用者';
  const isSuperadmin = user?.role === 'superadmin';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger button - mobile only */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          aria-label="開啟選單"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold md:text-lg">後台管理系統</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              {isSuperadmin ? (
                <ShieldCheck className="h-4 w-4 text-primary" />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="max-w-[100px] truncate sm:max-w-none">{displayName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || '未設定名稱'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {isSuperadmin && (
                  <Badge variant="default" className="mt-1 w-fit">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    最高管理員
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
