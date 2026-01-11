/**
 * Migration Script: Migrate Existing Data to Multi-Tenant Structure
 *
 * This script performs a one-time migration to convert the existing single-tenant
 * data to the new multi-tenant schema-per-tenant architecture.
 *
 * Steps:
 * 1. Create the master tenants table in public schema (if not exists)
 * 2. Create a default tenant record (autow)
 * 3. Create the tenant schema with all tables
 * 4. Move existing data from public schema to tenant schema
 * 5. Verify data integrity
 *
 * Usage: npx ts-node scripts/migrate-to-multi-tenant.ts
 *
 * IMPORTANT: This script should be run ONCE during initial migration.
 * It is safe to re-run (idempotent) but should not be necessary.
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined
});

// Default tenant configuration (AUTOW)
const DEFAULT_TENANT = {
  slug: 'autow',
  businessName: 'AUTOW Services',
  tradeType: 'car_mechanic',
  email: 'info@autow-services.co.uk',
  phone: '',
  primaryColor: '#30ff37',
  logoUrl: 'https://autow-services.co.uk/logo.png',
  partsLabel: 'Parts',
  showVehicleFields: true,
};

async function main() {
  console.log('='.repeat(60));
  console.log('Multi-Tenant Migration Script');
  console.log('='.repeat(60));
  console.log();

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Run the tenants table migration
    console.log('Step 1: Checking/creating tenants table...');
    const tenantsMigration = fs.readFileSync(
      path.join(process.cwd(), 'database', 'migrations', '001_create_tenants.sql'),
      'utf8'
    );
    await client.query(tenantsMigration);
    console.log('  ✓ Tenants table ready');

    // Step 2: Check if default tenant already exists
    console.log('Step 2: Creating default tenant...');
    const existingTenant = await client.query(
      'SELECT id FROM public.tenants WHERE slug = $1',
      [DEFAULT_TENANT.slug]
    );

    let tenantId: string;
    let schemaName: string;

    if (existingTenant.rows.length > 0) {
      console.log('  ℹ Default tenant already exists, skipping creation');
      tenantId = existingTenant.rows[0].id;
      const schemaResult = await client.query(
        'SELECT schema_name FROM public.tenants WHERE id = $1',
        [tenantId]
      );
      schemaName = schemaResult.rows[0].schema_name;
    } else {
      schemaName = `tenant_${DEFAULT_TENANT.slug}`;
      const tenantResult = await client.query(
        `INSERT INTO public.tenants (
          slug, business_name, trade_type, email, phone,
          subscription_tier, subscription_status,
          max_bookings_per_month, max_telegram_bots, max_users,
          parts_label, show_vehicle_fields, schema_name,
          primary_color, logo_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id`,
        [
          DEFAULT_TENANT.slug,
          DEFAULT_TENANT.businessName,
          DEFAULT_TENANT.tradeType,
          DEFAULT_TENANT.email,
          DEFAULT_TENANT.phone,
          'enterprise', // Give the legacy tenant enterprise tier
          'active',
          -1, // Unlimited bookings
          5,  // 5 bots
          10, // 10 users
          DEFAULT_TENANT.partsLabel,
          DEFAULT_TENANT.showVehicleFields,
          schemaName,
          DEFAULT_TENANT.primaryColor,
          DEFAULT_TENANT.logoUrl
        ]
      );
      tenantId = tenantResult.rows[0].id;
      console.log(`  ✓ Created tenant: ${DEFAULT_TENANT.slug} (${tenantId})`);
    }

    // Step 3: Create tenant schema
    console.log('Step 3: Creating tenant schema...');
    const schemaExists = await client.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      [schemaName]
    );

    if (schemaExists.rows.length > 0) {
      console.log(`  ℹ Schema ${schemaName} already exists`);
    } else {
      // Read and apply the tenant schema template
      let template = fs.readFileSync(
        path.join(process.cwd(), 'database', 'tenant-schema-template.sql'),
        'utf8'
      );
      template = template.replace(/\{\{SCHEMA_NAME\}\}/g, schemaName);

      // Split by semicolon and execute each statement
      const statements = template
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        try {
          await client.query(statement);
        } catch (error: any) {
          if (!error.message?.includes('already exists')) {
            console.error('Error executing:', statement.substring(0, 80));
            throw error;
          }
        }
      }
      console.log(`  ✓ Created schema: ${schemaName}`);
    }

    // Step 4: Migrate existing data from public schema to tenant schema
    console.log('Step 4: Migrating existing data...');

    // Tables to migrate (in order due to foreign key dependencies)
    const tablesToMigrate = [
      'bookings',
      'estimates',
      'line_items',
      'invoices',
      'receipts',
      'notes',
      'jotter_notes',
      'damage_assessments',
      'business_settings'
    ];

    for (const table of tablesToMigrate) {
      // Check if source table exists in public schema
      const sourceExists = await client.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = $1
        )`,
        [table]
      );

      if (!sourceExists.rows[0].exists) {
        console.log(`  - ${table}: not found in public schema, skipping`);
        continue;
      }

      // Check if data already migrated
      const targetCount = await client.query(
        `SELECT COUNT(*) as count FROM ${schemaName}.${table}`
      );

      if (parseInt(targetCount.rows[0].count) > 0) {
        console.log(`  ℹ ${table}: already has data in tenant schema, skipping`);
        continue;
      }

      // Count source records
      const sourceCount = await client.query(
        `SELECT COUNT(*) as count FROM public.${table}`
      );
      const count = parseInt(sourceCount.rows[0].count);

      if (count === 0) {
        console.log(`  - ${table}: no data to migrate`);
        continue;
      }

      // Copy data from public to tenant schema
      await client.query(
        `INSERT INTO ${schemaName}.${table} SELECT * FROM public.${table}`
      );
      console.log(`  ✓ ${table}: migrated ${count} records`);
    }

    // Step 5: Verify data integrity
    console.log('Step 5: Verifying data integrity...');

    for (const table of tablesToMigrate) {
      const sourceExists = await client.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = $1
        )`,
        [table]
      );

      if (!sourceExists.rows[0].exists) continue;

      const sourceCount = await client.query(
        `SELECT COUNT(*) as count FROM public.${table}`
      );
      const targetCount = await client.query(
        `SELECT COUNT(*) as count FROM ${schemaName}.${table}`
      );

      const source = parseInt(sourceCount.rows[0].count);
      const target = parseInt(targetCount.rows[0].count);

      if (source !== target) {
        console.log(`  ⚠ ${table}: count mismatch (source: ${source}, target: ${target})`);
      } else if (source > 0) {
        console.log(`  ✓ ${table}: verified (${source} records)`);
      }
    }

    await client.query('COMMIT');

    console.log();
    console.log('='.repeat(60));
    console.log('Migration completed successfully!');
    console.log('='.repeat(60));
    console.log();
    console.log('Default tenant created:');
    console.log(`  Slug: ${DEFAULT_TENANT.slug}`);
    console.log(`  Schema: ${schemaName}`);
    console.log(`  URL: /${DEFAULT_TENANT.slug}/dashboard`);
    console.log();
    console.log('Next steps:');
    console.log('  1. Test the application at /${DEFAULT_TENANT.slug}/welcome');
    console.log('  2. Verify all features work correctly');
    console.log('  3. Consider keeping public schema tables as backup');
    console.log('  4. Delete public schema tables after verification (optional)');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
