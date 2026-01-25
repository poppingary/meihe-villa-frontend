'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { TimelineForm } from '@/components/admin/forms';
import { timelineService } from '@/services/admin/timeline';
import type { TimelineEvent } from '@/types/heritage';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditTimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<TimelineEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await timelineService.get(id);
        setEvent(data);
      } catch (error) {
        console.error('Failed to load event:', error);
        router.push('/admin/timeline');
      } finally {
        setIsLoading(false);
      }
    };
    loadEvent();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">編輯時間軸事件</h2>
        <p className="text-muted-foreground">{event.title_zh}</p>
      </div>
      <TimelineForm event={event} />
    </div>
  );
}
