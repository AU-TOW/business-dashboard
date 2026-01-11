-- Migration: Add owner_user_id to tenants table
-- Links Supabase Auth users to their tenant

-- Add the owner_user_id column
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_tenants_owner_user_id ON public.tenants(owner_user_id);

-- Add comment for documentation
COMMENT ON COLUMN public.tenants.owner_user_id IS 'Supabase Auth user ID of the tenant owner';
