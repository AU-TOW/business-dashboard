import { notFound } from 'next/navigation';
import { getTenantBySlug, tenantToContext } from '@/lib/tenant';
import { TenantProvider } from '@/lib/tenant/TenantProvider';
import { ThemeWrapper } from '@/lib/theme/ThemeWrapper';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const tenantData = await getTenantBySlug(tenant);

  if (!tenantData) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${tenantData.businessName} | Business Dashboard`,
    description: `Business management dashboard for ${tenantData.businessName}`,
  };
}

export default async function TenantLayout({
  params,
  children,
}: {
  params: Promise<{ tenant: string }>;
  children: React.ReactNode;
}) {
  const { tenant } = await params;

  // Look up tenant by slug
  const tenantData = await getTenantBySlug(tenant);

  // If tenant doesn't exist, show 404
  if (!tenantData) {
    notFound();
  }

  // Check if tenant subscription is active
  if (tenantData.subscriptionStatus === 'cancelled') {
    // For now, still allow access but could redirect to reactivation page
    console.warn(`Tenant ${tenant} has cancelled subscription`);
  }

  // Convert to context (subset of fields needed at runtime)
  const tenantContext = tenantToContext(tenantData);

  return (
    <TenantProvider value={tenantContext}>
      <ThemeWrapper>
        {children}
      </ThemeWrapper>
    </TenantProvider>
  );
}
