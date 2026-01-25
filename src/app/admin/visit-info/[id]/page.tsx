'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { VisitInfoForm } from '@/components/admin/forms';
import { visitInfoService } from '@/services/admin/visitInfo';
import type { VisitInfo } from '@/types/heritage';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditVisitInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [info, setInfo] = useState<VisitInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const data = await visitInfoService.get(id);
        setInfo(data);
      } catch (error) {
        console.error('Failed to load info:', error);
        router.push('/admin/visit-info');
      } finally {
        setIsLoading(false);
      }
    };
    loadInfo();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!info) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">編輯參觀資訊</h2>
        <p className="text-muted-foreground">{info.title_zh}</p>
      </div>
      <VisitInfoForm info={info} />
    </div>
  );
}
