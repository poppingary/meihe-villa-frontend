/**
 * TypeScript interfaces for media files.
 */

export interface MediaFile {
  id: number;
  filename: string;
  original_filename: string;
  s3_key: string;
  public_url: string;
  content_type: string;
  file_size: number | null;
  category: string;
  folder: string | null;
  alt_text: string | null;
  alt_text_zh: string | null;
  caption: string | null;
  caption_zh: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}

export interface MediaFileCreate {
  filename: string;
  original_filename: string;
  s3_key: string;
  public_url: string;
  content_type: string;
  file_size?: number | null;
  category: string;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  alt_text_zh?: string | null;
  caption?: string | null;
  caption_zh?: string | null;
  folder?: string | null;
}

export interface MediaFileUpdate {
  alt_text?: string | null;
  alt_text_zh?: string | null;
  caption?: string | null;
  caption_zh?: string | null;
  folder?: string | null;
}

export interface MediaFileListResponse {
  items: MediaFile[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PresignedUrlRequest {
  filename: string;
  content_type: string;
}

export interface PresignedUrlResponse {
  upload_url: string;
  public_url: string;
  s3_key: string;
  content_type: string;
  max_size: number;
  expires_in: number;
}

export interface AllowedFileTypes {
  images: {
    types: string[];
    extensions: string[];
    max_size_bytes: number;
    max_size_mb: number;
  };
  videos: {
    types: string[];
    extensions: string[];
    max_size_bytes: number;
    max_size_mb: number;
  };
}
