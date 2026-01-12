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
    const { id, line_items = [], ...updateFields } = body;

    if (!id) {
      return NextResponse.json({ error: 'Estimate ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      try {
        await client.query('BEGIN');

        // Build update query dynamically
        const fields = [];
        const values = [];
        let paramCount = 1;

        const allowedFields = [
          'client_name', 'client_email', 'client_address', 'client_phone',
          'client_mobile', 'client_fax', 'vehicle_make', 'vehicle_model',
          'vehicle_reg', 'notes', 'vat_rate', 'status', 'signature_data'
        ];

        for (const field of allowedFields) {
          if (updateFields[field] !== undefined) {
            fields.push(`${field} = $${paramCount}`);
            values.push(updateFields[field]);
            paramCount++;
          }
        }

        if (fields.length > 0) {
          values.push(id);
          const updateQuery = `
            UPDATE estimates
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
          `;

          await client.query(updateQuery, values);
        }

        // Update line items if provided
        if (line_items.length > 0) {
          // Delete existing line items
          await client.query(
            'DELETE FROM line_items WHERE document_type = $1 AND document_id = $2',
            ['estimate', id]
          );

          // Insert new line items
          for (let i = 0; i < line_items.length; i++) {
            const item = line_items[i];
            await client.query(
              `INSERT INTO line_items (
                document_type, document_id, description, item_type,
                rate, quantity, sort_order
              ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [
                'estimate',
                id,
                item.description,
                item.item_type || 'service',
                item.rate,
                item.quantity,
                i
              ]
            );
          }

          // Recalculate totals
          await client.query('SELECT recalculate_estimate_totals($1)', [id]);
        }

        // Get updated estimate with line items
        const estimateResult = await client.query(
          'SELECT * FROM estimates WHERE id = $1',
          [id]
        );

        const lineItemsResult = await client.query(
          `SELECT * FROM line_items
           WHERE document_type = 'estimate' AND document_id = $1
           ORDER BY sort_order`,
          [id]
        );

        await client.query('COMMIT');

        const estimate = {
          ...estimateResult.rows[0],
          line_items: lineItemsResult.rows
        };

        return NextResponse.json({
          message: 'Estimate updated successfully',
          estimate
        });

      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    });

  } catch (error: any) {
    console.error('Error updating estimate:', error);
    return NextResponse.json(
      { error: 'Failed to update estimate', details: error.message },
      { status: 500 }
    );
  }
}
