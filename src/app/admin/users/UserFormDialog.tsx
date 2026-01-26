'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUser, updateUser } from '@/services/admin/users';
import { useAuth } from '@/components/admin/auth/AuthProvider';
import type { User, UserRole } from '@/types/admin/auth';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSuccess: () => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const { user: currentUser } = useAuth();
  const isEdit = !!user;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'admin' as UserRole,
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '',
        name: user.name || '',
        role: user.role,
        is_active: user.is_active,
      });
    } else {
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'admin',
        is_active: true,
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEdit && user) {
        const updateData: Record<string, unknown> = {};
        if (formData.email !== user.email) updateData.email = formData.email;
        if (formData.password) updateData.password = formData.password;
        if (formData.name !== user.name) updateData.name = formData.name;
        if (formData.role !== user.role) updateData.role = formData.role;
        if (formData.is_active !== user.is_active) updateData.is_active = formData.is_active;

        await updateUser(user.id, updateData);
        toast.success('更新成功');
      } else {
        await createUser({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
          role: formData.role,
        });
        toast.success('新增成功');
      }
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '操作失敗';
      toast.error(isEdit ? '更新失敗' : '新增失敗', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentUser = user?.id === currentUser?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? '編輯帳號' : '新增帳號'}</DialogTitle>
            <DialogDescription>
              {isEdit ? '修改帳號資訊' : '建立新的 CMS 管理帳號'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件 *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                密碼 {isEdit ? '(留空保持不變)' : '*'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!isEdit}
                minLength={6}
                placeholder={isEdit ? '••••••••' : '至少 6 個字元'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">名稱</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="顯示名稱"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">權限</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}
                disabled={isCurrentUser}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">管理員</SelectItem>
                  <SelectItem value="superadmin">最高管理員</SelectItem>
                </SelectContent>
              </Select>
              {isCurrentUser && (
                <p className="text-xs text-muted-foreground">無法變更自己的權限</p>
              )}
            </div>

            {isEdit && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">帳號狀態</Label>
                  <p className="text-xs text-muted-foreground">
                    停用後無法登入系統
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                  disabled={isCurrentUser}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '處理中...' : isEdit ? '更新' : '新增'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
