import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';

export async function POST(request: NextRequest) {
  try {
    // Verify JWT session from cookie
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      // Check if assessment exists
      const checkResult = await client.query(
        'SELECT id FROM damage_assessments WHERE id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
      }

      // Build dynamic update query
      const allowedFields = [
        'client_name', 'client_email', 'client_phone',
        'vehicle_make', 'vehicle_model', 'vehicle_reg', 'vehicle_year', 'vehicle_color',
        'mileage', 'damage_description', 'damage_locations', 'photos', 'notes', 'status'
      ];

      const setClauses: string[] = [];
      const params: any[] = [];

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          params.push(
            field === 'damage_locations' || field === 'photos'
              ? JSON.stringify(updates[field])
              : updates[field]
          );
          setClauses.push(`${field} = $${params.length}`);
        }
      }

      if (setClauses.length === 0) {
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
      }

      // Add updated_at
      setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

      params.push(id);
      const result = await client.query(
        `UPDATE damage_assessments SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING *`,
        params
      );

      return NextResponse.json({
        message: 'Damage assessment updated successfully',
        assessment: result.rows[0]
      });
    });

  } catch (error: any) {
    console.error('Error updating damage assessment:', error);
    return NextResponse.json(
      { error: 'Failed to update damage assessment', details: error.message },
      { status: 500 }
    );
  }
}
