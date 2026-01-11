-- Migration: 001_create_tenants
-- Description: Create master tenants table for multi-tenancy
-- Date: 2026-01-11

-- ============================================
-- TENANTS TABLE (Public Schema)
-- ============================================
-- Central registry of all tenant businesses

CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identification
    slug VARCHAR(50) UNIQUE NOT NULL,  -- URL-safe identifier (e.g., 'acme-plumbing')

    -- Business Information
    business_name VARCHAR(255) NOT NULL,
    trade_type VARCHAR(50) NOT NULL CHECK (trade_type IN ('car_mechanic', 'plumber', 'electrician', 'builder', 'general')),

    -- Contact Information
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    postcode VARCHAR(20),

    -- Branding (expanded in Phase 7)
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3B82F6',  -- Light blue default

    -- Subscription & Billing
    subscription_tier VARCHAR(20) NOT NULL DEFAULT 'trial' CHECK (subscription_tier IN ('trial', 'starter', 'pro', 'business', 'enterprise')),
    trial_ends_at TIMESTAMP,
    subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due', 'cancelled', 'paused')),
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),

    -- Feature Limits (based on tier)
    max_bookings_per_month INTEGER DEFAULT 10,  -- Starter: 10, Pro+: unlimited (-1)
    max_telegram_bots INTEGER DEFAULT 1,        -- Starter: 1, Pro: 1, Business: 3, Enterprise: -1
    max_users INTEGER DEFAULT 1,                -- Starter/Pro: 1, Business: 3, Enterprise: -1

    -- Trade-Specific Customization
    parts_label VARCHAR(50) DEFAULT 'Parts',  -- Parts, Materials, Components, Supplies, Items
    show_vehicle_fields BOOLEAN DEFAULT true,  -- true for car_mechanic, false for others

    -- Bank Details (for invoices)
    bank_name VARCHAR(100),
    bank_account_name VARCHAR(255),
    bank_sort_code VARCHAR(10),
    bank_account_number VARCHAR(20),

    -- Schema Reference
    schema_name VARCHAR(63) NOT NULL UNIQUE,  -- PostgreSQL schema name (e.g., 'tenant_abc123')

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Owner reference (set after auth is implemented in Phase 3)
    owner_user_id UUID
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_email ON public.tenants(email);
CREATE INDEX IF NOT EXISTS idx_tenants_subscription_tier ON public.tenants(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_tenants_subscription_status ON public.tenants(subscription_status);

-- ============================================
-- USERS TABLE (Public Schema)
-- ============================================
-- Users linked to tenants (for multi-user tiers)

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant relationship
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

    -- User Information
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),

    -- Authentication (magic link)
    magic_link_token VARCHAR(255),
    magic_link_expires_at TIMESTAMP,
    last_login_at TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Unique email per tenant
    UNIQUE(tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON public.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_magic_link_token ON public.users(magic_link_token);

-- ============================================
-- TELEGRAM BOTS TABLE (Public Schema)
-- ============================================
-- Telegram bot configurations per tenant

CREATE TABLE IF NOT EXISTS public.telegram_bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

    bot_name VARCHAR(100) NOT NULL,
    bot_token VARCHAR(255) NOT NULL,
    chat_id VARCHAR(50) NOT NULL,

    -- Notification settings
    notify_new_booking BOOLEAN DEFAULT true,
    notify_estimate_viewed BOOLEAN DEFAULT true,
    notify_invoice_viewed BOOLEAN DEFAULT true,
    notify_payment_received BOOLEAN DEFAULT true,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_telegram_bots_tenant_id ON public.telegram_bots(tenant_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- TENANT DEFAULTS BY TRADE TYPE
-- ============================================
-- Reference for signup flow

COMMENT ON TABLE public.tenants IS 'Trade type defaults:
- car_mechanic: parts_label=Parts, show_vehicle_fields=true
- plumber: parts_label=Materials, show_vehicle_fields=false
- electrician: parts_label=Components, show_vehicle_fields=false
- builder: parts_label=Supplies, show_vehicle_fields=false
- general: parts_label=Items, show_vehicle_fields=false (customizable)';
