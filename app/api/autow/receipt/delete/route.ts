import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';
import { deleteReceiptImage } from '@/lib/supabase-storage';

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
    const { id, deleteFromStorage = true } = body;

    if (!id) {
      return NextResponse.json({ error: 'Receipt ID is required' }, { status: 400 });
    }

    return await withTenantSchema(tenant, async (client) => {
      // Get the receipt first to get storage path
      const receiptResult = await client.query(
        'SELECT * FROM receipts WHERE id = $1',
        [id]
      );

      if (receiptResult.rows.length === 0) {
        return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
      }

      const receipt = receiptResult.rows[0];
      let storageDeleted = false;

      if (deleteFromStorage && receipt.storage_file_id) {
        try {
          await deleteReceiptImage(receipt.storage_file_id);
          storageDeleted = true;
          console.log('Deleted from Supabase Storage:', receipt.storage_file_id);
        } catch (storageError: any) {
          console.error('Failed to delete from Supabase Storage:', storageError);
          // Continue with database deletion even if storage delete fails
        }
      }

      // Delete from database
      await client.query('DELETE FROM receipts WHERE id = $1', [id]);

      return NextResponse.json({
        message: 'Receipt deleted successfully',
        storageDeleted,
      });
    });

  } catch (error: any) {
    console.error('Error deleting receipt:', error);
    return NextResponse.json(
      { error: 'Failed to delete receipt', details: error.message },
      { status: 500 }
    );
  }
}
