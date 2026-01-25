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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { timelineService } from '@/services/admin/timeline';
import type { TimelineEvent, TimelineEventCreate } from '@/types/heritage';

interface TimelineFormProps {
  event?: TimelineEvent;
  isNew?: boolean;
}

const CATEGORIES = [
  { value: 'construction', label: '建設' },
  { value: 'restoration', label: '修復' },
  { value: 'cultural', label: '文化' },
  { value: 'political', label: '政治' },
  { value: 'other', label: '其他' },
];

const IMPORTANCE_LEVELS = [
  { value: 'major', label: '重要' },
  { value: 'normal', label: '一般' },
  { value: 'minor', label: '次要' },
];

export function TimelineForm({ event, isNew = false }: TimelineFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<TimelineEventCreate>>({
    year: event?.year || new Date().getFullYear(),
    month: event?.month || undefined,
    day: event?.day || undefined,
    era: event?.era || '',
    era_year: event?.era_year || '',
    title: event?.title || '',
    title_zh: event?.title_zh || '',
    description: event?.description || '',
    description_zh: event?.description_zh || '',
    image: event?.image || '',
    category: event?.category || '',
    importance: event?.importance || 'normal',
    is_published: event?.is_published || false,
  });

  const handleChange = (
    field: keyof TimelineEventCreate,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isNew) {
        await timelineService.create(formData as TimelineEventCreate);
        toast.success('新增成功');
      } else if (event) {
        await timelineService.update(event.id, formData);
        toast.success('更新成功');
      }
      router.push('/admin/timeline');
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
                <Label htmlFor="description_zh">描述 (中文)</Label>
                <Textarea
                  id="description_zh"
                  value={formData.description_zh || ''}
                  onChange={(e) => handleChange('description_zh', e.target.value)}
                  rows={4}
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
                <Label htmlFor="description">Description (English)</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>日期資訊</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="year">西元年 *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year || ''}
                onChange={(e) =>
                  handleChange('year', e.target.value ? parseInt(e.target.value) : undefined)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">月</Label>
              <Input
                id="month"
                type="number"
                min="1"
                max="12"
                value={formData.month || ''}
                onChange={(e) =>
                  handleChange('month', e.target.value ? parseInt(e.target.value) : undefined)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="day">日</Label>
              <Input
                id="day"
                type="number"
                min="1"
                max="31"
                value={formData.day || ''}
                onChange={(e) =>
                  handleChange('day', e.target.value ? parseInt(e.target.value) : undefined)
                }
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="era">年號</Label>
              <Input
                id="era"
                value={formData.era || ''}
                onChange={(e) => handleChange('era', e.target.value)}
                placeholder="如：清同治、日治、民國"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="era_year">年號紀年</Label>
              <Input
                id="era_year"
                value={formData.era_year || ''}
                onChange={(e) => handleChange('era_year', e.target.value)}
                placeholder="如：同治8年、大正12年"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>分類與設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">分類</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(v) => handleChange('category', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇分類" />
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
            <div className="space-y-2">
              <Label htmlFor="importance">重要性</Label>
              <Select
                value={formData.importance || 'normal'}
                onValueChange={(v) => handleChange('importance', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇重要性" />
                </SelectTrigger>
                <SelectContent>
                  {IMPORTANCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">圖片 URL</Label>
            <Input
              id="image"
              value={formData.image || ''}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => handleChange('is_published', checked)}
            />
            <Label htmlFor="is_published">發布</Label>
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
          onClick={() => router.push('/admin/timeline')}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
