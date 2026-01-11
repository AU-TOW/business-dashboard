# 04-03 Summary: Invoice Routes Tenant Context

## Completed

### Task 1: Update invoice CRUD and status routes
Updated 7 routes to use tenant context:

| Route | Change |
|-------|--------|
| `invoice/list` | `pool.query()` → `withTenantSchema()` |
| `invoice/get` | `pool.query()` → `withTenantSchema()` |
| `invoice/create` | `pool.connect()` → `withTenantSchema()` with BEGIN/COMMIT |
| `invoice/update` | `pool.connect()` → `withTenantSchema()` with BEGIN/COMMIT |
| `invoice/delete` | `pool.connect()` → `withTenantSchema()` with BEGIN/COMMIT |
| `invoice/mark-as-paid` | `pool.query()` → `withTenantSchema()` |
| `invoice/generate-share-link` | `pool.connect()` → `withTenantSchema()` |

### Task 2: Update invoice expense routes
Updated 3 routes to use tenant context:

| Route | Change |
|-------|--------|
| `invoice/expense/list` | `pool.query()` → `withTenantSchema()` |
| `invoice/expense/create` | `pool.query()` → `withTenantSchema()` |
| `invoice/expense/delete` | `pool.query()` → `withTenantSchema()` |

Note: `invoice/expense/parse` not updated - it only calls OpenAI and doesn't interact with the database.

## Verification
- ✅ `npm run build` succeeds
- ✅ No invoice routes import `pool` from `@/lib/db`
- ✅ All 10 invoice routes (7 CRUD/status + 3 expense) use tenant context
- ✅ Added `export const dynamic = 'force-dynamic'` to GET routes

## Files Changed
- `app/api/autow/invoice/list/route.ts`
- `app/api/autow/invoice/get/route.ts`
- `app/api/autow/invoice/create/route.ts`
- `app/api/autow/invoice/update/route.ts`
- `app/api/autow/invoice/delete/route.ts`
- `app/api/autow/invoice/mark-as-paid/route.ts`
- `app/api/autow/invoice/generate-share-link/route.ts`
- `app/api/autow/invoice/expense/list/route.ts`
- `app/api/autow/invoice/expense/create/route.ts`
- `app/api/autow/invoice/expense/delete/route.ts`

## Technical Notes
- Routes use `withTenantSchema()` for schema-scoped queries
- Transaction handling (BEGIN/COMMIT/ROLLBACK) preserved
- Expense tracking routes work with tenant schemas
- Mark-as-paid updates status correctly in tenant schema
- No database schema modifications

## Next
Execute `04-04-PLAN.md` to update notes, jotter, receipts, and share routes.
