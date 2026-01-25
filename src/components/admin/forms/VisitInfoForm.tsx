'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { visitInfoService } from '@/services/admin/visitInfo';
import type { VisitInfo, VisitInfoCreate } from '@/types/heritage';

interface VisitInfoFormProps {
  info?: VisitInfo;
  isNew?: boolean;
}

export function VisitInfoForm({ info, isNew = false }: VisitInfoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<VisitInfoCreate>>({
    section: info?.section || '',
    title: info?.title || '',
    title_zh: info?.title_zh || '',
    content: info?.content || '',
    content_zh: info?.content_zh || '',
    extra_data: info?.extra_data || '',
    display_order: info?.display_order || 0,
    is_active: info?.is_active ?? true,
  });

  const handleChange = (
    field: keyof VisitInfoCreate,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isNew) {
        await visitInfoService.create(formData as VisitInfoCreate);
        toast.success('新增成功');
      } else if (info) {
        await visitInfoService.update(info.id, formData);
        toast.success('更新成功');
      }
      router.push('/admin/visit-info');
    } catch (error) {
      toast.error(isNew ? '新增失敗' : '更新失敗', {
        description: error instanceof Error ? error.message : '操作失敗',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="section">區塊代碼 *</Label>
              <Input
                id="section"
                value={formData.section || ''}
                onChange={(e) => handleChange('section', e.target.value)}
                placeholder="如：hours, tickets, transport, rules"
                required
              />
              <p className="text-xs text-muted-foreground">
                唯一識別碼，用於系統識別
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">顯示順序</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order || 0}
                onChange={(e) =>
                  handleChange('display_order', parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleChange('is_active', checked)}
            />
            <Label htmlFor="is_active">啟用</Label>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="zh" className="w-full">
        <TabsList>
          <TabsTrigger value="zh">中文</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>

        <TabsContent value="zh" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>內容 (中文)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_zh">標題 (中文) *</Label>
                <Input
                  id="title_zh"
                  value={formData.title_zh || ''}
                  onChange={(e) => handleChange('title_zh', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content_zh">內容 (中文)</Label>
                <Textarea
                  id="content_zh"
                  value={formData.content_zh || ''}
                  onChange={(e) => handleChange('content_zh', e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content (English)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (English) *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content (English)</Label>
                <Textarea
                  id="content"
                  value={formData.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>額外資料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="extra_data">JSON 資料</Label>
            <Textarea
              id="extra_data"
              value={formData.extra_data || ''}
              onChange={(e) => handleChange('extra_data', e.target.value)}
              rows={6}
              placeholder='{"hours": {"weekday": "09:00-17:00", "weekend": "09:00-18:00"}}'
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              可選的 JSON 格式資料，用於儲存開放時間、票價等結構化資訊
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '儲存中...' : isNew ? '新增' : '更新'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/visit-info')}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
