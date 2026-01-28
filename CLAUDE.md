# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontend application for **Meihe Villa** (梅鶴山莊) - a Taiwan heritage/historic sites website (台灣古蹟網站). This Next.js 14+ frontend consumes REST APIs from the companion FastAPI backend. Includes a CMS admin panel for content management.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Font**: Noto Serif TC (思源宋體)
- **Rendering**: SSG + ISR (Static Site Generation with Incremental Static Regeneration)
- **Deployment**: Docker with standalone output on AWS EC2

## Build Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Format code with Prettier
npx prettier --write .
```

## Docker Commands

```bash
# Build Docker image
docker build -t meihe-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  meihe-frontend

# Run with docker-compose (frontend + backend + db)
docker-compose up -d
```

## Project Structure

```
src/
├── app/
│   ├── (main)/                 # Route group with header/footer (public pages)
│   │   ├── layout.tsx          # Main layout with Header/Footer
│   │   ├── page.tsx            # Home page
│   │   ├── about/page.tsx      # About page
│   │   ├── architecture/
│   │   │   ├── page.tsx        # Architecture list
│   │   │   └── [slug]/page.tsx # Architecture detail
│   │   ├── gallery/page.tsx    # Gallery page
│   │   ├── visit/page.tsx      # Visit information
│   │   ├── news/
│   │   │   ├── page.tsx        # News list
│   │   │   └── [slug]/page.tsx # News detail
│   │   ├── privacy/page.tsx    # Privacy policy
│   │   ├── terms/page.tsx      # Terms of service
│   │   └── contact/page.tsx    # Contact page
│   ├── admin/                  # CMS Admin panel
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── login/page.tsx      # Admin login
│   │   ├── heritage/           # Heritage sites management
│   │   ├── categories/         # Categories management
│   │   ├── news/               # News management
│   │   ├── timeline/           # Timeline management
│   │   ├── visit-info/         # Visit info management
│   │   ├── media/              # Media library (S3)
│   │   └── users/              # Account management (superadmin only)
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── not-found.tsx           # 404 page
│   ├── sitemap.ts              # Dynamic sitemap
│   └── robots.ts               # Robots.txt
├── components/
│   ├── layout/                 # Header, Footer, Navigation
│   ├── ui/                     # Button, Card, Container, Input, etc.
│   ├── sections/               # HeroSection, TimelineSection, GalleryGrid, MapSection
│   └── admin/                  # Admin components
│       ├── layout/             # AdminSidebar, AdminHeader
│       ├── auth/               # LoginForm, AuthProvider
│       └── forms/              # HeritageForm, NewsForm, TimelineForm, etc.
├── services/                   # API client layer
│   ├── api.ts                  # Base fetch wrapper with caching
│   ├── heritage.ts             # Heritage site endpoints
│   ├── categories.ts           # Category endpoints
│   ├── news.ts                 # News endpoints
│   ├── timeline.ts             # Timeline endpoints
│   ├── visit-info.ts           # Visit info endpoints
│   ├── media.ts                # Media library endpoints
│   ├── auth.ts                 # Authentication endpoints
│   └── admin/                  # Admin-specific services
│       ├── auth.ts             # Admin auth with cookie handling
│       ├── users.ts            # User management endpoints
│       └── visitInfo.ts        # Visit info CRUD operations
├── types/                      # TypeScript interfaces
│   ├── heritage.ts             # Heritage/Category types
│   ├── api.ts                  # API response types
│   ├── common.ts               # Common types
│   └── admin/
│       └── auth.ts             # User, AuthState, LoginCredentials types
├── lib/                        # Utilities
│   ├── utils.ts                # cn(), parseImages(), formatDate()
│   ├── constants.ts            # Revalidation times, breakpoints
│   └── seo.ts                  # JSON-LD schema generators
└── config/
    ├── site.ts                 # Site metadata
    └── navigation.ts           # Navigation links
```

## Backend API Integration

The backend API runs at:
- **Development**: `http://localhost:8000` (proxied via Next.js rewrites)
- **Production**: `http://3.144.76.155` (AWS EC2)
- **API Documentation**: `http://localhost:8000/docs`

### Development Proxy

In development, API requests are proxied through Next.js to avoid cross-origin cookie issues:

```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/api/:path*',
    },
  ];
}
```

Set `NEXT_PUBLIC_API_URL=` (empty) in `.env.local` for development.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/heritage/sites` | List heritage sites |
| GET | `/api/v1/heritage/sites/{id}` | Get site by ID |
| GET | `/api/v1/heritage/sites/slug/{slug}` | Get site by slug |
| POST | `/api/v1/heritage/sites` | Create site (auth required) |
| PATCH | `/api/v1/heritage/sites/{id}` | Update site (auth required) |
| DELETE | `/api/v1/heritage/sites/{id}` | Delete site (auth required) |
| GET | `/api/v1/heritage/categories` | List categories |
| POST | `/api/v1/heritage/categories` | Create category (auth required) |
| GET | `/api/v1/news` | List news |
| POST | `/api/v1/news` | Create news (auth required) |
| GET | `/api/v1/timeline` | List timeline events |
| POST | `/api/v1/timeline` | Create timeline event (auth required) |
| GET | `/api/v1/visit-info` | List visit info |
| POST | `/api/v1/visit-info` | Create visit info (auth required) |
| GET | `/api/v1/media` | List media files |
| POST | `/api/v1/media/upload` | Upload media to S3 (auth required) |
| POST | `/api/v1/auth/login` | Login (returns JWT cookie) |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/auth/me` | Get current user |
| GET | `/api/v1/users` | List users (superadmin only) |
| POST | `/api/v1/users` | Create user (superadmin only) |
| PATCH | `/api/v1/users/{id}` | Update user (superadmin only) |
| DELETE | `/api/v1/users/{id}` | Delete user (superadmin only) |

## Component Patterns

### UI Components

Use the utility function `cn()` from `@/lib/utils` for merging Tailwind classes:

```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-classes', conditional && 'conditional-classes', className)} />
```

### API Calls with Caching

Use the `fetchApi` wrapper with Next.js caching options:

```typescript
import { fetchApi } from '@/services/api';

// With ISR (revalidate every hour)
const data = await fetchApi<HeritageSite[]>('/api/v1/heritage/sites', {
  revalidate: 3600,
  tags: ['heritage-sites'],
});
```

### Page Metadata

Export metadata object or generateMetadata function:

```typescript
export const metadata: Metadata = {
  title: '頁面標題',
  description: '頁面描述',
};

// Or for dynamic pages:
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const site = await getHeritageSiteBySlug(params.slug);
  return {
    title: site.name_zh,
    description: site.description_zh,
  };
}
```

## CMS Admin Panel

The admin panel is accessible at `/admin` and requires authentication.

### Authentication

- Uses JWT tokens stored in httpOnly cookies
- Login at `/admin/login`
- AuthProvider context manages auth state and redirects:
  - Unauthenticated users → redirect to `/admin/login`
  - Authenticated users on `/admin/login` → redirect to `/admin`
- Role-based access: `admin` (管理員) and `superadmin` (最高管理員)
- Only superadmin can access account management (`/admin/users`)

### Admin Features

- **Heritage Sites**: Create, edit, delete heritage site entries
- **Categories**: Manage heritage site categories
- **News**: Publish news articles
- **Timeline**: Manage historical timeline events
- **Visit Info**: Update visiting hours, tickets, etc.
- **Media Library**: Upload and manage images/videos on S3
- **Account Management**: Manage admin users (superadmin only)

## Content Requirements

- **Primary Language**: Traditional Chinese (繁體中文)
- **Secondary Language**: English
- **Font**: Noto Serif TC (思源宋體) for all text
- Heritage site data includes: name, description, history, location, images, designation level

## Environment Variables

```env
# Development (use proxy)
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=梅鶴山莊 | Meihe Villa
NEXT_PUBLIC_CDN_URL=https://d3e6xq549z85ve.cloudfront.net

# Production
NEXT_PUBLIC_API_URL=http://3.144.76.155
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## AWS EC2 Deployment

### CI/CD Pipeline (GitHub Actions)

Push to `main` branch triggers automatic deployment:
1. Build Docker image
2. Push to Amazon ECR
3. SSH to EC2 and deploy

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `EC2_HOST` | EC2 public IP |
| `EC2_USERNAME` | SSH username (`ec2-user` or `ubuntu`) |
| `EC2_SSH_KEY` | EC2 private key (PEM content) |
| `NEXT_PUBLIC_API_URL` | Production API URL |
| `NEXT_PUBLIC_SITE_URL` | Production site URL |
| `NEXT_PUBLIC_SITE_NAME` | Site name |
| `NEXT_PUBLIC_CDN_URL` | CloudFront CDN URL for images |

### Deployment Scripts

```bash
# Initial EC2 setup
./scripts/ec2-setup.sh

# Manual deployment on EC2
./scripts/deploy.sh
```

### Production Docker Compose

```bash
# Without Nginx (direct port 3000)
docker-compose -f docker-compose.prod.yml up -d

# With Nginx reverse proxy (ports 80/443)
docker-compose -f docker-compose.prod.yml --profile with-nginx up -d
```

See `docs/DEPLOYMENT.md` for detailed setup instructions.

## Data Formats

### VisitInfo extra_data (Bilingual Key-Value Pairs)

The `extra_data` field stores bilingual key-value pairs as JSON. Keys are display labels, not variable names.

**JSON Format:**
- Chinese keys: No suffix (e.g., `電話`, `地址`)
- English keys: `_en` suffix (e.g., `phone_en`, `address_en`)

**Example:**
```json
{
  "電話": "03-332-2592",
  "地址": "335桃園市大溪區福安里頭寮一路111號",
  "phone_en": "03-332-2592",
  "address_en": "No. 111, Touliao 1st Road, Daxi District, Taoyuan City 335, Taiwan"
}
```

**Admin Form Display (VisitInfoForm.tsx):**
- Chinese tab: Shows keys without `_en` suffix with Chinese values
- English tab: Shows keys with `_en` suffix stripped with English values

**Parsing Logic:**
```typescript
// Keys ending with _en go to English pairs (suffix stripped)
// Other keys go to Chinese pairs
if (key.endsWith('_en')) {
  enPairs.push({ key: key.slice(0, -3), value });
} else {
  zhPairs.push({ key, value });
}
```

## Development Notes

- Images are served from CloudFront CDN (S3 bucket: `meihe-villa-media` for prod, `meihe-villa-media-dev` for dev)
- Use ISR with appropriate revalidation times for dynamic content
- TypeScript interfaces in `/src/types/` match backend Pydantic schemas
- The admin panel uses shadcn/ui components
