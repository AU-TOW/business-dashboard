import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getTenantFromRequest } from '@/lib/tenant/context';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : undefined
});

/**
 * GET /api/autow/tenant/settings
 * Returns current tenant settings
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.AUTOW_STAFF_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant context
    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    // Fetch full tenant data from public.tenants
    const result = await pool.query(
      `SELECT
        id, slug, business_name, trade_type, email, phone, address, postcode,
        logo_url, primary_color,
        subscription_tier, trial_ends_at, subscription_status,
        bank_name, bank_account_name, bank_sort_code, bank_account_number,
        parts_label, show_vehicle_fields,
        max_bookings_per_month, max_telegram_bots, max_users,
        created_at, updated_at
      FROM public.tenants WHERE id = $1`,
      [tenant.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const row = result.rows[0];

    return NextResponse.json({
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
      bankName: row.bank_name,
      bankAccountName: row.bank_account_name,
      bankSortCode: row.bank_sort_code,
      bankAccountNumber: row.bank_account_number,
      partsLabel: row.parts_label,
      showVehicleFields: row.show_vehicle_fields,
      maxBookingsPerMonth: row.max_bookings_per_month,
      maxTelegramBots: row.max_telegram_bots,
      maxUsers: row.max_users,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error: any) {
    console.error('Error fetching tenant settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/autow/tenant/settings
 * Updates tenant settings
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.AUTOW_STAFF_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tenant context
    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const body = await request.json();
    const {
      businessName,
      email,
      phone,
      address,
      postcode,
      primaryColor,
      bankName,
      bankAccountName,
      bankSortCode,
      bankAccountNumber,
    } = body;

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (businessName !== undefined) {
      updates.push(`business_name = $${paramIndex++}`);
      values.push(businessName);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone || null);
    }
    if (address !== undefined) {
      updates.push(`address = $${paramIndex++}`);
      values.push(address || null);
    }
    if (postcode !== undefined) {
      updates.push(`postcode = $${paramIndex++}`);
      values.push(postcode || null);
    }
    if (primaryColor !== undefined) {
      // Validate hex color format
      if (primaryColor && !/^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
        return NextResponse.json(
          { error: 'Invalid color format. Use hex format like #3B82F6' },
          { status: 400 }
        );
      }
      updates.push(`primary_color = $${paramIndex++}`);
      values.push(primaryColor || '#3B82F6');
    }
    if (bankName !== undefined) {
      updates.push(`bank_name = $${paramIndex++}`);
      values.push(bankName || null);
    }
    if (bankAccountName !== undefined) {
      updates.push(`bank_account_name = $${paramIndex++}`);
      values.push(bankAccountName || null);
    }
    if (bankSortCode !== undefined) {
      updates.push(`bank_sort_code = $${paramIndex++}`);
      values.push(bankSortCode || null);
    }
    if (bankAccountNumber !== undefined) {
      updates.push(`bank_account_number = $${paramIndex++}`);
      values.push(bankAccountNumber || null);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`);

    // Add tenant ID as final parameter
    values.push(tenant.id);

    const result = await pool.query(
      `UPDATE public.tenants
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING
         id, slug, business_name, trade_type, email, phone, address, postcode,
         logo_url, primary_color,
         subscription_tier, trial_ends_at, subscription_status,
         bank_name, bank_account_name, bank_sort_code, bank_account_number,
         parts_label, show_vehicle_fields,
         updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const row = result.rows[0];

    return NextResponse.json({
      message: 'Settings updated successfully',
      tenant: {
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
        bankName: row.bank_name,
        bankAccountName: row.bank_account_name,
        bankSortCode: row.bank_sort_code,
        bankAccountNumber: row.bank_account_number,
        partsLabel: row.parts_label,
        showVehicleFields: row.show_vehicle_fields,
        updatedAt: row.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Error updating tenant settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings', details: error.message },
      { status: 500 }
    );
  }
}
