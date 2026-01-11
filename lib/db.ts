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

export default pool;
