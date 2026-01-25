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
import { newsService, listNews } from '@/services/admin/news';
import type { NewsItem } from '@/types/heritage';

const CATEGORIES = [
  { value: 'all', label: '全部分類' },
  { value: 'announcement', label: '公告' },
  { value: 'event', label: '活動' },
  { value: 'update', label: '更新' },
  { value: 'exhibition', label: '展覽' },
  { value: 'other', label: '其他' },
];

const CATEGORY_MAP: Record<string, string> = {
  announcement: '公告',
  event: '活動',
  update: '更新',
  exhibition: '展覽',
  other: '其他',
};

export default function NewsListPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const data = await listNews({
        category: categoryFilter || undefined,
      });
      setNews(data);
    } catch (error) {
      toast.error('載入新聞失敗');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [categoryFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await newsService.delete(deleteTarget.id);
      toast.success('刪除成功');
      loadNews();
    } catch (error) {
      toast.error('刪除失敗');
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const columns: Column<NewsItem>[] = [
    {
      key: 'title',
      header: '標題',
      cell: (item) => (
        <div>
          <div className="font-medium">{item.title_zh}</div>
          <div className="text-sm text-muted-foreground">{item.title}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: '分類',
      cell: (item) => (
        <Badge variant="secondary">
          {CATEGORY_MAP[item.category || ''] || item.category || '-'}
        </Badge>
      ),
    },
    {
      key: 'published_at',
      header: '發布時間',
      cell: (item) => (
        <span className="text-muted-foreground">{formatDate(item.published_at)}</span>
      ),
    },
    {
      key: 'status',
      header: '狀態',
      cell: (item) => (
        <Badge variant={item.is_published ? 'default' : 'secondary'}>
          {item.is_published ? (
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
      cell: (item) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/news/${item.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(item)}
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">最新消息</h2>
          <p className="text-sm text-muted-foreground">管理網站新聞與公告</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/news/new">
            <Plus className="mr-2 h-4 w-4" />
            新增消息
          </Link>
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={categoryFilter || 'all'} onValueChange={(v) => setCategoryFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
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
        data={news}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="尚無新聞資料"
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
