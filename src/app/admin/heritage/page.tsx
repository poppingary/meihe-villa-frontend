'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column, ConfirmDialog } from '@/components/admin/common';
import { listHeritageSites, heritageSitesService } from '@/services/admin/heritage';
import type { HeritageSite } from '@/types/heritage';

export default function HeritageListPage() {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadSites = async () => {
    setIsLoading(true);
    try {
      const data = await listHeritageSites();
      setSites(data);
    } catch (error) {
      toast.error('載入失敗', {
        description: error instanceof Error ? error.message : '無法載入資料',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await heritageSitesService.delete(deleteId);
      toast.success('刪除成功');
      loadSites();
    } catch (error) {
      toast.error('刪除失敗', {
        description: error instanceof Error ? error.message : '操作失敗',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const columns: Column<HeritageSite>[] = [
    {
      key: 'name',
      header: '名稱',
      cell: (site) => (
        <div>
          <div className="font-medium">{site.name_zh}</div>
          <div className="text-sm text-muted-foreground">{site.name}</div>
        </div>
      ),
    },
    {
      key: 'city',
      header: '城市',
      cell: (site) => site.city || '-',
    },
    {
      key: 'category',
      header: '分類',
      cell: (site) => site.category?.name_zh || '-',
    },
    {
      key: 'status',
      header: '狀態',
      cell: (site) => (
        <Badge variant={site.is_published ? 'default' : 'secondary'}>
          {site.is_published ? (
            <>
              <Eye className="mr-1 h-3 w-3" />
              已發布
            </>
          ) : (
            <>
              <EyeOff className="mr-1 h-3 w-3" />
              草稿
            </>
          )}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      cell: (site) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/heritage/${site.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(site.id)}
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
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">古蹟景點</h2>
          <p className="text-sm text-muted-foreground">管理所有古蹟景點資料</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/heritage/new">
            <Plus className="mr-2 h-4 w-4" />
            新增景點
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={sites}
        isLoading={isLoading}
        emptyMessage="尚無古蹟景點資料"
      />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="確認刪除"
        description="確定要刪除此古蹟景點嗎？此操作無法復原。"
        confirmText="刪除"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
