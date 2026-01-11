# Plan 06-01 Summary: Receipts with Supabase Storage

## Status: COMPLETED

**Executed:** 2026-01-11
**Duration:** ~15 minutes

## Objective

Migrate receipt image storage from Google Drive to Supabase Storage with tenant isolation and update all frontend pages to use tenant context.

## Tasks Completed

### Task 1: Update Supabase Storage Helper
- Modified `lib/supabase-storage.ts` to add `tenantSlug` parameter to `uploadReceiptImage()`
- Storage path now includes tenant isolation: `{tenantSlug}/{YYYY-MM}/{filename}`

### Task 2: Update Receipt API Routes
- Rewrote `app/api/autow/receipt/upload/route.ts` to use Supabase Storage
- Updated to store `storage_file_id`, `storage_file_url`, `storage_folder_path` columns
- Removed Google Drive dependencies
- Rewrote `app/api/autow/receipt/delete/route.ts` to use Supabase Storage for deletion

### Task 3: Update Receipts Frontend
- Updated `app/[tenant]/receipts/upload/page.tsx`:
  - Added `useTenant()` and `useTenantPath()` hooks
  - Added `X-Tenant-Slug` header to all fetch calls
  - Updated navigation paths to use `paths.receipts`
  - Changed loading message from "Uploading to Google Drive..." to "Uploading receipt..."

- Updated `app/[tenant]/receipts/page.tsx`:
  - Added tenant context imports and hooks
  - Added `X-Tenant-Slug` header to list and delete fetch calls
  - Replaced hardcoded `/autow/*` paths with dynamic `paths.*` helpers
  - Updated image display to use `storage_file_url` with backward compatibility for `gdrive_file_url`

- Added `receiptsUpload` path to `lib/tenant/TenantProvider.tsx`

## Files Changed

| File | Change |
|------|--------|
| `lib/supabase-storage.ts` | Added tenantSlug parameter |
| `lib/tenant/TenantProvider.tsx` | Added receiptsUpload path |
| `app/api/autow/receipt/upload/route.ts` | Switched to Supabase Storage |
| `app/api/autow/receipt/delete/route.ts` | Switched to Supabase Storage |
| `app/[tenant]/receipts/page.tsx` | Added tenant context |
| `app/[tenant]/receipts/upload/page.tsx` | Added tenant context |

## Verification

- [x] Build passes: `npm run build` succeeded
- [x] No type errors
- [x] All paths updated to use tenant context

## Notes

- Legacy receipts with Google Drive URLs will still display using "View Image (Legacy)" button
- New uploads will use Supabase Storage exclusively
- Storage path structure: `{tenantSlug}/{YYYY-MM}/RECEIPT_{timestamp}_{supplier}.{ext}`
