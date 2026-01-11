# Plan 07-01 Summary: Business Settings & Logo Upload

## Completed: 2026-01-11

## Objective
Create business settings page with logo upload and tenant configuration.

## What Was Done

### Task 1: Tenant Settings API Routes ✓
Created two API routes for tenant configuration:

**GET/POST `/api/autow/tenant/settings`**
- GET returns all tenant settings including business info, contact details, bank details
- POST updates tenant settings with field-by-field validation
- Validates hex color format for primaryColor
- Uses public.tenants table (not tenant schema)

**POST/DELETE `/api/autow/tenant/logo`**
- Uploads logo to Supabase Storage bucket `tenant-logos`
- Tenant-isolated storage paths: `{tenant_id}/{filename}`
- Validates file type (PNG, JPG, WEBP only)
- Validates file size (2MB max)
- Deletes old logo before uploading new one
- DELETE endpoint removes logo from storage and database

### Task 2: Business Settings Page ✓
Created comprehensive settings page at `/[tenant]/settings` with sections:

1. **Business Information**
   - Editable business name
   - Trade type (display only, requires support to change)

2. **Logo Upload**
   - Preview current logo or placeholder
   - Upload new logo with drag-and-drop style UX
   - Remove logo option
   - File validation feedback

3. **Contact Details**
   - Email, phone, address, postcode
   - All editable with live form state

4. **Bank Details**
   - Bank name, account name, sort code, account number
   - Shows "These appear on your invoices" hint

5. **Branding (Primary Color)**
   - Color picker with hex input
   - Preview button showing selected color
   - Tier-gated: Business+ can customize, lower tiers see upgrade message

6. **Subscription Info**
   - Current plan display with tier badge
   - Trial countdown if applicable
   - Feature limits (bookings, bots, users)
   - Disabled "Upgrade Plan" button (coming soon)

**UI Features:**
- Glass UI styling matching welcome page
- Toast notifications for success/error feedback
- Back button navigation
- Responsive design with media queries

### Task 3: Navigation Link ✓
- Added `settings` path to `useTenantPath()` hook
- Added Settings card to welcome page grid
- Settings icon (⚙️) with "Business details & branding" description

## Files Created/Modified

### New Files
- `app/api/autow/tenant/settings/route.ts` - Settings GET/POST API
- `app/api/autow/tenant/logo/route.ts` - Logo upload/delete API
- `app/[tenant]/settings/page.tsx` - Settings page

### Modified Files
- `lib/tenant/TenantProvider.tsx` - Added `settings` path
- `app/[tenant]/welcome/page.tsx` - Added Settings card

## Verification
- [x] `npm run build` succeeds without errors
- [x] Settings API routes work (GET and POST patterns)
- [x] Logo upload stores file to Supabase Storage
- [x] Settings page renders all tenant fields
- [x] Settings link visible on welcome page

## Technical Notes

**Storage Bucket:**
- Uses `tenant-logos` bucket (separate from `receipts`)
- Requires bucket creation in Supabase dashboard with public access
- Files stored as `{tenant_id}/logo_{timestamp}.{ext}`

**Tier Gating:**
- Logo upload: Available to all tiers
- Primary color customization: Business+ only (uses `canAccessFeature('customBranding')`)

**API Authentication:**
- Uses existing `AUTOW_STAFF_TOKEN` pattern
- Tenant context from `X-Tenant-Slug` header

## Next Steps
- Plan 07-02: Dynamic Theming (CSS variables, color application)
