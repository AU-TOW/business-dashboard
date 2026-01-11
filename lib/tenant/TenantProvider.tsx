'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { TenantContext } from './types';

// Create the context
const TenantContextReact = createContext<TenantContext | null>(null);

// Provider component
export function TenantProvider({
  value,
  children,
}: {
  value: TenantContext;
  children: ReactNode;
}) {
  return (
    <TenantContextReact.Provider value={value}>
      {children}
    </TenantContextReact.Provider>
  );
}

// Hook to use tenant context
export function useTenant(): TenantContext {
  const context = useContext(TenantContextReact);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// Hook to optionally get tenant context (returns null if not in provider)
export function useTenantOptional(): TenantContext | null {
  return useContext(TenantContextReact);
}

// Helper hook to check if a feature is available
export function useHasFeature(
  feature: 'unlimited_bookings' | 'receipts' | 'smart_jotter' | 'damage_assessments' | 'custom_domain' | 'api_access'
): boolean {
  const tenant = useTenant();
  const tier = tenant.subscriptionTier;

  switch (feature) {
    case 'unlimited_bookings':
      return tier !== 'trial' && tier !== 'starter';
    case 'receipts':
      return tier === 'business' || tier === 'enterprise';
    case 'smart_jotter':
      return true; // Available to all
    case 'damage_assessments':
      return tenant.tradeType === 'car_mechanic';
    case 'custom_domain':
      return tier === 'enterprise';
    case 'api_access':
      return tier === 'enterprise';
    default:
      return false;
  }
}

// Helper hook to get trade-specific terminology
export function useTerminology() {
  const tenant = useTenant();

  return {
    partsLabel: tenant.partsLabel,
    showVehicleFields: tenant.showVehicleFields,
    // Add more terminology as needed
    bookingLabel: 'Booking',
    estimateLabel: 'Estimate',
    invoiceLabel: 'Invoice',
    receiptLabel: 'Receipt',
  };
}

// Helper hook for branding
export function useBranding() {
  const tenant = useTenant();

  return {
    businessName: tenant.businessName,
    primaryColor: tenant.primaryColor,
    logoUrl: tenant.logoUrl,
  };
}

// Helper hook for generating tenant-scoped paths
export function useTenantPath() {
  const tenant = useTenant();

  return {
    // Generate a path within the tenant scope
    path: (route: string) => `/${tenant.slug}${route.startsWith('/') ? route : '/' + route}`,
    // Get the tenant slug
    slug: tenant.slug,
    // Common paths
    dashboard: `/${tenant.slug}/dashboard`,
    bookings: `/${tenant.slug}/booking`,
    estimates: `/${tenant.slug}/estimates`,
    invoices: `/${tenant.slug}/invoices`,
    receipts: `/${tenant.slug}/receipts`,
    notes: `/${tenant.slug}/notes`,
    jotter: `/${tenant.slug}/jotter`,
    assessments: `/${tenant.slug}/assessments`,
    welcome: `/${tenant.slug}/welcome`,
  };
}
