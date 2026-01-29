import { adminFetch } from './api';
import type {
  MediaFile,
  MediaFileCreate,
  MediaFileUpdate,
  MediaFileListResponse,
  PresignedUrlRequest,
  PresignedUrlResponse,
  AllowedFileTypes,
} from '@/types/media';

// Media CRUD
export async function listMediaFiles(params?: {
  page?: number;
  page_size?: number;
  category?: string;
  folder?: string;
  search?: string;
}): Promise<MediaFileListResponse> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return adminFetch<MediaFileListResponse>(`/api/v1/media${query ? `?${query}` : ''}`);
}

export async function getMediaFile(id: number): Promise<MediaFile> {
  return adminFetch<MediaFile>(`/api/v1/media/${id}`);
}

export async function createMediaFile(data: MediaFileCreate): Promise<MediaFile> {
  return adminFetch<MediaFile>('/api/v1/media', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMediaFile(
  id: number,
  data: MediaFileUpdate
): Promise<MediaFile> {
  return adminFetch<MediaFile>(`/api/v1/media/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteMediaFile(id: number): Promise<void> {
  await adminFetch(`/api/v1/media/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteMediaByUrl(url: string): Promise<void> {
  await adminFetch(`/api/v1/media/by-url/delete?url=${encodeURIComponent(url)}`, {
    method: 'DELETE',
  });
}

export async function listFolders(): Promise<string[]> {
  return adminFetch<string[]>('/api/v1/media/folders/list');
}

// Upload functions
export async function getPresignedUrl(
  request: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  return adminFetch<PresignedUrlResponse>('/api/v1/uploads/presign', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getAllowedTypes(): Promise<AllowedFileTypes> {
  return adminFetch<AllowedFileTypes>('/api/v1/uploads/allowed-types');
}

// Upload file to S3 using presigned URL
export async function uploadFileToS3(
  file: File,
  presignedUrl: string
): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
}

// Complete upload flow: get presigned URL, upload to S3, create media record
export async function uploadMedia(
  file: File,
  options?: {
    folder?: string;
    alt_text?: string;
    alt_text_zh?: string;
  }
): Promise<MediaFile> {
  // 1. Get presigned URL
  const presigned = await getPresignedUrl({
    filename: file.name,
    content_type: file.type,
    folder: options?.folder,
  });

  // 2. Upload to S3
  await uploadFileToS3(file, presigned.upload_url);

  // 3. Get image dimensions if it's an image
  let width: number | undefined;
  let height: number | undefined;

  if (file.type.startsWith('image/')) {
    const dimensions = await getImageDimensions(file);
    width = dimensions.width;
    height = dimensions.height;
  }

  // 4. Create media record
  const mediaData: MediaFileCreate = {
    filename: presigned.s3_key.split('/').pop() || file.name,
    original_filename: file.name,
    s3_key: presigned.s3_key,
    public_url: presigned.public_url,
    content_type: file.type,
    file_size: file.size,
    category: file.type.startsWith('image/') ? 'images' : 'videos',
    width,
    height,
    folder: options?.folder ? `${file.type.startsWith('image/') ? 'images' : 'videos'}/${options.folder}` : undefined,
    alt_text: options?.alt_text,
    alt_text_zh: options?.alt_text_zh,
  };

  return createMediaFile(mediaData);
}

// Helper to get image dimensions
function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}
