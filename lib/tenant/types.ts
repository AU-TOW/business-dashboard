// Tenant Types for Multi-Tenancy

export type TradeType = 'car_mechanic' | 'plumber' | 'electrician' | 'builder' | 'general';

export type SubscriptionTier = 'trial' | 'starter' | 'pro' | 'business' | 'enterprise';

export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'paused';

export interface Tenant {
  id: string;
  slug: string;
  businessName: string;
  tradeType: TradeType;
  email: string;
  phone?: string;
  address?: string;
  postcode?: string;
  logoUrl?: string;
  primaryColor: string;
  subscriptionTier: SubscriptionTier;
  trialEndsAt?: Date;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  maxBookingsPerMonth: number;
  maxTelegramBots: number;
  maxUsers: number;
  partsLabel: string;
  showVehicleFields: boolean;
  schemaName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantContext {
  id: string;
  slug: string;
  schemaName: string;
  businessName: string;
  tradeType: TradeType;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  partsLabel: string;
  showVehicleFields: boolean;
  primaryColor: string;
  logoUrl?: string;
  // Feature limits
  maxBookingsPerMonth: number;
  maxTelegramBots: number;
  maxUsers: number;
}

export interface CreateTenantInput {
  slug: string;
  businessName: string;
  tradeType: TradeType;
  email: string;
  phone?: string;
}

// Trade type defaults
export const TRADE_DEFAULTS: Record<TradeType, { partsLabel: string; showVehicleFields: boolean }> = {
  car_mechanic: { partsLabel: 'Parts', showVehicleFields: true },
  plumber: { partsLabel: 'Materials', showVehicleFields: false },
  electrician: { partsLabel: 'Components', showVehicleFields: false },
  builder: { partsLabel: 'Supplies', showVehicleFields: false },
  general: { partsLabel: 'Items', showVehicleFields: false },
};

// Subscription tier limits (-1 means unlimited)
export const TIER_LIMITS: Record<SubscriptionTier, { bookings: number; bots: number; users: number }> = {
  trial: { bookings: 10, bots: 1, users: 1 },
  starter: { bookings: 10, bots: 1, users: 1 },
  pro: { bookings: -1, bots: 1, users: 1 },
  business: { bookings: -1, bots: 3, users: 3 },
  enterprise: { bookings: -1, bots: -1, users: -1 },
};
