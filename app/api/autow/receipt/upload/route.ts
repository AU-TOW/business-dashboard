import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromRequest, withTenantSchema } from '@/lib/tenant/context';
import { uploadReceiptImage } from '@/lib/supabase-storage';

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
      imageData,
      supplier,
      description,
      amount,
      receipt_date,
      category,
      created_by = 'Staff'
    } = body;

    // Validate required fields
    if (!imageData) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }
    if (!supplier) {
      return NextResponse.json({ error: 'Supplier is required' }, { status: 400 });
    }
    if (amount === undefined || amount === null) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const finalReceiptDate = receipt_date || new Date().toISOString().slice(0, 10);

    return await withTenantSchema(tenant, async (client) => {
      // Generate receipt number using database function
      const numberResult = await client.query('SELECT generate_receipt_number() as receipt_number');
      const receipt_number = numberResult.rows[0].receipt_number;

      // Upload image to Supabase Storage
      let storageResult: { url: string; path: string };

      try {
        storageResult = await uploadReceiptImage(imageData, tenant.slug, supplier);
        console.log('Supabase Storage upload successful:', storageResult.url);
      } catch (storageError: any) {
        console.error('Supabase Storage upload failed:', storageError);
        return NextResponse.json(
          { error: 'Failed to upload image', details: storageError.message },
          { status: 500 }
        );
      }

      // Insert receipt into database
      const result = await client.query(
        `INSERT INTO receipts (
          receipt_number, receipt_date, supplier, description, amount, category,
          storage_file_id, storage_file_url, storage_folder_path,
          status, created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10
        ) RETURNING *`,
        [
          receipt_number,
          finalReceiptDate,
          supplier,
          description || null,
          amount,
          category || null,
          storageResult.path,
          storageResult.url,
          storageResult.path.split('/').slice(0, -1).join('/'),
          created_by
        ]
      );

      return NextResponse.json({
        message: 'Receipt uploaded successfully',
        receipt: result.rows[0],
        storage: 'Supabase Storage',
      }, { status: 201 });
    });

  } catch (error: any) {
    console.error('Error uploading receipt:', error);
    return NextResponse.json(
      { error: 'Failed to upload receipt', details: error.message },
      { status: 500 }
    );
  }
}
