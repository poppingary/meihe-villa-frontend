# Dead Code Analysis Report

**Generated:** 2026-01-28
**Project:** meihe-villa/frontend

## Summary

| Category | Count | Action |
|----------|-------|--------|
| Unused Files | 17 | Review for deletion |
| Unused Dependencies | 8 | May be false positives |
| Unused Exports | 47 | Keep (shadcn/ui pattern) |
| Unused Types | 6 | Keep for future use |

---

## 1. Unused Files (17)

### SAFE TO DELETE - Index/Barrel Files (7)
These are empty barrel export files that aren't being used:

| File | Reason | Severity |
|------|--------|----------|
| `src/components/admin/layout/index.ts` | Unused barrel export | SAFE |
| `src/components/layout/index.ts` | Unused barrel export | SAFE |
| `src/components/sections/index.ts` | Unused barrel export | SAFE |
| `src/components/ui/index.ts` | Unused barrel export | SAFE |
| `src/hooks/admin/index.ts` | Unused barrel export | SAFE |
| `src/services/admin/index.ts` | Unused barrel export | SAFE |
| `src/services/index.ts` | Unused barrel export | SAFE |
| `src/types/admin/index.ts` | Unused barrel export | SAFE |
| `src/types/index.ts` | Unused barrel export | SAFE |

### CAUTION - Potentially Unused Components (4)
These UI components may be used in the future:

| File | Reason | Severity |
|------|--------|----------|
| `src/components/ui/avatar.tsx` | shadcn/ui component, may be needed | CAUTION |
| `src/components/ui/checkbox.tsx` | shadcn/ui component, may be needed | CAUTION |
| `src/components/ui/form.tsx` | shadcn/ui component, may be needed | CAUTION |
| `src/components/ui/separator.tsx` | shadcn/ui component, may be needed | CAUTION |
| `src/components/ui/sheet.tsx` | shadcn/ui component, may be needed | CAUTION |

### CAUTION - Potentially Unused Utilities (3)

| File | Reason | Severity |
|------|--------|----------|
| `src/hooks/admin/useAuth.ts` | Custom hook, check if used | CAUTION |
| `src/lib/constants.ts` | May contain constants used elsewhere | CAUTION |
| `src/services/categories.ts` | Service file, may be API layer | CAUTION |

---

## 2. Unused Dependencies

### Flagged by depcheck (8)

| Package | Status | Notes |
|---------|--------|-------|
| `@hookform/resolvers` | KEEP | Used with react-hook-form for Zod validation |
| `@tiptap/extension-placeholder` | REVIEW | Rich text editor - may be planned feature |
| `@tiptap/react` | REVIEW | Rich text editor - may be planned feature |
| `@tiptap/starter-kit` | REVIEW | Rich text editor - may be planned feature |
| `date-fns` | KEEP | Date formatting utility |
| `react-dropzone` | KEEP | File upload component |
| `swr` | KEEP | Data fetching library |
| `zod` | KEEP | Schema validation |

**Recommendation:** The Tiptap packages can be removed if rich text editing is not planned.

---

## 3. Unused Exports (47)

Most of these are from **shadcn/ui components** which export all sub-components even if not all are used. This is the expected pattern.

### UI Component Exports (Keep)
- `DropdownMenu*` variants - Standard shadcn/ui exports
- `AlertDialog*` variants - Standard shadcn/ui exports
- `Select*` variants - Standard shadcn/ui exports
- `Dialog*` variants - Standard shadcn/ui exports
- `Table*` variants - Standard shadcn/ui exports
- `Card*` variants - Standard shadcn/ui exports

### Service Layer Exports (Review)

| Export | File | Notes |
|--------|------|-------|
| `createMediaFile` | services/admin/media.ts | May be unused API wrapper |
| `getPresignedUrl` | services/admin/media.ts | May be unused API wrapper |
| `getAllowedTypes` | services/admin/media.ts | May be unused utility |
| `uploadFileToS3` | services/admin/media.ts | May be unused API wrapper |
| `getMediaFile` | services/admin/media.ts | May be unused API wrapper |
| `listFolders` | services/admin/media.ts | May be unused API wrapper |
| `getVisitInfoBySection` | services/visit-info.ts | May be unused API wrapper |
| `getCurrentUser` | services/admin/auth.ts | May be unused API wrapper |
| `getUser` | services/admin/users.ts | May be unused API wrapper |
| `getHeritageSiteById` | services/heritage.ts | May be unused API wrapper |
| `createHeritageSite` | services/heritage.ts | May be unused API wrapper |
| `updateHeritageSite` | services/heritage.ts | May be unused API wrapper |
| `deleteHeritageSite` | services/heritage.ts | May be unused API wrapper |
| `getTimelineEvents` | services/timeline.ts | May be unused API wrapper |
| `getHeritageSites` | services/heritage.ts | May be unused API wrapper |

### Utility Exports (Review)

| Export | File | Notes |
|--------|------|-------|
| `newsImages` | lib/placeholders.ts | Placeholder data |
| `formatDate` | lib/utils.ts | Date formatting utility |
| `generateOrganizationSchema` | lib/seo.ts | SEO utility |
| `generateWebsiteSchema` | lib/seo.ts | SEO utility |
| `cdnUrls` | lib/cdn.ts | CDN URL helper |
| `ApiError` | services/api.ts | Error class |
| `ApiError` | services/admin/api.ts | Error class |

---

## 4. Recommendations

### Safe to Delete Now (9 files)
These barrel/index files provide no value and can be safely deleted:

```bash
rm src/components/admin/layout/index.ts
rm src/components/layout/index.ts
rm src/components/sections/index.ts
rm src/components/ui/index.ts
rm src/hooks/admin/index.ts
rm src/services/admin/index.ts
rm src/services/index.ts
rm src/types/admin/index.ts
rm src/types/index.ts
```

### Consider Removing (3 packages)
If rich text editing is not planned:

```bash
npm uninstall @tiptap/extension-placeholder @tiptap/react @tiptap/starter-kit
```

### Keep for Now
- All shadcn/ui components (standard pattern)
- All service layer exports (API completeness)
- All utility functions (may be used in future)

---

## 5. Test Verification Required

Before any deletion:
1. Run `npm run build` to verify no build errors
2. Run `npm run test:e2e` to verify no runtime errors
3. Verify the app works in browser

