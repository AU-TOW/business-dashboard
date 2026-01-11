-- Migration: 003_share_token_lookup
-- Description: Create public lookup table for share tokens to enable multi-tenant share pages
-- Date: 2026-01-11

-- ============================================
-- SHARE TOKEN LOOKUP TABLE (Public Schema)
-- ============================================
-- Maps share tokens to tenant schemas for public share pages
-- This allows share pages to find documents without knowing the tenant

CREATE TABLE IF NOT EXISTS public.share_token_lookup (
    id SERIAL PRIMARY KEY,

    -- Token and document info
    share_token VARCHAR(64) NOT NULL UNIQUE,
    document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('estimate', 'invoice', 'assessment')),
    document_id INTEGER NOT NULL,

    -- Tenant reference
    tenant_slug VARCHAR(50) NOT NULL REFERENCES public.tenants(slug) ON DELETE CASCADE,
    tenant_schema VARCHAR(63) NOT NULL,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP  -- Optional expiry
);

CREATE INDEX IF NOT EXISTS idx_share_token_lookup_token ON public.share_token_lookup(share_token);
CREATE INDEX IF NOT EXISTS idx_share_token_lookup_tenant ON public.share_token_lookup(tenant_slug);

-- ============================================
-- HELPER FUNCTION: Register Share Token
-- ============================================
-- Call this when generating a share token for any document

CREATE OR REPLACE FUNCTION public.register_share_token(
    p_share_token VARCHAR(64),
    p_document_type VARCHAR(20),
    p_document_id INTEGER,
    p_tenant_slug VARCHAR(50)
)
RETURNS VOID AS $$
DECLARE
    v_tenant_schema VARCHAR(63);
BEGIN
    -- Get tenant schema
    SELECT schema_name INTO v_tenant_schema
    FROM public.tenants
    WHERE slug = p_tenant_slug;

    IF v_tenant_schema IS NULL THEN
        RAISE EXCEPTION 'Tenant not found: %', p_tenant_slug;
    END IF;

    -- Insert or update lookup
    INSERT INTO public.share_token_lookup (share_token, document_type, document_id, tenant_slug, tenant_schema)
    VALUES (p_share_token, p_document_type, p_document_id, p_tenant_slug, v_tenant_schema)
    ON CONFLICT (share_token)
    DO UPDATE SET
        document_type = EXCLUDED.document_type,
        document_id = EXCLUDED.document_id,
        tenant_slug = EXCLUDED.tenant_slug,
        tenant_schema = EXCLUDED.tenant_schema;
END;
$$ LANGUAGE plpgsql;
