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
import { newsService } from '@/services/admin/news';
import type { NewsItem, NewsItemCreate } from '@/types/heritage';

interface NewsFormProps {
  news?: NewsItem;
  isNew?: boolean;
}

const NEWS_CATEGORIES = [
  { value: 'announcement', label: '公告' },
  { value: 'event', label: '活動' },
  { value: 'update', label: '更新' },
  { value: 'exhibition', label: '展覽' },
  { value: 'other', label: '其他' },
];

export function NewsForm({ news, isNew = false }: NewsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<NewsItemCreate>>({
    title: news?.title || '',
    title_zh: news?.title_zh || '',
    slug: news?.slug || '',
    summary: news?.summary || '',
    summary_zh: news?.summary_zh || '',
    content: news?.content || '',
    content_zh: news?.content_zh || '',
    featured_image: news?.featured_image || '',
    category: news?.category || '',
    is_published: news?.is_published || false,
    published_at: news?.published_at || null,
  });

  const handleChange = (
    field: keyof NewsItemCreate,
    value: string | boolean | null | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-generate slug from English title
  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      handleChange('slug', slug);
    }
  };

  // Auto-set published_at when publishing
  const handlePublishChange = (checked: boolean) => {
    handleChange('is_published', checked);
    if (checked && !formData.published_at) {
      handleChange('published_at', new Date().toISOString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isNew) {
        await newsService.create(formData as NewsItemCreate);
        toast.success('新增成功');
      } else if (news) {
        await newsService.update(news.id, formData);
        toast.success('更新成功');
      }
      router.push('/admin/news');
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
                <Label htmlFor="summary_zh">摘要 (中文)</Label>
                <Textarea
                  id="summary_zh"
                  value={formData.summary_zh || ''}
                  onChange={(e) => handleChange('summary_zh', e.target.value)}
                  rows={3}
                  placeholder="簡短描述這則新聞..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content_zh">內容 (中文)</Label>
                <Textarea
                  id="content_zh"
                  value={formData.content_zh || ''}
                  onChange={(e) => handleChange('content_zh', e.target.value)}
                  rows={10}
                  placeholder="完整新聞內容..."
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title (English) *</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    onBlur={generateSlug}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug || ''}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary (English)</Label>
                <Textarea
                  id="summary"
                  value={formData.summary || ''}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  rows={3}
                  placeholder="Brief description..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content (English)</Label>
                <Textarea
                  id="content"
                  value={formData.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={10}
                  placeholder="Full news content..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>設定</CardTitle>
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
                  {NEWS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="published_at">發布時間</Label>
              <Input
                id="published_at"
                type="datetime-local"
                value={
                  formData.published_at
                    ? new Date(formData.published_at).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  handleChange(
                    'published_at',
                    e.target.value ? new Date(e.target.value).toISOString() : null
                  )
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="featured_image">封面圖片 URL</Label>
            <Input
              id="featured_image"
              value={formData.featured_image || ''}
              onChange={(e) => handleChange('featured_image', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={handlePublishChange}
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
          onClick={() => router.push('/admin/news')}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
