'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { HeritageForm } from '@/components/admin/forms';
import { heritageSitesService } from '@/services/admin/heritage';
import type { HeritageSite } from '@/types/heritage';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditHeritagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [site, setSite] = useState<HeritageSite | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSite = async () => {
      try {
        const data = await heritageSitesService.get(id);
        setSite(data);
      } catch (error) {
        console.error('Failed to load site:', error);
        router.push('/admin/heritage');
      } finally {
        setIsLoading(false);
      }
    };
    loadSite();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!site) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">編輯古蹟景點</h2>
        <p className="text-muted-foreground">{site.name_zh}</p>
      </div>
      <HeritageForm site={site} />
    </div>
  );
}
