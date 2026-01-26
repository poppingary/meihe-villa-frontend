'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Shield, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column, ConfirmDialog } from '@/components/admin/common';
import { listUsers, deleteUser } from '@/services/admin/users';
import { useAuth } from '@/components/admin/auth/AuthProvider';
import type { User } from '@/types/admin/auth';
import { UserFormDialog } from './UserFormDialog';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listUsers();
      setUsers(data.items);
    } catch (error) {
      toast.error('載入帳號列表失敗');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id);
      toast.success('刪除成功');
      loadUsers();
    } catch (error) {
      toast.error('刪除失敗');
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Check if current user is superadmin
  const isSuperadmin = currentUser?.role === 'superadmin';

  if (!isSuperadmin) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Shield className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">權限不足</h2>
        <p className="mt-2 text-muted-foreground">只有最高管理員可以管理帳號</p>
      </div>
    );
  }

  const columns: Column<User>[] = [
    {
      key: 'email',
      header: '電子郵件',
      cell: (item) => (
        <div className="font-medium">{item.email}</div>
      ),
    },
    {
      key: 'name',
      header: '名稱',
      cell: (item) => item.name || '-',
    },
    {
      key: 'role',
      header: '權限',
      cell: (item) => (
        <Badge variant={item.role === 'superadmin' ? 'default' : 'secondary'}>
          {item.role === 'superadmin' ? (
            <>
              <ShieldCheck className="mr-1 h-3 w-3" /> 最高管理員
            </>
          ) : (
            <>
              <Shield className="mr-1 h-3 w-3" /> 管理員
            </>
          )}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: '狀態',
      cell: (item) => (
        <Badge variant={item.is_active ? 'default' : 'destructive'}>
          {item.is_active ? '啟用' : '停用'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: '建立時間',
      cell: (item) => (
        <span className="text-muted-foreground">{formatDate(item.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      cell: (item) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditTarget(item)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {item.id !== currentUser?.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(item)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
      className: 'w-24',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">帳號管理</h2>
          <p className="text-sm text-muted-foreground">管理 CMS 系統帳號</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          新增帳號
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="尚無帳號資料"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="確認刪除"
        description={`確定要刪除帳號「${deleteTarget?.email}」嗎？此操作無法復原。`}
        onConfirm={handleDelete}
        variant="destructive"
      />

      <UserFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadUsers}
      />

      <UserFormDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        user={editTarget}
        onSuccess={loadUsers}
      />
    </div>
  );
}
