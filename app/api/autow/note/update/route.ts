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

    // Get tenant context
    const tenant = await getTenantFromRequest(request);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    // Build dynamic update query
    const allowedFields = [
      'customer_name', 'customer_phone', 'customer_email',
      'vehicle_make', 'vehicle_model', 'vehicle_reg', 'vehicle_year',
      'issue_description', 'notes', 'status'
    ];

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(updateData[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    return await withTenantSchema(tenant, async (client) => {
      const query = `
        UPDATE jotter_notes
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Note not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'Note updated successfully',
        note: result.rows[0]
      });
    });

  } catch (error: any) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note', details: error.message },
      { status: 500 }
    );
  }
}
