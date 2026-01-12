'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTenantPath } from '@/lib/tenant/TenantProvider';


export default function EditInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paths = useTenantPath();
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
      router.replace(`${paths.invoices}/create?id=${id}`);
    } else {
      router.replace(paths.invoices);
    }
  }, [id, router, paths]);

  return null;
}
