import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.AUTOW_STAFF_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const body = await request.json();
    const {
      client_name,
      client_email,
      client_phone,
      vehicle_make,
      vehicle_model,
      vehicle_reg,
      vehicle_year,
      vehicle_color,
      mileage,
      damage_description,
      damage_locations,
      photos,
      notes,
      created_by = 'Staff'
    } = body;

    if (!client_name) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 });
    }

    if (!vehicle_reg) {
      return NextResponse.json({ error: 'Vehicle registration is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      // Generate assessment number: DMG0001, DMG0002, etc.
      const countResult = await client.query(
        'SELECT COUNT(*) as count FROM damage_assessments'
      );
      const nextNum = parseInt(countResult.rows[0].count) + 1;
      const assessment_number = 'DMG' + String(nextNum).padStart(4, '0');

      const result = await client.query(
        `INSERT INTO damage_assessments (
          assessment_number, client_name, client_email, client_phone,
          vehicle_make, vehicle_model, vehicle_reg, vehicle_year, vehicle_color,
          mileage, damage_description, damage_locations, photos, notes,
          status, created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'draft', $15
        ) RETURNING *`,
        [
          assessment_number,
          client_name,
          client_email || null,
          client_phone || null,
          vehicle_make || null,
          vehicle_model || null,
          vehicle_reg,
          vehicle_year || null,
          vehicle_color || null,
          mileage || null,
          damage_description || null,
          damage_locations ? JSON.stringify(damage_locations) : null,
          photos ? JSON.stringify(photos) : null,
          notes || null,
          created_by
        ]
      );

      return NextResponse.json({
        message: 'Damage assessment created successfully',
        assessment: result.rows[0]
      }, { status: 201 });
    });

  } catch (error: any) {
    console.error('Error creating damage assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create damage assessment', details: error.message },
      { status: 500 }
    );
  }
}
