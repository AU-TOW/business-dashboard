# 04-01 Summary: Tenant API Helper & Booking Routes

## Completed

### Task 1: Create tenant API helper utility
- Created `lib/api/withTenant.ts` with:
  - `withTenant()` - wraps API handlers with tenant extraction from X-Tenant-Slug header
  - `withTenantParams()` - variant for URL params

### Task 2: Update booking API routes
Updated 6 booking routes to use tenant context:

| Route | Change |
|-------|--------|
| `booking/list` | `query()` → `tenantQuery()` |
| `booking/get` | `query()` → `tenantQueryOne()` |
| `booking/create` | `query()` → `tenantQuery()` + `tenantMutate()` |
| `booking/update` | `query()` → `tenantMutate()` |
| `booking/delete` | `query()` → `tenantMutate()` |
| `booking/complete` | `query()` → `tenantMutate()` |

## Pattern Applied

```typescript
// Before
import { query } from '@/lib/db';
const result = await query('SELECT * FROM bookings');
return result.rows;

// After
import { getTenantFromRequest, tenantQuery } from '@/lib/tenant/context';

const tenant = await getTenantFromRequest(request);
if (!tenant) {
  return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
}
const bookings = await tenantQuery(tenant, 'SELECT * FROM bookings');
```

## Verification
- ✅ `npm run build` succeeds
- ✅ No booking routes import `query` from `@/lib/db`
- ✅ All 6 booking routes import `getTenantFromRequest`
- ✅ withTenant helper created at `lib/api/withTenant.ts`

## Files Changed
- `lib/api/withTenant.ts` (new)
- `app/api/autow/booking/list/route.ts`
- `app/api/autow/booking/get/route.ts`
- `app/api/autow/booking/create/route.ts`
- `app/api/autow/booking/update/route.ts`
- `app/api/autow/booking/delete/route.ts`
- `app/api/autow/booking/complete/route.ts`

## Technical Notes
- Tenant context uses `SET search_path TO tenant_xxx, public` for schema isolation
- No database schema modifications - only query execution pattern changed
- Session-level isolation (non-destructive)

## Next
Execute `04-02-PLAN.md` to update estimate routes.
