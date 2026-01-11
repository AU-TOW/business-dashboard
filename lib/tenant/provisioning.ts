// Tenant Provisioning - Creates new tenant schemas

import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { CreateTenantInput, TRADE_DEFAULTS, TIER_LIMITS, Tenant } from './types';

// Read the tenant schema template
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined
});

/**
 * Generate a schema-safe name from tenant slug
 */
function generateSchemaName(slug: string): string {
  // Prefix with 'tenant_' and replace any non-alphanumeric chars with underscore
  const safeName = slug.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `tenant_${safeName}`;
}

/**
 * Generate a URL-safe slug from business name
 */
export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .substring(0, 50);              // Limit length
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT id FROM public.tenants WHERE slug = $1',
    [slug]
  );
  return result.rows.length === 0;
}

/**
 * Create a new tenant with their own schema
 */
export async function createTenant(input: CreateTenantInput): Promise<Tenant> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Generate schema name
    const schemaName = generateSchemaName(input.slug);

    // Get trade defaults
    const tradeDefaults = TRADE_DEFAULTS[input.tradeType];
    const tierLimits = TIER_LIMITS.trial;

    // Calculate trial end date (7 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    // Insert tenant record
    const tenantResult = await client.query(
      `INSERT INTO public.tenants (
        slug, business_name, trade_type, email, phone,
        subscription_tier, trial_ends_at, subscription_status,
        max_bookings_per_month, max_telegram_bots, max_users,
        parts_label, show_vehicle_fields, schema_name, primary_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        input.slug,
        input.businessName,
        input.tradeType,
        input.email,
        input.phone || null,
        'trial',
        trialEndsAt,
        'active',
        tierLimits.bookings,
        tierLimits.bots,
        tierLimits.users,
        tradeDefaults.partsLabel,
        tradeDefaults.showVehicleFields,
        schemaName,
        '#3B82F6' // Light blue default
      ]
    );

    const tenant = tenantResult.rows[0];

    // Create the tenant schema with all tables
    await provisionTenantSchema(client, schemaName);

    await client.query('COMMIT');

    // Return the created tenant
    return {
      id: tenant.id,
      slug: tenant.slug,
      businessName: tenant.business_name,
      tradeType: tenant.trade_type,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      postcode: tenant.postcode,
      logoUrl: tenant.logo_url,
      primaryColor: tenant.primary_color,
      subscriptionTier: tenant.subscription_tier,
      trialEndsAt: tenant.trial_ends_at,
      subscriptionStatus: tenant.subscription_status,
      stripeCustomerId: tenant.stripe_customer_id,
      stripeSubscriptionId: tenant.stripe_subscription_id,
      maxBookingsPerMonth: tenant.max_bookings_per_month,
      maxTelegramBots: tenant.max_telegram_bots,
      maxUsers: tenant.max_users,
      partsLabel: tenant.parts_label,
      showVehicleFields: tenant.show_vehicle_fields,
      schemaName: tenant.schema_name,
      createdAt: tenant.created_at,
      updatedAt: tenant.updated_at,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tenant:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Provision a tenant schema with all required tables
 */
async function provisionTenantSchema(client: PoolClient, schemaName: string): Promise<void> {
  // Read the template file
  const templatePath = path.join(process.cwd(), 'database', 'tenant-schema-template.sql');
  let template = fs.readFileSync(templatePath, 'utf8');

  // Replace all instances of {{SCHEMA_NAME}} with actual schema name
  template = template.replace(/\{\{SCHEMA_NAME\}\}/g, schemaName);

  // Execute the schema creation SQL
  // Split by semicolon and execute each statement
  const statements = template
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await client.query(statement);
    } catch (error: any) {
      // Ignore "already exists" errors for idempotency
      if (!error.message?.includes('already exists')) {
        console.error('Error executing statement:', statement.substring(0, 100));
        throw error;
      }
    }
  }

  console.log(`Provisioned tenant schema: ${schemaName}`);
}

/**
 * Delete a tenant and their schema (use with caution!)
 */
export async function deleteTenant(tenantId: string): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get the schema name first
    const result = await client.query(
      'SELECT schema_name FROM public.tenants WHERE id = $1',
      [tenantId]
    );

    if (result.rows.length === 0) {
      throw new Error('Tenant not found');
    }

    const schemaName = result.rows[0].schema_name;

    // Drop the schema and all its contents
    await client.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);

    // Delete the tenant record
    await client.query('DELETE FROM public.tenants WHERE id = $1', [tenantId]);

    await client.query('COMMIT');

    console.log(`Deleted tenant ${tenantId} and schema ${schemaName}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get tenant by ID
 */
export async function getTenantById(id: string): Promise<Tenant | null> {
  const result = await pool.query(
    'SELECT * FROM public.tenants WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return mapRowToTenant(row);
}

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const result = await pool.query(
    'SELECT * FROM public.tenants WHERE slug = $1',
    [slug]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapRowToTenant(result.rows[0]);
}

/**
 * Get tenant by owner's Supabase user ID
 */
export async function getTenantByUserId(userId: string): Promise<Tenant | null> {
  const result = await pool.query(
    'SELECT * FROM public.tenants WHERE owner_user_id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapRowToTenant(result.rows[0]);
}

/**
 * Link a Supabase user to a tenant
 */
export async function linkUserToTenant(userId: string, tenantSlug: string): Promise<boolean> {
  const result = await pool.query(
    `UPDATE public.tenants
     SET owner_user_id = $1, updated_at = NOW()
     WHERE slug = $2 AND owner_user_id IS NULL
     RETURNING id`,
    [userId, tenantSlug]
  );

  return result.rows.length > 0;
}

/**
 * Map database row to Tenant object
 */
function mapRowToTenant(row: any): Tenant {
  return {
    id: row.id,
    slug: row.slug,
    businessName: row.business_name,
    tradeType: row.trade_type,
    email: row.email,
    phone: row.phone,
    address: row.address,
    postcode: row.postcode,
    logoUrl: row.logo_url,
    primaryColor: row.primary_color,
    subscriptionTier: row.subscription_tier,
    trialEndsAt: row.trial_ends_at,
    subscriptionStatus: row.subscription_status,
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    maxBookingsPerMonth: row.max_bookings_per_month,
    maxTelegramBots: row.max_telegram_bots,
    maxUsers: row.max_users,
    partsLabel: row.parts_label,
    showVehicleFields: row.show_vehicle_fields,
    schemaName: row.schema_name,
    ownerUserId: row.owner_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
