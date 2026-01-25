'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DataTable, Column, ConfirmDialog } from '@/components/admin/common';
import {
  heritageCategoriesService,
  listHeritageCategories,
  type HeritageCategoryCreate,
} from '@/services/admin/heritage';
import type { HeritageCategory } from '@/types/heritage';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<HeritageCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<HeritageCategory | null>(null);
  const [editTarget, setEditTarget] = useState<HeritageCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<HeritageCategoryCreate>({
    name: '',
    name_zh: '',
    description: '',
  });

  const loadCategories = async () => {
    try {
      const data = await listHeritageCategories();
      setCategories(data);
    } catch (error) {
      toast.error('載入分類失敗');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenDialog = (category?: HeritageCategory) => {
    if (category) {
      setEditTarget(category);
      setFormData({
        name: category.name,
        name_zh: category.name_zh,
        description: category.description || '',
      });
    } else {
      setEditTarget(null);
      setFormData({ name: '', name_zh: '', description: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editTarget) {
        await heritageCategoriesService.update(editTarget.id, formData);
        toast.success('更新成功');
      } else {
        await heritageCategoriesService.create(formData);
        toast.success('新增成功');
      }
      setIsDialogOpen(false);
      loadCategories();
    } catch (error) {
      toast.error(editTarget ? '更新失敗' : '新增失敗');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await heritageCategoriesService.delete(deleteTarget.id);
      toast.success('刪除成功');
      loadCategories();
    } catch (error) {
      toast.error('刪除失敗');
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<HeritageCategory>[] = [
    {
      key: 'name_zh',
      header: '中文名稱',
      cell: (cat) => <span className="font-medium">{cat.name_zh}</span>,
    },
    {
      key: 'name',
      header: 'English Name',
      cell: (cat) => cat.name,
    },
    {
      key: 'description',
      header: '描述',
      cell: (cat) => (
        <span className="text-muted-foreground truncate max-w-xs block">
          {cat.description || '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      cell: (category) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDialog(category)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(category)}
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
          <h2 className="text-2xl font-bold tracking-tight">分類管理</h2>
          <p className="text-muted-foreground">管理古蹟景點分類</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              新增分類
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editTarget ? '編輯分類' : '新增分類'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name_zh">中文名稱 *</Label>
                <Input
                  id="name_zh"
                  value={formData.name_zh}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name_zh: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">English Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">{editTarget ? '更新' : '新增'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="尚無分類資料"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="確認刪除"
        description={`確定要刪除「${deleteTarget?.name_zh}」嗎？此操作無法復原。`}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
