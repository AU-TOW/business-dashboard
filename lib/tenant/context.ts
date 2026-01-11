// Tenant Context - Middleware for tenant-scoped database operations

import { Pool, PoolClient } from 'pg';
import { TenantContext, Tenant } from './types';
import { getTenantBySlug } from './provisioning';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined
});

/**
 * Convert Tenant to TenantContext (subset of fields needed for runtime)
 */
export function tenantToContext(tenant: Tenant): TenantContext {
  return {
    id: tenant.id,
    slug: tenant.slug,
    schemaName: tenant.schemaName,
    businessName: tenant.businessName,
    tradeType: tenant.tradeType,
    subscriptionTier: tenant.subscriptionTier,
    subscriptionStatus: tenant.subscriptionStatus,
    partsLabel: tenant.partsLabel,
    showVehicleFields: tenant.showVehicleFields,
    primaryColor: tenant.primaryColor,
    logoUrl: tenant.logoUrl,
    maxBookingsPerMonth: tenant.maxBookingsPerMonth,
    maxTelegramBots: tenant.maxTelegramBots,
    maxUsers: tenant.maxUsers,
  };
}

/**
 * Get tenant context from request
 * Supports multiple identification methods:
 * 1. URL path parameter (/app/[tenant]/...)
 * 2. Header (X-Tenant-Slug)
 * 3. Subdomain (tenant.domain.com)
 */
export async function getTenantFromRequest(
  request: Request,
  params?: { tenant?: string }
): Promise<TenantContext | null> {
  let slug: string | null = null;

  // 1. Check URL path parameter (most common)
  if (params?.tenant) {
    slug = params.tenant;
  }

  // 2. Check header (for API calls)
  if (!slug) {
    slug = request.headers.get('X-Tenant-Slug');
  }

  // 3. Check subdomain
  if (!slug) {
    const host = request.headers.get('host');
    if (host) {
      const subdomain = extractSubdomain(host);
      if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
        slug = subdomain;
      }
    }
  }

  if (!slug) {
    return null;
  }

  // Look up tenant by slug
  const tenant = await getTenantBySlug(slug);
  if (!tenant) {
    return null;
  }

  // Check subscription status
  if (tenant.subscriptionStatus === 'cancelled') {
    console.warn(`Tenant ${slug} has cancelled subscription`);
    // You might want to handle this differently (redirect to reactivation page, etc.)
  }

  return tenantToContext(tenant);
}

/**
 * Extract subdomain from host
 */
function extractSubdomain(host: string): string | null {
  // Remove port if present
  const hostname = host.split(':')[0];

  // Handle localhost (no subdomain)
  if (hostname === 'localhost') {
    return null;
  }

  // Split by dots
  const parts = hostname.split('.');

  // Need at least 3 parts for a subdomain (sub.domain.tld)
  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
}

/**
 * Execute a query within a tenant's schema context
 */
export async function withTenantSchema<T>(
  tenantContext: TenantContext,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();

  try {
    // Set the search_path to the tenant's schema
    await client.query(`SET search_path TO ${tenantContext.schemaName}, public`);

    // Execute the callback
    const result = await callback(client);

    return result;
  } finally {
    // Reset search_path before releasing
    await client.query('SET search_path TO public');
    client.release();
  }
}

/**
 * Execute a simple query in tenant schema
 */
export async function tenantQuery<T = any>(
  tenantContext: TenantContext,
  sql: string,
  params?: any[]
): Promise<T[]> {
  return withTenantSchema(tenantContext, async (client) => {
    const result = await client.query(sql, params);
    return result.rows as T[];
  });
}

/**
 * Execute a single-result query in tenant schema
 */
export async function tenantQueryOne<T = any>(
  tenantContext: TenantContext,
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await tenantQuery<T>(tenantContext, sql, params);
  return rows[0] || null;
}

/**
 * Execute an insert/update/delete in tenant schema
 */
export async function tenantMutate(
  tenantContext: TenantContext,
  sql: string,
  params?: any[]
): Promise<{ rowCount: number; rows: any[] }> {
  return withTenantSchema(tenantContext, async (client) => {
    const result = await client.query(sql, params);
    return { rowCount: result.rowCount || 0, rows: result.rows };
  });
}

/**
 * Check if a feature is available for the tenant's subscription tier
 */
export function hasFeature(
  tenantContext: TenantContext,
  feature: 'unlimited_bookings' | 'receipts' | 'smart_jotter' | 'damage_assessments' | 'custom_domain' | 'api_access'
): boolean {
  const tier = tenantContext.subscriptionTier;

  switch (feature) {
    case 'unlimited_bookings':
      return tier !== 'trial' && tier !== 'starter';

    case 'receipts':
      return tier === 'business' || tier === 'enterprise';

    case 'smart_jotter':
      // Available to all tiers
      return true;

    case 'damage_assessments':
      // Only for car mechanics, any tier
      return tenantContext.tradeType === 'car_mechanic';

    case 'custom_domain':
      return tier === 'enterprise';

    case 'api_access':
      return tier === 'enterprise';

    default:
      return false;
  }
}

/**
 * Check if tenant has reached booking limit
 */
export async function hasReachedBookingLimit(tenantContext: TenantContext): Promise<boolean> {
  if (tenantContext.maxBookingsPerMonth === -1) {
    return false; // Unlimited
  }

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const rows = await tenantQuery<{ count: string }>(
    tenantContext,
    `SELECT COUNT(*) as count FROM bookings
     WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`
  );

  const count = parseInt(rows[0]?.count || '0', 10);
  return count >= tenantContext.maxBookingsPerMonth;
}
