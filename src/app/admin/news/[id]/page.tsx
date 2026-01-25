'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { NewsForm } from '@/components/admin/forms';
import { newsService } from '@/services/admin/news';
import type { NewsItem } from '@/types/heritage';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await newsService.get(id);
        setNews(data);
      } catch (error) {
        console.error('Failed to load news:', error);
        router.push('/admin/news');
      } finally {
        setIsLoading(false);
      }
    };
    loadNews();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!news) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">編輯消息</h2>
        <p className="text-muted-foreground">{news.title_zh}</p>
      </div>
      <NewsForm news={news} />
    </div>
  );
}
