# Plan 07-03 Summary: Share Page Customization

## Completed: 2026-01-11

## Objective
Apply tenant branding to public share pages for estimates, invoices, and damage assessments.

## What Was Done

### Task 1: Create Share Token Lookup Table ✓
Created migration `database/migrations/003_share_token_lookup.sql`:

**Problem Solved:**
Share tokens are stored in tenant-specific schemas, but share pages need to find the tenant without knowing which schema to query first.

**Solution:**
Public lookup table that maps share tokens to tenant slugs/schemas:

```sql
CREATE TABLE IF NOT EXISTS public.share_token_lookup (
    id SERIAL PRIMARY KEY,
    share_token VARCHAR(64) NOT NULL UNIQUE,
    document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('estimate', 'invoice', 'assessment')),
    document_id INTEGER NOT NULL,
    tenant_slug VARCHAR(50) NOT NULL REFERENCES public.tenants(slug) ON DELETE CASCADE,
    tenant_schema VARCHAR(63) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
```

**Helper Function:**
```sql
public.register_share_token(p_share_token, p_document_type, p_document_id, p_tenant_slug)
```
Call this when generating share tokens to register them in the lookup table.

### Task 2: Update Share Pages with Tenant Branding ✓

Updated all three share pages:
- `app/share/estimate/[token]/page.tsx`
- `app/share/invoice/[token]/page.tsx`
- `app/share/assessment/[token]/page.tsx`

**Common Pattern:**

1. **TenantBranding Interface:**
```typescript
interface TenantBranding {
  businessName: string;
  logoUrl: string | null;
  primaryColor: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  postcode: string | null;
  bankName: string | null;
  bankAccountName: string | null;
  bankSortCode: string | null;
  bankAccountNumber: string | null;
  subscriptionTier: string;
}
```

2. **Tier-Gated Color Customization:**
```typescript
function canCustomizeColor(tier: string): boolean {
  return ['trial', 'business', 'enterprise'].includes(tier);
}

const accentColor = canCustomizeColor(branding.subscriptionTier)
  ? branding.primaryColor
  : '#3B82F6';
```

3. **Query Pattern:**
```typescript
// Step 1: Look up tenant from share token
const lookupResult = await client.query(
  `SELECT tenant_slug, tenant_schema FROM public.share_token_lookup WHERE share_token = $1`,
  [token]
);
const tenantSchema = lookupResult.rows[0]?.tenant_schema || 'public';

// Step 2: Get tenant branding
const tenantResult = await client.query(
  `SELECT business_name, logo_url, primary_color, ... FROM public.tenants WHERE schema_name = $1`,
  [tenantSchema]
);

// Step 3: Query document from tenant schema
const result = await client.query(
  `SELECT * FROM "${tenantSchema}".estimates WHERE share_token = $1`,
  [token]
);
```

**Branding Applied:**
- Business logo in header
- Business name as title
- Primary color for accents (tier-gated)
- Contact information in footer
- Bank details on invoices

## Files Created/Modified

### New Files
- `database/migrations/003_share_token_lookup.sql` - Share token lookup table and helper function

### Modified Files
- `app/share/estimate/[token]/page.tsx` - Added tenant branding support
- `app/share/invoice/[token]/page.tsx` - Added tenant branding support
- `app/share/assessment/[token]/page.tsx` - Converted to server component with tenant branding

## Technical Notes

**Server Components:**
All share pages are now server components (no 'use client'). This enables:
- Direct database queries
- No client-side API calls
- Better SEO for shared documents
- Faster initial page load

**Fallback Behavior:**
- If no lookup entry exists, defaults to 'public' schema (backward compatibility)
- If no tenant branding found, uses default values:
  - Business name: "Business Dashboard"
  - Primary color: #3B82F6 (blue)
  - No logo

**Tier Gating:**
- Trial: Can use custom colors (has all features)
- Starter/Pro: Uses default blue
- Business/Enterprise: Can use custom colors

## Verification
- [x] `npm run build` succeeds without errors
- [x] Share pages render as server components (ƒ Dynamic)
- [x] Migration file has correct SQL syntax
- [x] Tenant branding query pattern consistent across all share pages

## Phase 7 Complete

With this plan complete, Phase 7 (Branding & Customization) is finished:
- ✓ 07-01: Business Settings & Logo Upload
- ✓ 07-02: Dynamic Theming
- ✓ 07-03: Share Page Customization

## Next Steps
- Phase 8: Landing Page & Polish
