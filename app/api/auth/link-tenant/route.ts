import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined
});

export async function POST(request: NextRequest) {
  try {
    const { userId, tenantSlug } = await request.json();

    if (!userId || !tenantSlug) {
      return NextResponse.json(
        { error: 'User ID and tenant slug are required' },
        { status: 400 }
      );
    }

    // Update the tenant with the owner's Supabase user ID
    const result = await pool.query(
      `UPDATE public.tenants
       SET owner_user_id = $1, updated_at = NOW()
       WHERE slug = $2
       AND owner_user_id IS NULL
       RETURNING id, slug, business_name`,
      [userId, tenantSlug]
    );

    if (result.rows.length === 0) {
      // Tenant not found or already linked
      // Check if it's already linked to this user
      const checkResult = await pool.query(
        `SELECT id, owner_user_id FROM public.tenants WHERE slug = $1`,
        [tenantSlug]
      );

      if (checkResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Tenant not found' },
          { status: 404 }
        );
      }

      if (checkResult.rows[0].owner_user_id === userId) {
        // Already linked to this user - success
        return NextResponse.json({
          success: true,
          message: 'Tenant already linked to this user',
        });
      }

      // Linked to different user
      return NextResponse.json(
        { error: 'Tenant is already linked to another user' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tenant linked successfully',
      tenant: result.rows[0],
    });
  } catch (error: any) {
    console.error('Link tenant error:', error);
    return NextResponse.json(
      { error: 'Failed to link tenant' },
      { status: 500 }
    );
  }
}
