import { Pool, PoolClient } from 'pg';
import { TenantContext } from './tenant/types';

// Supabase requires SSL but with self-signed certificates
const sslConfig = process.env.DATABASE_URL?.includes('supabase') || process.env.DATABASE_URL?.includes('pooler')
  ? { rejectUnauthorized: false }
  : undefined;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

/**
 * Execute a query in the public schema (non-tenant queries)
 */
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Get a database client
 */
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

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
 * Execute an insert/update/delete in tenant schema, returning affected rows
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

// ============================================
// MAGIC TOKEN QUERIES
// ============================================

/**
 * Generate a secure random token
 */
function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${token}_${Date.now().toString(36)}`;
}

/**
 * Ensure magic_tokens table exists
 */
async function ensureMagicTokensTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.magic_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      token VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) NOT NULL,
      tenant_slug VARCHAR(100),
      business_name VARCHAR(255),
      type VARCHAR(50) NOT NULL DEFAULT 'verification',
      used BOOLEAN DEFAULT false,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_magic_tokens_token ON public.magic_tokens(token)
  `);
}

/**
 * Create a verification token for new signup
 */
export async function createVerificationToken(
  email: string,
  tenantSlug: string,
  businessName: string
): Promise<string> {
  const token = generateToken();

  await ensureMagicTokensTable();

  await pool.query(
    `INSERT INTO public.magic_tokens (token, email, tenant_slug, business_name, type, expires_at)
     VALUES ($1, $2, $3, $4, 'verification', NOW() + INTERVAL '24 hours')`,
    [token, email, tenantSlug, businessName]
  );

  return token;
}

/**
 * Create a login magic link token
 */
export async function createMagicLinkToken(
  email: string,
  tenantSlug: string,
  businessName: string
): Promise<string> {
  const token = generateToken();

  await ensureMagicTokensTable();

  await pool.query(
    `INSERT INTO public.magic_tokens (token, email, tenant_slug, business_name, type, expires_at)
     VALUES ($1, $2, $3, $4, 'login', NOW() + INTERVAL '1 hour')`,
    [token, email, tenantSlug, businessName]
  );

  return token;
}

/**
 * Verify and consume a token
 */
export async function verifyToken(token: string): Promise<{
  success: boolean;
  email?: string;
  tenantSlug?: string;
  businessName?: string;
  type?: string;
  error?: string;
}> {
  const result = await pool.query(
    `SELECT token, email, tenant_slug, business_name, type, used, expires_at
     FROM public.magic_tokens
     WHERE token = $1`,
    [token]
  );

  if (result.rows.length === 0) {
    return { success: false, error: 'Invalid token' };
  }

  const row = result.rows[0];

  if (row.used) {
    return { success: false, error: 'Token has already been used' };
  }

  if (new Date(row.expires_at) < new Date()) {
    return { success: false, error: 'Token has expired' };
  }

  // Mark token as used
  await pool.query(
    `UPDATE public.magic_tokens SET used = true WHERE token = $1`,
    [token]
  );

  return {
    success: true,
    email: row.email,
    tenantSlug: row.tenant_slug,
    businessName: row.business_name,
    type: row.type,
  };
}

/**
 * Get tenant by email
 */
export async function getTenantByEmail(email: string): Promise<{
  id: string;
  slug: string;
  businessName: string;
  email: string;
} | null> {
  const result = await pool.query(
    `SELECT id, slug, business_name, email
     FROM public.tenants
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    slug: row.slug,
    businessName: row.business_name,
    email: row.email,
  };
}

/**
 * Ensure email_verified column exists in tenants table
 */
async function ensureEmailVerifiedColumn(): Promise<void> {
  await pool.query(`
    ALTER TABLE public.tenants
    ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false
  `);
}

/**
 * Mark tenant email as verified
 */
export async function markTenantEmailVerified(tenantSlug: string): Promise<boolean> {
  await ensureEmailVerifiedColumn();

  const result = await pool.query(
    `UPDATE public.tenants
     SET email_verified = true, updated_at = NOW()
     WHERE slug = $1
     RETURNING id`,
    [tenantSlug]
  );

  return result.rows.length > 0;
}

export default pool;
