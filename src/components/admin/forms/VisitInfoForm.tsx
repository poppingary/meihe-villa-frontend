'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { visitInfoService } from '@/services/admin/visitInfo';
import type { VisitInfo, VisitInfoCreate } from '@/types/heritage';

interface KeyValuePair {
  key: string;
  value: string;
}

// Parse JSON string to separate Chinese and English key-value pairs
function parseExtraData(extraData: string | null | undefined): {
  zh: KeyValuePair[];
  en: KeyValuePair[];
} {
  if (!extraData) return { zh: [], en: [] };
  try {
    const parsed = JSON.parse(extraData);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { zh: [], en: [] };
    }

    const zhPairs: KeyValuePair[] = [];
    const enPairs: KeyValuePair[] = [];

    Object.entries(parsed).forEach(([key, value]) => {
      const strValue = typeof value === 'string' ? value : JSON.stringify(value);
      if (key.endsWith('_en')) {
        // English key-value pair
        enPairs.push({ key: key.slice(0, -3), value: strValue });
      } else {
        // Chinese key-value pair
        zhPairs.push({ key, value: strValue });
      }
    });

    return { zh: zhPairs, en: enPairs };
  } catch {
    return { zh: [], en: [] };
  }
}

// Convert separate Chinese and English key-value pairs to JSON string
function keyValuePairsToJson(zhPairs: KeyValuePair[], enPairs: KeyValuePair[]): string {
  const validZhPairs = zhPairs.filter((p) => p.key.trim() !== '');
  const validEnPairs = enPairs.filter((p) => p.key.trim() !== '');

  if (validZhPairs.length === 0 && validEnPairs.length === 0) return '';

  const obj: Record<string, string> = {};

  // Add Chinese pairs (base key)
  validZhPairs.forEach((pair) => {
    obj[pair.key.trim()] = pair.value;
  });

  // Add English pairs (with _en suffix)
  validEnPairs.forEach((pair) => {
    obj[`${pair.key.trim()}_en`] = pair.value;
  });

  return JSON.stringify(obj);
}

interface VisitInfoFormProps {
  info?: VisitInfo;
  isNew?: boolean;
}

export function VisitInfoForm({ info, isNew = false }: VisitInfoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize separate key-value pairs for Chinese and English
  const [keyValuePairsZh, setKeyValuePairsZh] = useState<KeyValuePair[]>(() =>
    parseExtraData(info?.extra_data).zh
  );
  const [keyValuePairsEn, setKeyValuePairsEn] = useState<KeyValuePair[]>(() =>
    parseExtraData(info?.extra_data).en
  );

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

  // Chinese key-value pair handlers
  const handleAddPairZh = useCallback(() => {
    setKeyValuePairsZh((prev) => [...prev, { key: '', value: '' }]);
  }, []);

  const handleRemovePairZh = useCallback((index: number) => {
    setKeyValuePairsZh((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handlePairChangeZh = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      setKeyValuePairsZh((prev) =>
        prev.map((pair, i) => (i === index ? { ...pair, [field]: value } : pair))
      );
    },
    []
  );

  // English key-value pair handlers
  const handleAddPairEn = useCallback(() => {
    setKeyValuePairsEn((prev) => [...prev, { key: '', value: '' }]);
  }, []);

  const handleRemovePairEn = useCallback((index: number) => {
    setKeyValuePairsEn((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handlePairChangeEn = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      setKeyValuePairsEn((prev) =>
        prev.map((pair, i) => (i === index ? { ...pair, [field]: value } : pair))
      );
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Convert separate Chinese and English key-value pairs to JSON string
    const extraDataJson = keyValuePairsToJson(keyValuePairsZh, keyValuePairsEn);
    const submitData = {
      ...formData,
      extra_data: extraDataJson || null,
    };

    try {
      if (isNew) {
        await visitInfoService.create(submitData as VisitInfoCreate);
        toast.success('新增成功');
      } else if (info) {
        await visitInfoService.update(info.id, submitData);
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

      <Tabs defaultValue="zh" className="w-full">
        <TabsList>
          <TabsTrigger value="zh">中文</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>

        <TabsContent value="zh" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>額外資料 (中文)</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPairZh}
              >
                <Plus className="mr-2 h-4 w-4" />
                新增欄位
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {keyValuePairsZh.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  尚無額外資料，點擊「新增欄位」來新增
                </p>
              ) : (
                <div className="space-y-3">
                  {keyValuePairsZh.map((pair, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          placeholder="欄位名稱（如：phone, address）"
                          value={pair.key}
                          onChange={(e) =>
                            handlePairChangeZh(index, 'key', e.target.value)
                          }
                        />
                      </div>
                      <div className="flex-[2]">
                        <Input
                          placeholder="欄位值"
                          value={pair.value}
                          onChange={(e) =>
                            handlePairChangeZh(index, 'value', e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePairZh(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                用於儲存電話、地址、開放時間等結構化資訊
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Extra Data (English)</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPairEn}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {keyValuePairsEn.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No extra data yet. Click &quot;Add Field&quot; to add.
                </p>
              ) : (
                <div className="space-y-3">
                  {keyValuePairsEn.map((pair, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          placeholder="Field name (e.g., phone, address)"
                          value={pair.key}
                          onChange={(e) =>
                            handlePairChangeEn(index, 'key', e.target.value)
                          }
                        />
                      </div>
                      <div className="flex-[2]">
                        <Input
                          placeholder="Field value"
                          value={pair.value}
                          onChange={(e) =>
                            handlePairChangeEn(index, 'value', e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePairEn(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                For storing phone, address, opening hours, and other structured information
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
