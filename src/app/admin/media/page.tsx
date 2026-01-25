'use client';

import { useEffect, useState, useCallback } from 'react';
import { Upload, Trash2, Search, Grid, List, Image as ImageIcon, Video } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/admin/common';
import {
  listMediaFiles,
  deleteMediaFile,
  uploadMedia,
  updateMediaFile,
} from '@/services/admin/media';
import type { MediaFile, MediaFileListResponse } from '@/types/media';

export default function MediaLibraryPage() {
  const [mediaData, setMediaData] = useState<MediaFileListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);

  // Filters
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listMediaFiles({
        page,
        page_size: 24,
        category: category || undefined,
        search: search || undefined,
      });
      setMediaData(data);
    } catch (error) {
      toast.error('載入媒體庫失敗');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        await uploadMedia(file);
        return { success: true, filename: file.name };
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        return { success: false, filename: file.name, error };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    if (successCount > 0) {
      toast.success(`成功上傳 ${successCount} 個檔案`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} 個檔案上傳失敗`);
    }

    setIsUploading(false);
    loadMedia();

    // Reset input
    e.target.value = '';
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMediaFile(deleteTarget.id);
      toast.success('刪除成功');
      loadMedia();
      if (selectedMedia?.id === deleteTarget.id) {
        setSelectedMedia(null);
      }
    } catch (error) {
      toast.error('刪除失敗');
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleUpdateMetadata = async (data: { alt_text_zh?: string }) => {
    if (!selectedMedia) return;
    try {
      const updated = await updateMediaFile(selectedMedia.id, data);
      setSelectedMedia(updated);
      loadMedia();
      toast.success('更新成功');
    } catch (error) {
      toast.error('更新失敗');
      console.error(error);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">媒體庫</h2>
          <p className="text-muted-foreground">管理圖片和影片檔案</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button asChild disabled={isUploading}>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? '上傳中...' : '上傳檔案'}
            </label>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="搜尋檔案名稱..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-64"
          />
          <Button variant="outline" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select value={category || 'all'} onValueChange={(v) => { setCategory(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="所有類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有類型</SelectItem>
            <SelectItem value="images">圖片</SelectItem>
            <SelectItem value="videos">影片</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1 ml-auto">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : mediaData && mediaData.items.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaData.items.map((media) => (
                <div
                  key={media.id}
                  className="group relative aspect-square rounded-lg border overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary"
                  onClick={() => setSelectedMedia(media)}
                >
                  {media.category === 'images' ? (
                    <img
                      src={media.public_url}
                      alt={media.alt_text_zh || media.original_filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm text-center px-2 truncate">
                      {media.original_filename}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">預覽</th>
                    <th className="text-left p-3 font-medium">檔案名稱</th>
                    <th className="text-left p-3 font-medium">類型</th>
                    <th className="text-left p-3 font-medium">大小</th>
                    <th className="text-left p-3 font-medium">上傳時間</th>
                    <th className="text-left p-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaData.items.map((media) => (
                    <tr
                      key={media.id}
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedMedia(media)}
                    >
                      <td className="p-3">
                        <div className="w-12 h-12 rounded overflow-hidden">
                          {media.category === 'images' ? (
                            <img
                              src={media.public_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Video className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="truncate block max-w-xs">{media.original_filename}</span>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">
                          {media.category === 'images' ? (
                            <><ImageIcon className="h-3 w-3 mr-1" /> 圖片</>
                          ) : (
                            <><Video className="h-3 w-3 mr-1" /> 影片</>
                          )}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {formatFileSize(media.file_size)}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(media.created_at).toLocaleDateString('zh-TW')}
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(media);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {mediaData.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                上一頁
              </Button>
              <span className="text-sm text-muted-foreground">
                第 {page} 頁，共 {mediaData.total_pages} 頁
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(mediaData.total_pages, p + 1))}
                disabled={page >= mediaData.total_pages}
              >
                下一頁
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>媒體庫是空的</p>
          <p className="text-sm">上傳圖片或影片開始使用</p>
        </div>
      )}

      {/* Media Detail Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>媒體詳情</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                {selectedMedia.category === 'images' ? (
                  <img
                    src={selectedMedia.public_url}
                    alt={selectedMedia.alt_text_zh || ''}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.public_url}
                    controls
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">檔案名稱</Label>
                  <p className="font-medium break-all">{selectedMedia.original_filename}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">類型</Label>
                    <p>{selectedMedia.content_type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">大小</Label>
                    <p>{formatFileSize(selectedMedia.file_size)}</p>
                  </div>
                  {selectedMedia.width && selectedMedia.height && (
                    <>
                      <div>
                        <Label className="text-muted-foreground">尺寸</Label>
                        <p>{selectedMedia.width} × {selectedMedia.height}</p>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">URL</Label>
                  <Input
                    value={selectedMedia.public_url}
                    readOnly
                    onClick={(e) => {
                      (e.target as HTMLInputElement).select();
                      navigator.clipboard.writeText(selectedMedia.public_url);
                      toast.success('已複製到剪貼簿');
                    }}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="alt_text_zh">替代文字 (中文)</Label>
                  <Input
                    id="alt_text_zh"
                    defaultValue={selectedMedia.alt_text_zh || ''}
                    onBlur={(e) => {
                      if (e.target.value !== (selectedMedia.alt_text_zh || '')) {
                        handleUpdateMetadata({ alt_text_zh: e.target.value || undefined });
                      }
                    }}
                    placeholder="輸入圖片描述..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteTarget(selectedMedia)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    刪除
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="確認刪除"
        description={`確定要刪除「${deleteTarget?.original_filename}」嗎？此操作無法復原。`}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
