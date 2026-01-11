/**
 * Feature visibility utilities for subscription tier and trade type gating.
 *
 * This module provides a central place to check feature access without
 * requiring Stripe integration (Phase 5 deferred).
 */

export type SubscriptionTier = 'trial' | 'starter' | 'pro' | 'business' | 'enterprise';
export type TradeType = 'car_mechanic' | 'plumber' | 'electrician' | 'builder' | 'general';

type FeatureAccess = SubscriptionTier[] | TradeType[];

interface FeatureConfig {
  // Tier-based features - which tiers can access each feature
  receipts: SubscriptionTier[];
  smartJotter: SubscriptionTier[];
  damageAssessments: SubscriptionTier[];
  telegramBot: SubscriptionTier[];
  multiUser: SubscriptionTier[];
  customBranding: SubscriptionTier[];
  unlimitedBookings: SubscriptionTier[];
  apiAccess: SubscriptionTier[];

  // Trade-specific features
  vehicleFields: TradeType[];
}

const FEATURE_CONFIG: FeatureConfig = {
  // Tier-gated features
  receipts: ['business', 'enterprise'],
  smartJotter: ['starter', 'pro', 'business', 'enterprise'],
  damageAssessments: ['pro', 'business', 'enterprise'],
  telegramBot: ['starter', 'pro', 'business', 'enterprise'],
  multiUser: ['business', 'enterprise'],
  customBranding: ['business', 'enterprise'],
  unlimitedBookings: ['pro', 'business', 'enterprise'],
  apiAccess: ['enterprise'],

  // Trade-specific (only car_mechanic shows vehicle fields)
  vehicleFields: ['car_mechanic'],
};

/**
 * Check if a feature is accessible based on subscription tier and trade type.
 *
 * Trial tier has access to all features for 7 days.
 * Some features (like damage assessments) have additional trade type requirements.
 */
export function canAccessFeature(
  feature: keyof FeatureConfig,
  tier: SubscriptionTier,
  tradeType?: TradeType
): boolean {
  // Trial has all features for 7 days
  if (tier === 'trial') return true;

  // Check if it's a trade-specific feature
  if (feature === 'vehicleFields') {
    const allowedTrades = FEATURE_CONFIG.vehicleFields;
    return tradeType ? allowedTrades.includes(tradeType) : false;
  }

  // Get allowed tiers for this feature
  const allowedTiers = FEATURE_CONFIG[feature] as SubscriptionTier[];

  // Check tier access
  if (!allowedTiers.includes(tier)) return false;

  // Special case: damage assessments requires car_mechanic trade
  if (feature === 'damageAssessments' && tradeType !== 'car_mechanic') {
    return false;
  }

  return true;
}

/**
 * Get the appropriate label for "Parts" based on trade type.
 * Different trades use different terminology.
 */
export function getPartsLabel(tradeType: TradeType): string {
  switch (tradeType) {
    case 'plumber':
      return 'Materials';
    case 'electrician':
      return 'Components';
    case 'builder':
      return 'Materials';
    case 'car_mechanic':
      return 'Parts';
    case 'general':
    default:
      return 'Parts';
  }
}

/**
 * Determine if vehicle fields should be shown based on trade type.
 * Only car mechanics need vehicle-specific fields.
 */
export function shouldShowVehicleFields(tradeType: TradeType): boolean {
  return tradeType === 'car_mechanic';
}

/**
 * Get the upgrade tier suggestion for a locked feature.
 */
export function getUpgradeTierForFeature(feature: keyof FeatureConfig): SubscriptionTier | null {
  // Trade-specific features don't have tier upgrades
  if (feature === 'vehicleFields') return null;

  const allowedTiers = FEATURE_CONFIG[feature] as SubscriptionTier[];

  // Return the lowest tier that has access
  const tierOrder: SubscriptionTier[] = ['starter', 'pro', 'business', 'enterprise'];
  for (const tier of tierOrder) {
    if (allowedTiers.includes(tier)) {
      return tier;
    }
  }

  return null;
}

/**
 * Get pricing for a tier (for display purposes).
 */
export function getTierPricing(tier: SubscriptionTier): { price: number; period: string } | null {
  switch (tier) {
    case 'starter':
      return { price: 12, period: 'month' };
    case 'pro':
      return { price: 29, period: 'month' };
    case 'business':
      return { price: 59, period: 'month' };
    case 'enterprise':
      return { price: 99, period: 'month' };
    default:
      return null;
  }
}

/**
 * Get a human-readable name for a tier.
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case 'trial':
      return 'Trial';
    case 'starter':
      return 'Starter';
    case 'pro':
      return 'Pro';
    case 'business':
      return 'Business';
    case 'enterprise':
      return 'Enterprise';
    default:
      return tier;
  }
}
