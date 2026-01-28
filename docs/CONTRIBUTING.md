# Contributing Guide

Development workflow, available scripts, environment setup, and testing procedures for the Meihe Villa frontend.

## Prerequisites

- Node.js 20+
- npm 10+
- Git

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/poppingary/meihe-villa-frontend.git
   cd meihe-villa-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local` and configure:
   ```bash
   cp .env.example .env.local
   ```

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL. Leave empty for dev proxy. | Yes | `http://localhost:8000` |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL for metadata | Yes | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_NAME` | Site name shown in browser tabs | Yes | `梅鶴山莊 \| Meihe Villa` |
| `NEXT_PUBLIC_CDN_URL` | CloudFront CDN URL for images | Yes | `https://d3e6xq549z85ve.cloudfront.net` |

**Development Tip:** Set `NEXT_PUBLIC_API_URL=` (empty) to use Next.js proxy and avoid CORS issues.

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server with hot reload |
| `build` | `npm run build` | Build production bundle |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint on codebase |
| `test` | `npm run test` | Run unit tests in watch mode |
| `test:unit` | `npm run test:unit` | Run unit tests once |
| `test:coverage` | `npm run test:coverage` | Run unit tests with coverage report |
| `test:e2e` | `npm run test:e2e` | Run Playwright E2E tests |
| `test:e2e:ui` | `npm run test:e2e:ui` | Run E2E tests with interactive UI |
| `test:e2e:headed` | `npm run test:e2e:headed` | Run E2E tests in headed browser |
| `test:e2e:debug` | `npm run test:e2e:debug` | Run E2E tests in debug mode |
| `test:e2e:report` | `npm run test:e2e:report` | View Playwright test report |

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 2. Backend API

Ensure the backend is running at `http://localhost:8000` (or configure proxy in `next.config.ts`).

### 3. Make Changes

- Edit pages in `src/app/`
- Edit components in `src/components/`
- Edit services in `src/services/`
- Edit utilities in `src/lib/`

### 4. Run Tests Before Committing

```bash
# Run unit tests
npm run test:unit

# Run E2E tests (requires dev server running)
npm run test:e2e

# Check lint
npm run lint
```

### 5. Build and Verify

```bash
npm run build
npm run start
```

## Testing Procedures

### Unit Tests (Vitest)

Unit tests are located in `tests/unit/` and test utilities, services, and pure functions.

```bash
# Watch mode (development)
npm run test

# Single run
npm run test:unit

# With coverage report
npm run test:coverage
```

**Coverage Requirements:** 80% minimum for statements, branches, functions, and lines.

**Current Coverage:**
- `src/lib/utils.ts` - 100%
- `src/lib/cdn.ts` - 100%
- `src/services/api.ts` - 100%

### E2E Tests (Playwright)

E2E tests are located in `tests/e2e/` and test user flows.

```bash
# Run all E2E tests
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Debug mode (step through tests)
npm run test:e2e:debug

# View HTML report
npm run test:e2e:report
```

**E2E Test Suites:**
- Public pages navigation and content
- Admin authentication flows
- Mobile viewport responsiveness

## Code Style

- **Formatting:** Prettier with Tailwind plugin
- **Linting:** ESLint with Next.js config
- **TypeScript:** Strict mode enabled

Run formatting:
```bash
npx prettier --write .
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── services/      # API client layer
├── types/         # TypeScript interfaces
├── lib/           # Utilities and helpers
└── config/        # Site configuration

tests/
├── unit/          # Vitest unit tests
├── e2e/           # Playwright E2E tests
└── setup.ts       # Test setup and mocks
```

## Pull Request Guidelines

1. Create a feature branch from `main`
2. Write tests for new functionality
3. Ensure all tests pass
4. Run `npm run lint` and fix any issues
5. Build successfully with `npm run build`
6. Create PR with clear description
