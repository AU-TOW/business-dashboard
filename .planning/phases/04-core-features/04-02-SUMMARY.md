# 04-02 Summary: Estimate Routes Tenant Context

## Completed

### Task 1: Update estimate CRUD routes
Updated 5 CRUD routes to use tenant context:

| Route | Change |
|-------|--------|
| `estimate/list` | `pool.query()` → `withTenantSchema()` |
| `estimate/get` | `pool.query()` → `withTenantSchema()` |
| `estimate/create` | `pool.connect()` → `withTenantSchema()` with BEGIN/COMMIT |
| `estimate/update` | `pool.connect()` → `withTenantSchema()` with BEGIN/COMMIT |
| `estimate/delete` | `pool.connect()` → `withTenantSchema()` with BEGIN/COMMIT |

### Task 2: Update share link and convert routes
Updated 2 specialized routes:

| Route | Change |
|-------|--------|
| `estimate/generate-share-link` | `pool.connect()` → `withTenantSchema()` |
| `estimate/convert-to-invoice` | `pool.connect()` → `withTenantSchema()` with transaction |

## Pattern Applied

```typescript
// Before
import pool from '@/lib/db';
const client = await pool.connect();
try {
  await client.query('BEGIN');
  // ... queries
  await client.query('COMMIT');
} finally {
  client.release();
}

// After
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';

const tenant = await getTenantFromRequest(request);
if (!tenant) {
  return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
}

return await withTenantSchema(tenant, async (client) => {
  try {
    await client.query('BEGIN');
    // ... queries (now scoped to tenant schema)
    await client.query('COMMIT');
    return NextResponse.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
});
```

## Critical Flows Preserved

1. **Booking → Estimate**: When creating estimate from `booking_id`, data transfers automatically
2. **Estimate → Invoice**: `convert-to-invoice` copies all fields and line items to new invoice in same tenant schema

## Verification
- ✅ `npm run build` succeeds
- ✅ No estimate routes import `pool` from `@/lib/db`
- ✅ All 7 estimate routes use `getTenantFromRequest` and `withTenantSchema`
- ✅ Added `export const dynamic = 'force-dynamic'` to GET routes

## Files Changed
- `app/api/autow/estimate/list/route.ts`
- `app/api/autow/estimate/get/route.ts`
- `app/api/autow/estimate/create/route.ts`
- `app/api/autow/estimate/update/route.ts`
- `app/api/autow/estimate/delete/route.ts`
- `app/api/autow/estimate/generate-share-link/route.ts`
- `app/api/autow/estimate/convert-to-invoice/route.ts`

## Technical Notes
- Routes use `withTenantSchema()` which provides a PoolClient with `SET search_path TO tenant_xxx, public`
- Transaction handling (BEGIN/COMMIT/ROLLBACK) happens inside the callback
- No database schema modifications - session-level search_path only

## Next
Execute `04-03-PLAN.md` to update invoice routes.
