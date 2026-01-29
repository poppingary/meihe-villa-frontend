'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { uploadMedia, deleteMediaByUrl } from '@/services/admin/media';

interface MultiImageUploadProps {
  value: string[]; // Array of image URLs
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
  /** When true, deleting an image also removes it from S3 and database */
  deleteFromStorage?: boolean;
  /** S3 folder for organizing uploads (e.g. "news", "gallery") */
  folder?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  label = '相關圖片',
  maxImages = 10,
  deleteFromStorage = false,
  folder,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleUpload = useCallback(
    async (files: FileList) => {
      const validFiles = Array.from(files).filter((file) =>
        file.type.startsWith('image/')
      );

      if (validFiles.length === 0) {
        toast.error('請上傳圖片檔案');
        return;
      }

      if (value.length + validFiles.length > maxImages) {
        toast.error(`最多只能上傳 ${maxImages} 張圖片`);
        return;
      }

      setIsUploading(true);
      try {
        const uploadPromises = validFiles.map((file) => uploadMedia(file, { folder }));
        const results = await Promise.all(uploadPromises);
        const newUrls = results.map((media) => media.public_url);
        onChange([...value, ...newUrls]);
        toast.success(`成功上傳 ${newUrls.length} 張圖片`);
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error('圖片上傳失敗');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, value, maxImages, folder]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
    e.target.value = '';
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleUpload(files);
      }
    },
    [handleUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = async (index: number) => {
    const urlToDelete = value[index];

    if (deleteFromStorage && urlToDelete) {
      setDeletingIndex(index);
      try {
        await deleteMediaByUrl(urlToDelete);
        toast.success('圖片已刪除');
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('圖片刪除失敗');
      } finally {
        setDeletingIndex(null);
      }
    }

    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg border overflow-hidden"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  disabled={deletingIndex === index}
                >
                  {deletingIndex === index ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground">上傳中...</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  點擊或拖放圖片上傳（可多選）
                </p>
                <p className="text-xs text-muted-foreground">
                  已上傳 {value.length} / {maxImages} 張
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
