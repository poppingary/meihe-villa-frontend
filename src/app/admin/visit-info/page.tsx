'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column, ConfirmDialog } from '@/components/admin/common';
import { visitInfoService, listVisitInfo } from '@/services/admin/visitInfo';
import type { VisitInfo } from '@/types/heritage';

export default function VisitInfoPage() {
  const [items, setItems] = useState<VisitInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<VisitInfo | null>(null);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await listVisitInfo();
      setItems(data);
    } catch (error) {
      toast.error('載入參觀資訊失敗');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await visitInfoService.delete(deleteTarget.id);
      toast.success('刪除成功');
      loadItems();
    } catch (error) {
      toast.error('刪除失敗');
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<VisitInfo>[] = [
    {
      key: 'display_order',
      header: '順序',
      cell: (item) => (
        <span className="text-muted-foreground font-mono">{item.display_order}</span>
      ),
    },
    {
      key: 'section',
      header: '區塊代碼',
      cell: (item) => (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{item.section}</code>
      ),
    },
    {
      key: 'title_zh',
      header: '標題 (中文)',
      cell: (item) => <span className="font-medium">{item.title_zh}</span>,
    },
    {
      key: 'status',
      header: '狀態',
      cell: (item) => (
        <Badge variant={item.is_active ? 'default' : 'secondary'}>
          {item.is_active ? (
            <>
              <Check className="mr-1 h-3 w-3" /> 啟用
            </>
          ) : (
            <>
              <X className="mr-1 h-3 w-3" /> 停用
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
            <Link href={`/admin/visit-info/${item.id}`}>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">參觀資訊管理</h2>
          <p className="text-muted-foreground">管理開放時間、票價、交通等資訊</p>
        </div>
        <Button asChild>
          <Link href="/admin/visit-info/new">
            <Plus className="mr-2 h-4 w-4" />
            新增區塊
          </Link>
        </Button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="尚無參觀資訊"
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
