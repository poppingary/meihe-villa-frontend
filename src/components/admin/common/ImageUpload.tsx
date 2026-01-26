'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { uploadMedia, deleteMediaByUrl } from '@/services/admin/media';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  /** When true, deleting an image also removes it from S3 and database */
  deleteFromStorage?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = '封面圖片',
  placeholder = '選擇或拖放圖片上傳...',
  deleteFromStorage = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('請上傳圖片檔案');
        return;
      }

      setIsUploading(true);
      try {
        const media = await uploadMedia(file);
        onChange(media.public_url);
        toast.success('圖片上傳成功');
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error('圖片上傳失敗');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    e.target.value = '';
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleUpload(file);
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

  const handleRemove = async () => {
    if (deleteFromStorage && value) {
      setIsDeleting(true);
      try {
        await deleteMediaByUrl(value);
        toast.success('圖片已刪除');
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('圖片刪除失敗');
      } finally {
        setIsDeleting(false);
      }
    }
    onChange('');
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {value ? (
        <div className="relative rounded-lg border overflow-hidden">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground">上傳中...</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{placeholder}</p>
                <p className="text-xs text-muted-foreground">
                  支援 JPG, PNG, GIF, WebP
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
