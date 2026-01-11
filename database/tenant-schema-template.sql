-- Tenant Schema Template
-- This template is used to create all tables for a new tenant
-- Variables to replace: {{SCHEMA_NAME}}
-- Usage: Replace all instances of {{SCHEMA_NAME}} with the actual tenant schema name

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

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
-- Note: Adjust these based on your Supabase RLS setup

GRANT USAGE ON SCHEMA {{SCHEMA_NAME}} TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA {{SCHEMA_NAME}} TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA {{SCHEMA_NAME}} TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA {{SCHEMA_NAME}} TO authenticated;
