'use client';

import { useState, useEffect } from 'react';
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
import {
  heritageSitesService,
  listHeritageCategories,
} from '@/services/admin/heritage';
import type {
  HeritageSite,
  HeritageSiteCreate,
  HeritageCategory,
} from '@/types/heritage';

interface HeritageFormProps {
  site?: HeritageSite;
  isNew?: boolean;
}

export function HeritageForm({ site, isNew = false }: HeritageFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<HeritageCategory[]>([]);

  // Form state
  const [formData, setFormData] = useState<Partial<HeritageSiteCreate>>({
    name: site?.name || '',
    name_zh: site?.name_zh || '',
    slug: site?.slug || '',
    address: site?.address || '',
    city: site?.city || '',
    latitude: site?.latitude || undefined,
    longitude: site?.longitude || undefined,
    description: site?.description || '',
    description_zh: site?.description_zh || '',
    history: site?.history || '',
    history_zh: site?.history_zh || '',
    featured_image: site?.featured_image || '',
    images: site?.images || '',
    designation_level: site?.designation_level || '',
    category_id: site?.category_id || undefined,
    is_published: site?.is_published || false,
  });

  useEffect(() => {
    listHeritageCategories().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (
    field: keyof HeritageSiteCreate,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-generate slug from English name
  const generateSlug = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      handleChange('slug', slug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isNew) {
        await heritageSitesService.create(formData as HeritageSiteCreate);
        toast.success('新增成功');
      } else if (site) {
        await heritageSitesService.update(site.id, formData);
        toast.success('更新成功');
      }
      router.push('/admin/heritage');
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
              <CardTitle>基本資訊 (中文)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name_zh">名稱 (中文) *</Label>
                <Input
                  id="name_zh"
                  value={formData.name_zh}
                  onChange={(e) => handleChange('name_zh', e.target.value)}
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
              <div className="space-y-2">
                <Label htmlFor="history_zh">歷史 (中文)</Label>
                <Textarea
                  id="history_zh"
                  value={formData.history_zh || ''}
                  onChange={(e) => handleChange('history_zh', e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info (English)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (English) *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={generateSlug}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    required
                  />
                </div>
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
              <div className="space-y-2">
                <Label htmlFor="history">History (English)</Label>
                <Textarea
                  id="history"
                  value={formData.history || ''}
                  onChange={(e) => handleChange('history', e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>位置資訊</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">城市</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">分類</Label>
              <Select
                value={formData.category_id?.toString()}
                onValueChange={(v) => handleChange('category_id', parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name_zh}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">地址</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">緯度</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) =>
                  handleChange('latitude', e.target.value ? parseFloat(e.target.value) : undefined)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">經度</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) =>
                  handleChange('longitude', e.target.value ? parseFloat(e.target.value) : undefined)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>媒體與設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="featured_image">封面圖片 URL</Label>
            <Input
              id="featured_image"
              value={formData.featured_image || ''}
              onChange={(e) => handleChange('featured_image', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation_level">指定級別</Label>
            <Input
              id="designation_level"
              value={formData.designation_level || ''}
              onChange={(e) => handleChange('designation_level', e.target.value)}
              placeholder="如：國定古蹟、市定古蹟"
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
          onClick={() => router.push('/admin/heritage')}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
