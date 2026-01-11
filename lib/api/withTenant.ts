// Tenant API Helper - Wraps API route handlers with tenant context extraction

import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest } from '@/lib/tenant/context';
import { TenantContext } from '@/lib/tenant/types';

/**
 * Wraps an API route handler with automatic tenant context extraction.
 *
 * Usage:
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   return withTenant(request, async (tenant, req) => {
 *     const data = await tenantQuery(tenant, 'SELECT * FROM bookings');
 *     return NextResponse.json({ success: true, data });
 *   });
 * }
 * ```
 *
 * The tenant is extracted from:
 * 1. X-Tenant-Slug header
 * 2. Subdomain (tenant.domain.com)
 *
 * Returns 400 error if tenant cannot be identified.
 */
export async function withTenant(
  request: NextRequest,
  handler: (tenant: TenantContext, request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const tenant = await getTenantFromRequest(request);

  if (!tenant) {
    return NextResponse.json(
      { error: 'Tenant not found. Include X-Tenant-Slug header.' },
      { status: 400 }
    );
  }

  return handler(tenant, request);
}

/**
 * Variant that also extracts URL params (for dynamic routes)
 */
export async function withTenantParams(
  request: NextRequest,
  params: { tenant?: string },
  handler: (tenant: TenantContext, request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const tenant = await getTenantFromRequest(request, params);

  if (!tenant) {
    return NextResponse.json(
      { error: 'Tenant not found. Include X-Tenant-Slug header or use tenant URL.' },
      { status: 400 }
    );
  }

  return handler(tenant, request);
}
