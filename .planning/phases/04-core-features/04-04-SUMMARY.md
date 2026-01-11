# 04-04 Summary: Notes, Receipts & Misc Routes Tenant Context

## Completed

### Task 1: Update notes routes
Updated 6 routes to use tenant context:

| Route | Change |
|-------|--------|
| `note/list` | `pool.query()` → `withTenantSchema()` |
| `note/get` | `pool.query()` → `withTenantSchema()` |
| `note/create` | `pool.query()` → `withTenantSchema()` |
| `note/update` | `pool.query()` → `withTenantSchema()` |
| `note/delete` | `pool.query()` → `withTenantSchema()` |
| `note/convert-to-booking` | `pool.query()` → `withTenantSchema()` (critical flow) |

Note: `jotter/parse` and `jotter/recognize` not updated - they don't interact with the database (text parsing and OpenAI only).

### Task 2: Update receipts and misc routes
Updated 5 routes to use tenant context:

| Route | Change |
|-------|--------|
| `receipt/list` | `pool.query()` → `withTenantSchema()` |
| `receipt/get` | `pool.query()` → `withTenantSchema()` |
| `receipt/upload` | `pool.query()` → `withTenantSchema()` |
| `receipt/delete` | `pool.query()` → `withTenantSchema()` |
| `document-number/preview` | `pool.query()` → `withTenantSchema()` |

Note: `receipt/parse` and `auth/login` not updated - they don't interact with the database (OpenAI and env vars only).

## Verification
- ✅ `npm run build` succeeds
- ✅ No updated routes import `pool` from `@/lib/db`
- ✅ All 11 routes use tenant context
- ✅ Added `export const dynamic = 'force-dynamic'` to GET routes

## Files Changed
- `app/api/autow/note/list/route.ts`
- `app/api/autow/note/get/route.ts`
- `app/api/autow/note/create/route.ts`
- `app/api/autow/note/update/route.ts`
- `app/api/autow/note/delete/route.ts`
- `app/api/autow/note/convert-to-booking/route.ts`
- `app/api/autow/receipt/list/route.ts`
- `app/api/autow/receipt/get/route.ts`
- `app/api/autow/receipt/upload/route.ts`
- `app/api/autow/receipt/delete/route.ts`
- `app/api/autow/document-number/preview/route.ts`

## Routes NOT Updated (No Database Access)
- `app/api/autow/jotter/parse/route.ts` - Text parsing only
- `app/api/autow/jotter/recognize/route.ts` - OpenAI Vision API only
- `app/api/autow/receipt/parse/route.ts` - OpenAI Vision API only
- `app/api/autow/auth/login/route.ts` - Environment variable check only

## Technical Notes
- Routes use `withTenantSchema()` for schema-scoped queries
- Note→Booking conversion flow preserved within tenant schema
- Receipt operations work with tenant schemas
- Document number generation uses tenant schema functions
- No database schema modifications

## Next
Execute `04-05-PLAN.md` to update frontend pages with tenant header integration.
