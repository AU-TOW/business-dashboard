import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { getTenantFromRequest } from '@/lib/tenant/context';

const BUCKET_NAME = 'tenant-logos';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined
});

// Lazy-initialize Supabase client with service role key for storage operations
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Use service role key for storage operations (has full access)
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not configured');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
}

/**
 * POST /api/autow/tenant/logo
 * Upload or update tenant logo
 */
export async function POST(request: NextRequest) {
  try {
    // Verify JWT session from cookie
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant context
    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const body = await request.json();
    const { imageData, filename } = body;

    // Validate image data
    if (!imageData) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    // Detect content type from base64 data URL
    let contentType = 'image/jpeg';
    if (imageData.includes('data:image/png')) {
      contentType = 'image/png';
    } else if (imageData.includes('data:image/webp')) {
      contentType = 'image/webp';
    } else if (imageData.includes('data:image/jpeg') || imageData.includes('data:image/jpg')) {
      contentType = 'image/jpeg';
    }

    // Validate content type
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PNG, JPG, WEBP' },
        { status: 400 }
      );
    }

    // Remove data URL prefix
    const base64Content = imageData.replace(/^data:image\/\w+;base64,/, '');

    // Convert to buffer
    const buffer = Buffer.from(base64Content, 'base64');

    // Validate file size
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 2MB' },
        { status: 400 }
      );
    }

    // Generate filename
    const extension = contentType.split('/')[1];
    const timestamp = Date.now();
    const logoFilename = `logo_${timestamp}.${extension}`;
    const fullPath = `${tenant.id}/${logoFilename}`;

    const supabase = getSupabaseClient();

    // Get current logo URL to delete old file
    const currentResult = await pool.query(
      'SELECT logo_url FROM public.tenants WHERE id = $1',
      [tenant.id]
    );
    const currentLogoUrl = currentResult.rows[0]?.logo_url;

    // Delete old logo if exists
    if (currentLogoUrl) {
      try {
        // Extract path from URL
        const urlParts = currentLogoUrl.split('/storage/v1/object/public/tenant-logos/');
        if (urlParts.length > 1) {
          const oldPath = urlParts[1];
          await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
          console.log('Deleted old logo:', oldPath);
        }
      } catch (deleteError) {
        console.warn('Failed to delete old logo:', deleteError);
        // Continue with upload even if delete fails
      }
    }

    // Upload new logo
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, buffer, {
        contentType,
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error('Supabase Storage upload failed:', error);
      return NextResponse.json(
        { error: 'Failed to upload logo', details: error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fullPath);

    const logoUrl = urlData.publicUrl;

    // Update tenant record with new logo URL
    await pool.query(
      'UPDATE public.tenants SET logo_url = $1, updated_at = NOW() WHERE id = $2',
      [logoUrl, tenant.id]
    );

    return NextResponse.json({
      message: 'Logo uploaded successfully',
      logoUrl,
      path: fullPath,
    });
  } catch (error: any) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { error: 'Failed to upload logo', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/autow/tenant/logo
 * Remove tenant logo
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify JWT session from cookie
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant context
    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    // Get current logo URL
    const result = await pool.query(
      'SELECT logo_url FROM public.tenants WHERE id = $1',
      [tenant.id]
    );

    const logoUrl = result.rows[0]?.logo_url;

    if (!logoUrl) {
      return NextResponse.json({ message: 'No logo to remove' });
    }

    const supabase = getSupabaseClient();

    // Extract path from URL and delete
    try {
      const urlParts = logoUrl.split('/storage/v1/object/public/tenant-logos/');
      if (urlParts.length > 1) {
        const path = urlParts[1];
        await supabase.storage.from(BUCKET_NAME).remove([path]);
      }
    } catch (deleteError) {
      console.warn('Failed to delete logo from storage:', deleteError);
      // Continue to clear database even if storage delete fails
    }

    // Clear logo URL in database
    await pool.query(
      'UPDATE public.tenants SET logo_url = NULL, updated_at = NOW() WHERE id = $1',
      [tenant.id]
    );

    return NextResponse.json({ message: 'Logo removed successfully' });
  } catch (error: any) {
    console.error('Error removing logo:', error);
    return NextResponse.json(
      { error: 'Failed to remove logo', details: error.message },
      { status: 500 }
    );
  }
}
