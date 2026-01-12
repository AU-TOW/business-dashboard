// Tenant Provisioning - Creates new tenant schemas

import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { CreateTenantInput, TRADE_DEFAULTS, TIER_LIMITS, Tenant } from './types';

// Inline tenant schema template (required for Vercel serverless - no filesystem access)
const TENANT_SCHEMA_TEMPLATE = `
-- Tenant Schema Template
-- Variables to replace: {{SCHEMA_NAME}}

-- ============================================
-- CREATE SCHEMA
-- ============================================
CREATE SCHEMA IF NOT EXISTS {{SCHEMA_NAME}};

-- ============================================
-- HELPER FUNCTIONS (in tenant schema)
-- ============================================

CREATE OR REPLACE FUNCTION {{SCHEMA_NAME}}.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS {{SCHEMA_NAME}}.bookings (
    id SERIAL PRIMARY KEY,
    booked_by VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_reg VARCHAR(20),
    location_address TEXT NOT NULL,
    location_postcode VARCHAR(20) NOT NULL,
    issue_description TEXT NOT NULL,
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    estimated_duration INTEGER NOT NULL DEFAULT 90,
    calendar_event_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON {{SCHEMA_NAME}}.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON {{SCHEMA_NAME}}.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_reg ON {{SCHEMA_NAME}}.bookings(vehicle_reg);

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON {{SCHEMA_NAME}}.bookings
    FOR EACH ROW
    EXECUTE FUNCTION {{SCHEMA_NAME}}.update_updated_at_column();

-- ============================================
-- ESTIMATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS {{SCHEMA_NAME}}.estimates (
    id SERIAL PRIMARY KEY,
    estimate_number VARCHAR(50) UNIQUE NOT NULL,
    estimate_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_address TEXT,
    client_phone VARCHAR(20),
    client_mobile VARCHAR(20),
    client_fax VARCHAR(20),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_reg VARCHAR(20),
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    vat_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
    vat_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    signature_data TEXT,
    booking_id INTEGER REFERENCES {{SCHEMA_NAME}}.bookings(id) ON DELETE SET NULL,
    invoice_id INTEGER,
    share_token VARCHAR(64) UNIQUE,
    share_token_created_at TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    accepted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_estimates_number ON {{SCHEMA_NAME}}.estimates(estimate_number);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON {{SCHEMA_NAME}}.estimates(status);
CREATE INDEX IF NOT EXISTS idx_estimates_share_token ON {{SCHEMA_NAME}}.estimates(share_token);

CREATE TRIGGER update_estimates_updated_at
    BEFORE UPDATE ON {{SCHEMA_NAME}}.estimates
    FOR EACH ROW
    EXECUTE FUNCTION {{SCHEMA_NAME}}.update_updated_at_column();

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS {{SCHEMA_NAME}}.invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_address TEXT,
    client_phone VARCHAR(20),
    client_mobile VARCHAR(20),
    client_fax VARCHAR(20),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_reg VARCHAR(20),
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    vat_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
    vat_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    balance_due DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(50),
    payment_date DATE,
    payment_reference VARCHAR(100),
    notes TEXT,
    signature_data TEXT,
    estimate_id INTEGER REFERENCES {{SCHEMA_NAME}}.estimates(id) ON DELETE SET NULL,
    booking_id INTEGER REFERENCES {{SCHEMA_NAME}}.bookings(id) ON DELETE SET NULL,
    share_token VARCHAR(64) UNIQUE,
    share_token_created_at TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    paid_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_number ON {{SCHEMA_NAME}}.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON {{SCHEMA_NAME}}.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_share_token ON {{SCHEMA_NAME}}.invoices(share_token);

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON {{SCHEMA_NAME}}.invoices
    FOR EACH ROW
    EXECUTE FUNCTION {{SCHEMA_NAME}}.update_updated_at_column();

-- ============================================
-- LINE ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS {{SCHEMA_NAME}}.line_items (
    id SERIAL PRIMARY KEY,
    document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('estimate', 'invoice')),
    document_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    item_type VARCHAR(50) NOT NULL DEFAULT 'service',
    rate DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1.00,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_line_items_document ON {{SCHEMA_NAME}}.line_items(document_type, document_id);

CREATE TRIGGER update_line_items_updated_at
    BEFORE UPDATE ON {{SCHEMA_NAME}}.line_items
    FOR EACH ROW
    EXECUTE FUNCTION {{SCHEMA_NAME}}.update_updated_at_column();

-- Auto-calculate line item amount
CREATE OR REPLACE FUNCTION {{SCHEMA_NAME}}.calculate_line_item_amount()
RETURNS TRIGGER AS $$
BEGIN
    NEW.amount := NEW.rate * NEW.quantity;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_line_item_amount_trigger
    BEFORE INSERT OR UPDATE ON {{SCHEMA_NAME}}.line_items
    FOR EACH ROW
    EXECUTE FUNCTION {{SCHEMA_NAME}}.calculate_line_item_amount();

-- ============================================
-- RECEIPTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS {{SCHEMA_NAME}}.receipts (
    id SERIAL PRIMARY KEY,
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
    supplier VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    storage_file_id VARCHAR(255),
    storage_file_url VARCHAR(500),
    storage_folder_path VARCHAR(255),
    original_filename VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_by VARCHAR(255) NOT NULL DEFAULT 'Staff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_receipts_date ON {{SCHEMA_NAME}}.receipts(receipt_date DESC);
CREATE INDEX IF NOT EXISTS idx_receipts_supplier ON {{SCHEMA_NAME}}.receipts(supplier);

CREATE TRIGGER update_receipts_updated_at
    BEFORE UPDATE ON {{SCHEMA_NAME}}.receipts
    FOR EACH ROW
    EXECUTE FUNCTION {{SCHEMA_NAME}}.update_updated_at_column();

-- ============================================
-- NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS {{SCHEMA_NAME}}.notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    is_pinned BOOLEAN DEFAULT false,
    booking_id INTEGER REFERENCES {{SCHEMA_NAME}}.bookings(id) ON DELETE SET NULL,
    created_by VARCHAR(255) NOT NULL DEFAULT 'Staff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notes_category ON {{SCHEMA_NAME}}.notes(category);
CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON {{SCHEMA_NAME}}.notes(is_pinned);

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON {{SCHEMA_NAME}}.notes
    FOR EACH ROW
    EXECUTE FUNCTION {{SCHEMA_NAME}}.update_updated_at_column();

-- ============================================
-- JOTTER NOTES TABLE (Smart Jotter)
-- ============================================
CREATE TABLE IF NOT EXISTS {{SCHEMA_NAME}}.jotter_notes (
    id SERIAL PRIMARY KEY,
    note_number VARCHAR(20) UNIQUE NOT NULL,
    note_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'converted')),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_reg VARCHAR(20),
    vehicle_year VARCHAR(10),
    issue_description TEXT,
    notes TEXT,
    raw_input TEXT,
    confidence_score DECIMAL(5,4),
    booking_id INTEGER REFERENCES {{SCHEMA_NAME}}.bookings(id) ON DELETE SET NULL,
    estimate_id INTEGER REFERENCES {{SCHEMA_NAME}}.estimates(id) ON DELETE SET NULL,
    created_by VARCHAR(100) NOT NULL DEFAULT 'Staff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    converted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_jotter_notes_status ON {{SCHEMA_NAME}}.jotter_notes(status);
CREATE INDEX IF NOT EXISTS idx_jotter_notes_date ON {{SCHEMA_NAME}}.jotter_notes(note_date DESC);

CREATE TRIGGER update_jotter_notes_updated_at
    BEFORE UPDATE ON {{SCHEMA_NAME}}.jotter_notes
    FOR EACH ROW
    EXECUTE FUNCTION {{SCHEMA_NAME}}.update_updated_at_column();

-- ============================================
-- DAMAGE ASSESSMENTS TABLE (Car Mechanic only)
-- ============================================
CREATE TABLE IF NOT EXISTS {{SCHEMA_NAME}}.damage_assessments (
    id SERIAL PRIMARY KEY,
    assessment_number VARCHAR(50) UNIQUE NOT NULL,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(20),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_reg VARCHAR(20) NOT NULL,
    vehicle_year VARCHAR(10),
    vehicle_color VARCHAR(50),
    mileage INTEGER,
    damage_description TEXT,
    damage_locations JSONB,
    photos JSONB,
    notes TEXT,
    share_token VARCHAR(64) UNIQUE,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_damage_assessments_vehicle_reg ON {{SCHEMA_NAME}}.damage_assessments(vehicle_reg);
CREATE INDEX IF NOT EXISTS idx_damage_assessments_share_token ON {{SCHEMA_NAME}}.damage_assessments(share_token);

CREATE TRIGGER update_damage_assessments_updated_at
    BEFORE UPDATE ON {{SCHEMA_NAME}}.damage_assessments
    FOR EACH ROW
    EXECUTE FUNCTION {{SCHEMA_NAME}}.update_updated_at_column();

-- ============================================
-- BUSINESS SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS {{SCHEMA_NAME}}.business_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    default_estimate_notes TEXT,
    default_invoice_notes TEXT,
    default_vat_rate DECIMAL(5, 2) DEFAULT 20.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings row
INSERT INTO {{SCHEMA_NAME}}.business_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DOCUMENT NUMBER GENERATORS
-- ============================================

CREATE OR REPLACE FUNCTION {{SCHEMA_NAME}}.generate_estimate_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(estimate_number FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM {{SCHEMA_NAME}}.estimates
    WHERE estimate_number ~ '^EST[0-9]+$';

    RETURN 'EST' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION {{SCHEMA_NAME}}.generate_invoice_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM {{SCHEMA_NAME}}.invoices
    WHERE invoice_number ~ '^INV[0-9]+$';

    RETURN 'INV' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION {{SCHEMA_NAME}}.generate_receipt_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    today_str VARCHAR(8);
    seq_num INTEGER;
BEGIN
    today_str := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');

    SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM 14 FOR 3) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM {{SCHEMA_NAME}}.receipts
    WHERE receipt_number LIKE 'REC-' || today_str || '-%';

    RETURN 'REC-' || today_str || '-' || LPAD(seq_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Note: Permissions are handled by Supabase RLS policies
-- GRANT statements removed as they cause issues with connection pooler
`;

// Lazy pool initialization (required for Vercel serverless)
let pool: Pool | null = null;

/**
 * Convert Supabase pooler URL to direct connection URL
 * Pooler can have issues with DDL operations, direct connection is more reliable
 *
 * From: postgresql://postgres.PROJECT_REF:PASSWORD@*.pooler.supabase.com:PORT/postgres
 * To:   postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
 */
function toDirectConnection(url: string): string {
  // Check if this is a Supabase pooler URL
  if (!url.includes('.pooler.supabase.com')) {
    // Already direct or non-Supabase, just ensure port 5432
    return url.replace(':6543/', ':5432/');
  }

  try {
    const parsed = new URL(url);

    // Extract project ref from username (format: postgres.PROJECT_REF)
    const username = parsed.username;
    const projectRef = username.includes('.') ? username.split('.')[1] : null;

    if (!projectRef) {
      console.warn('Could not extract project ref from username, using pooler URL');
      return url.replace(':6543/', ':5432/');
    }

    // Build direct connection URL
    const directUrl = `postgresql://postgres:${parsed.password}@db.${projectRef}.supabase.co:5432${parsed.pathname}`;
    return directUrl;
  } catch (e) {
    console.warn('Failed to parse DATABASE_URL, using as-is:', e);
    return url.replace(':6543/', ':5432/');
  }
}

function getPool(): Pool {
  if (!pool) {
    const dbUrl = process.env.DATABASE_URL || '';

    // Use direct connection for DDL operations (bypasses pooler which can cause issues)
    const directUrl = toDirectConnection(dbUrl);

    // Log connection info (mask password)
    const maskedUrl = directUrl.replace(/:[^:@]+@/, ':***@');
    console.log('Initializing DB pool (direct):', maskedUrl);

    pool = new Pool({
      connectionString: directUrl,
      ssl: { rejectUnauthorized: false }, // Required for Supabase
      max: 1, // Single connection for schema operations
    });
  }
  return pool;
}

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
  const result = await getPool().query(
    'SELECT id FROM public.tenants WHERE slug = $1',
    [slug]
  );
  return result.rows.length === 0;
}

/**
 * Create a new tenant with their own schema
 */
export async function createTenant(input: CreateTenantInput): Promise<Tenant> {
  const client = await getPool().connect();

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
 * Split SQL into statements, respecting $$ quoted function bodies
 * Also strips leading comment-only lines from each statement
 */
function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inDollarQuote = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];

    // Check for $$ delimiter
    if (char === '$' && nextChar === '$') {
      inDollarQuote = !inDollarQuote;
      current += '$$';
      i++; // Skip next $
      continue;
    }

    // Only split on semicolon if not inside $$ block
    if (char === ';' && !inDollarQuote) {
      const statement = extractStatement(current);
      if (statement) {
        statements.push(statement);
      }
      current = '';
      continue;
    }

    current += char;
  }

  // Add final statement if any
  const statement = extractStatement(current);
  if (statement) {
    statements.push(statement);
  }

  return statements;
}

/**
 * Extract actual SQL statement from a block that may have leading comments
 * Returns the statement without leading comment-only lines, or null if only comments
 */
function extractStatement(block: string): string | null {
  // Split into lines and find the first non-comment, non-empty line
  const lines = block.split('\n');
  let foundSqlStart = false;
  const resultLines: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines and pure comment lines until we find SQL
    if (!foundSqlStart) {
      if (trimmedLine === '' || trimmedLine.startsWith('--')) {
        continue;
      }
      foundSqlStart = true;
    }

    resultLines.push(line);
  }

  const result = resultLines.join('\n').trim();
  return result.length > 0 ? result : null;
}

/**
 * Provision a tenant schema with all required tables
 */
async function provisionTenantSchema(client: PoolClient, schemaName: string): Promise<void> {
  // Use inline template (filesystem access not available on Vercel serverless)
  let template = TENANT_SCHEMA_TEMPLATE;

  // Replace all instances of {{SCHEMA_NAME}} with actual schema name
  template = template.replace(/\{\{SCHEMA_NAME\}\}/g, schemaName);

  // Execute the schema creation SQL
  // Use smart splitting that respects $$ quoted function bodies
  const statements = splitSqlStatements(template);

  console.log(`Provisioning schema ${schemaName} with ${statements.length} statements`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    try {
      // Log progress for first few statements
      if (i < 5) {
        console.log(`Executing statement ${i + 1}: ${statement.substring(0, 60)}...`);
      }
      await client.query(statement);

      // Verify schema exists after CREATE SCHEMA
      if (i === 0) {
        const schemaCheck = await client.query(
          "SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1",
          [schemaName]
        );
        console.log(`Schema check after CREATE: ${schemaCheck.rows.length > 0 ? 'EXISTS' : 'NOT FOUND'}`);
      }
    } catch (error: any) {
      // Ignore "already exists" errors for idempotency
      const isIgnorable =
        error.message?.includes('already exists') ||
        error.message?.includes('does not exist') && statement.toUpperCase().includes('GRANT');

      if (!isIgnorable) {
        console.error(`Error at statement ${i + 1}:`, statement.substring(0, 100));
        console.error('Error details:', error.message);
        throw error;
      } else {
        console.log('Ignoring error for statement:', statement.substring(0, 50) + '...');
      }
    }
  }

  console.log(`Provisioned tenant schema: ${schemaName}`);
}

/**
 * Delete a tenant and their schema (use with caution!)
 */
export async function deleteTenant(tenantId: string): Promise<void> {
  const client = await getPool().connect();

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
  const result = await getPool().query(
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
  const result = await getPool().query(
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
  const result = await getPool().query(
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
  const result = await getPool().query(
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
