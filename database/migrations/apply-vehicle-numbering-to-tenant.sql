-- Apply Vehicle-Based Document Numbering to tenant_autow_services schema
-- Run this manually in Supabase SQL Editor

-- ============================================
-- ADD SEQUENCE NUMBER COLUMNS IF NOT EXISTS
-- ============================================

ALTER TABLE tenant_autow_services.invoices
ADD COLUMN IF NOT EXISTS sequence_number INTEGER;

ALTER TABLE tenant_autow_services.estimates
ADD COLUMN IF NOT EXISTS sequence_number INTEGER;

-- ============================================
-- CREATE INDEXES FOR VEHICLE-BASED QUERIES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_invoices_vehicle_reg ON tenant_autow_services.invoices(vehicle_reg);
CREATE INDEX IF NOT EXISTS idx_estimates_vehicle_reg ON tenant_autow_services.estimates(vehicle_reg);
CREATE INDEX IF NOT EXISTS idx_invoices_vehicle_sequence ON tenant_autow_services.invoices(vehicle_reg, sequence_number);
CREATE INDEX IF NOT EXISTS idx_estimates_vehicle_sequence ON tenant_autow_services.estimates(vehicle_reg, sequence_number);

-- ============================================
-- DROP OLD FUNCTIONS
-- ============================================

DROP FUNCTION IF EXISTS tenant_autow_services.generate_invoice_number();
DROP FUNCTION IF EXISTS tenant_autow_services.generate_estimate_number();

-- ============================================
-- HELPER FUNCTION: NORMALIZE VEHICLE REG
-- ============================================

CREATE OR REPLACE FUNCTION tenant_autow_services.normalize_vehicle_reg(reg VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
    IF reg IS NULL OR reg = '' THEN
        RETURN NULL;
    END IF;
    RETURN UPPER(REPLACE(REPLACE(reg, ' ', ''), '-', ''));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- GENERATE ESTIMATE NUMBER (Vehicle-Based)
-- ============================================

CREATE OR REPLACE FUNCTION tenant_autow_services.generate_estimate_number(vehicle_reg_input VARCHAR DEFAULT NULL)
RETURNS TABLE(estimate_number VARCHAR(50), sequence_num INTEGER, normalized_reg VARCHAR(20)) AS $$
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
$$ LANGUAGE plpgsql;

-- ============================================
-- GENERATE INVOICE NUMBER (Vehicle-Based)
-- ============================================

CREATE OR REPLACE FUNCTION tenant_autow_services.generate_invoice_number(vehicle_reg_input VARCHAR DEFAULT NULL)
RETURNS TABLE(invoice_number VARCHAR(50), sequence_num INTEGER, normalized_reg VARCHAR(20)) AS $$
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
$$ LANGUAGE plpgsql;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION tenant_autow_services.normalize_vehicle_reg(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION tenant_autow_services.generate_estimate_number(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION tenant_autow_services.generate_invoice_number(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION tenant_autow_services.normalize_vehicle_reg(VARCHAR) TO service_role;
GRANT EXECUTE ON FUNCTION tenant_autow_services.generate_estimate_number(VARCHAR) TO service_role;
GRANT EXECUTE ON FUNCTION tenant_autow_services.generate_invoice_number(VARCHAR) TO service_role;
