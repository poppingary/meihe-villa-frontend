'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable, Column, ConfirmDialog } from '@/components/admin/common';
import { timelineService, listTimelineEvents } from '@/services/admin/timeline';
import type { TimelineEvent } from '@/types/heritage';

const CATEGORIES = [
  { value: 'all', label: '全部分類' },
  { value: 'construction', label: '建設' },
  { value: 'restoration', label: '修復' },
  { value: 'cultural', label: '文化' },
  { value: 'political', label: '政治' },
  { value: 'other', label: '其他' },
];

const CATEGORY_MAP: Record<string, string> = {
  construction: '建設',
  restoration: '修復',
  cultural: '文化',
  political: '政治',
  other: '其他',
};

const IMPORTANCE_MAP: Record<string, string> = {
  major: '重要',
  normal: '一般',
  minor: '次要',
};

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<TimelineEvent | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await listTimelineEvents({
        category: categoryFilter || undefined,
      });
      setEvents(data);
    } catch (error) {
      toast.error('載入時間軸失敗');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [categoryFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await timelineService.delete(deleteTarget.id);
      toast.success('刪除成功');
      loadEvents();
    } catch (error) {
      toast.error('刪除失敗');
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const formatDate = (event: TimelineEvent) => {
    let date = `${event.year}`;
    if (event.month) date += `/${event.month}`;
    if (event.day) date += `/${event.day}`;
    if (event.era_year) date += ` (${event.era_year})`;
    return date;
  };

  const columns: Column<TimelineEvent>[] = [
    {
      key: 'year',
      header: '日期',
      cell: (event) => <span className="font-mono">{formatDate(event)}</span>,
    },
    {
      key: 'title_zh',
      header: '標題 (中文)',
      cell: (event) => <span className="font-medium">{event.title_zh}</span>,
    },
    {
      key: 'category',
      header: '分類',
      cell: (event) => CATEGORY_MAP[event.category || ''] || event.category || '-',
    },
    {
      key: 'importance',
      header: '重要性',
      cell: (event) => {
        const importance = event.importance || 'normal';
        return (
          <Badge variant={importance === 'major' ? 'default' : 'secondary'}>
            {IMPORTANCE_MAP[importance] || importance}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      header: '狀態',
      cell: (event) => (
        <Badge variant={event.is_published ? 'default' : 'secondary'}>
          {event.is_published ? (
            <>
              <Eye className="mr-1 h-3 w-3" /> 已發布
            </>
          ) : (
            <>
              <EyeOff className="mr-1 h-3 w-3" /> 草稿
            </>
          )}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      cell: (event) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/timeline/${event.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(event)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">時間軸管理</h2>
          <p className="text-muted-foreground">管理歷史事件時間軸</p>
        </div>
        <Button asChild>
          <Link href="/admin/timeline/new">
            <Plus className="mr-2 h-4 w-4" />
            新增事件
          </Link>
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={categoryFilter || 'all'} onValueChange={(v) => setCategoryFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="篩選分類" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={events}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="尚無時間軸事件"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="確認刪除"
        description={`確定要刪除「${deleteTarget?.title_zh}」嗎？此操作無法復原。`}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
