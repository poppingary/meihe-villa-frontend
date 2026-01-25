# S3 + CloudFront 圖片遷移設計

## 概述

將前端靜態圖片從 `public/images/` 遷移到 AWS S3，透過 CloudFront CDN 分發。

## 環境配置

| 環境 | S3 Bucket | CloudFront Domain |
|------|-----------|-------------------|
| Dev | `meihe-villa-media-dev` | `d3e6xq549z85ve.cloudfront.net` |
| Prod | `meihe-villa-media` | `d3sslvu5b2ypga.cloudfront.net` |

## 變更範圍

### 1. 新增環境變數

- `NEXT_PUBLIC_CDN_URL` - CloudFront domain URL

### 2. 新增檔案

- `/src/lib/cdn.ts` - CDN URL 工具函數

### 3. 修改檔案

- `/src/lib/placeholders.ts` - 使用 CDN URL
- 各頁面 fallback 圖片路徑更新

### 4. S3 上傳

保持現有目錄結構：
```
images/
├── hero/
├── gallery/
├── architecture/
├── news/
├── about/
└── visit/
```

### 5. 資料庫

後端 API 回傳的圖片 URL 直接存完整 CloudFront URL。

## 最終 URL 格式

```
https://d3sslvu5b2ypga.cloudfront.net/images/hero/hero-main.jpg
```
