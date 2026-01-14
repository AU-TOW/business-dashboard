// Apply vehicle-based document numbering migration to tenant schema
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('Starting migration...\n');

    // Add sequence_number columns
    await client.query('ALTER TABLE tenant_autow_services.invoices ADD COLUMN IF NOT EXISTS sequence_number INTEGER');
    console.log('✓ Added sequence_number to invoices');

    await client.query('ALTER TABLE tenant_autow_services.estimates ADD COLUMN IF NOT EXISTS sequence_number INTEGER');
    console.log('✓ Added sequence_number to estimates');

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_invoices_vehicle_reg ON tenant_autow_services.invoices(vehicle_reg)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_estimates_vehicle_reg ON tenant_autow_services.estimates(vehicle_reg)');
    console.log('✓ Created vehicle_reg indexes');

    // Drop old functions
    await client.query('DROP FUNCTION IF EXISTS tenant_autow_services.generate_invoice_number()');
    await client.query('DROP FUNCTION IF EXISTS tenant_autow_services.generate_estimate_number()');
    console.log('✓ Dropped old functions');

    // Create normalize_vehicle_reg function
    await client.query(`
      CREATE OR REPLACE FUNCTION tenant_autow_services.normalize_vehicle_reg(reg VARCHAR)
      RETURNS VARCHAR AS $fn$
      BEGIN
          IF reg IS NULL OR reg = '' THEN
              RETURN NULL;
          END IF;
          RETURN UPPER(REPLACE(REPLACE(reg, ' ', ''), '-', ''));
      END;
      $fn$ LANGUAGE plpgsql IMMUTABLE
    `);
    console.log('✓ Created normalize_vehicle_reg function');

    // Create generate_estimate_number function
    await client.query(`
      CREATE OR REPLACE FUNCTION tenant_autow_services.generate_estimate_number(vehicle_reg_input VARCHAR DEFAULT NULL)
      RETURNS TABLE(estimate_number VARCHAR(50), sequence_num INTEGER, normalized_reg VARCHAR(20)) AS $fn$
      DECLARE
          norm_reg VARCHAR(20);
          next_seq INTEGER;
          new_number VARCHAR(50);
      BEGIN
          norm_reg := tenant_autow_services.normalize_vehicle_reg(vehicle_reg_input);
          IF norm_reg IS NULL OR norm_reg = '' THEN
              SELECT COALESCE(MAX(e.sequence_number), 0) + 1 INTO next_seq
              FROM tenant_autow_services.estimates e
              WHERE e.vehicle_reg IS NULL OR e.vehicle_reg = '';
              new_number := 'EST-' || LPAD(next_seq::TEXT, 5, '0');
              normalized_reg := NULL;
          ELSE
              SELECT COALESCE(MAX(e.sequence_number), 0) + 1 INTO next_seq
              FROM tenant_autow_services.estimates e
              WHERE tenant_autow_services.normalize_vehicle_reg(e.vehicle_reg) = norm_reg;
              new_number := norm_reg || '-' || LPAD(next_seq::TEXT, 3, '0');
              normalized_reg := norm_reg;
          END IF;
          estimate_number := new_number;
          sequence_num := next_seq;
          RETURN NEXT;
      END;
      $fn$ LANGUAGE plpgsql
    `);
    console.log('✓ Created generate_estimate_number function');

    // Create generate_invoice_number function
    await client.query(`
      CREATE OR REPLACE FUNCTION tenant_autow_services.generate_invoice_number(vehicle_reg_input VARCHAR DEFAULT NULL)
      RETURNS TABLE(invoice_number VARCHAR(50), sequence_num INTEGER, normalized_reg VARCHAR(20)) AS $fn$
      DECLARE
          norm_reg VARCHAR(20);
          next_seq INTEGER;
          new_number VARCHAR(50);
      BEGIN
          norm_reg := tenant_autow_services.normalize_vehicle_reg(vehicle_reg_input);
          IF norm_reg IS NULL OR norm_reg = '' THEN
              SELECT COALESCE(MAX(i.sequence_number), 0) + 1 INTO next_seq
              FROM tenant_autow_services.invoices i
              WHERE i.vehicle_reg IS NULL OR i.vehicle_reg = '';
              new_number := 'INV-' || LPAD(next_seq::TEXT, 5, '0');
              normalized_reg := NULL;
          ELSE
              SELECT COALESCE(MAX(i.sequence_number), 0) + 1 INTO next_seq
              FROM tenant_autow_services.invoices i
              WHERE tenant_autow_services.normalize_vehicle_reg(i.vehicle_reg) = norm_reg;
              new_number := norm_reg || '-' || LPAD(next_seq::TEXT, 3, '0');
              normalized_reg := norm_reg;
          END IF;
          invoice_number := new_number;
          sequence_num := next_seq;
          RETURN NEXT;
      END;
      $fn$ LANGUAGE plpgsql
    `);
    console.log('✓ Created generate_invoice_number function');

    // Grant permissions
    await client.query('GRANT EXECUTE ON FUNCTION tenant_autow_services.normalize_vehicle_reg(VARCHAR) TO authenticated');
    await client.query('GRANT EXECUTE ON FUNCTION tenant_autow_services.generate_estimate_number(VARCHAR) TO authenticated');
    await client.query('GRANT EXECUTE ON FUNCTION tenant_autow_services.generate_invoice_number(VARCHAR) TO authenticated');
    console.log('✓ Granted permissions');

    // Test the functions
    const testResult = await client.query('SELECT * FROM tenant_autow_services.generate_invoice_number(NULL)');
    console.log('\n✓ Test invoice number:', testResult.rows[0]);

    const testResult2 = await client.query("SELECT * FROM tenant_autow_services.generate_invoice_number('AB12 CDE')");
    console.log('✓ Test with vehicle:', testResult2.rows[0]);

    console.log('\n✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
}

run().catch(() => process.exit(1));
