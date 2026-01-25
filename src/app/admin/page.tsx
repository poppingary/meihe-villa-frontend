'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/admin/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Newspaper, Clock, Info, FolderTree } from 'lucide-react';
import { getDashboardStats, type DashboardStats } from '@/services/admin/dashboard';

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">載入中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          歡迎回來，{user?.name || user?.email}
        </h2>
        <p className="text-sm text-muted-foreground">
          這是梅鶴山莊後台管理系統
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        <Link href="/admin/heritage">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">古蹟景點</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.total_sites || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.published_sites || 0} 已發布 / {stats?.draft_sites || 0} 草稿
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">景點分類</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.total_categories || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    分類數量
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/news">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">最新消息</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.total_news || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.published_news || 0} 已發布
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/timeline">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">歷史大事記</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.total_timeline_events || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.published_timeline_events || 0} 已發布
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/visit-info">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">參觀資訊</CardTitle>
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.total_visit_info || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.active_visit_info || 0} 啟用中
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/heritage/new"
              className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium">新增古蹟景點</div>
              <div className="text-sm text-muted-foreground">建立新的古蹟景點資料</div>
            </Link>
            <Link
              href="/admin/timeline/new"
              className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium">新增歷史事件</div>
              <div className="text-sm text-muted-foreground">記錄重要歷史事件</div>
            </Link>
            <Link
              href="/admin/visit-info/new"
              className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium">新增參觀資訊</div>
              <div className="text-sm text-muted-foreground">更新開放時間、票價等資訊</div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>系統資訊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">系統版本</span>
              <span className="font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">登入帳號</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">前端網站</span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                查看網站
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
