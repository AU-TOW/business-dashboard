# Plan 06-03 Summary: Feature Visibility & Trade Context

## Completed: 2026-01-11

## Objective
Implement feature visibility helpers and remove hardcoded AUTOW branding. Prepare for tier-based feature gating and make forms trade-aware.

## Tasks Completed

### Task 1: Create feature visibility helper
**File:** `lib/features.ts`

Created central feature visibility module with:
- `canAccessFeature(feature, tier, trade)` - Check tier/trade access
- `getPartsLabel(tradeType)` - Trade-specific terminology (Parts/Materials/Components)
- `shouldShowVehicleFields(tradeType)` - Vehicle field visibility
- `getUpgradeTierForFeature(feature)` - Determine required tier for locked features
- `getTierDisplayName(tier)` - Human-readable tier names
- `getTierPricing(tier)` - Pricing for display

Feature configuration:
- receipts: business, enterprise
- smartJotter: starter+
- damageAssessments: pro+ (car_mechanic only)
- telegramBot: starter+
- multiUser: business+
- vehicleFields: car_mechanic only

### Task 2: Update navigation with feature visibility
**Files:** `app/[tenant]/welcome/page.tsx`

Updated welcome page with:
- Feature visibility checks for Receipts, Smart Jotter, Damage Assessments
- Locked card UI with "Upgrade to X" badges for unavailable features
- Damage Assessments only visible for car_mechanic trade
- Greyed-out styling with dashed borders for locked features

### Task 3: Update forms with trade context
**Files:**
- `app/[tenant]/jotter/page.tsx` - Tenant branding instead of AUTOW logo
- `app/[tenant]/booking/page.tsx` - Conditional vehicle fields
- `app/[tenant]/estimates/create/page.tsx` - Trade-aware parts label, conditional vehicle fields

Changes:
1. **Jotter page:** Uses `useBranding()` for tenant logo/name instead of hardcoded AUTOW
2. **Booking page:** Vehicle fields (Registration, Make, Model) wrapped in `{showVehicle && (...)}` conditional
3. **Estimates page:**
   - Vehicle Details section conditional on `showVehicle`
   - "Parts Total" label uses `getPartsLabel(trade)` (shows "Materials" for plumbers/builders)
   - Vehicle reg modal auto-skips for non-vehicle trades

## Technical Details

### Feature Visibility Pattern
```typescript
const tier = (tenant.subscriptionTier || 'trial') as SubscriptionTier;
const trade = (tenant.tradeType || 'general') as TradeType;
const hasFeature = canAccessFeature('featureName', tier, trade);
```

### Trade-Specific Form Pattern
```typescript
const showVehicle = shouldShowVehicleFields(trade);
// In JSX:
{showVehicle && <VehicleFields />}
```

### Locked Feature UI Pattern
```typescript
{hasFeature ? (
  <button onClick={() => router.push(paths.feature)}>...</button>
) : (
  <button style={styles.lockedCard} disabled>
    <div style={styles.upgradeBadge}>
      Upgrade to {getTierDisplayName(getUpgradeTierForFeature('feature'))}
    </div>
    ...
  </button>
)}
```

## Verification
- [x] `npm run build` succeeds without errors
- [x] lib/features.ts exports all helper functions
- [x] Navigation shows feature visibility badges
- [x] AUTOW logo replaced with tenant branding in jotter
- [x] Vehicle fields hidden for non-car_mechanic trades in booking form
- [x] Vehicle fields hidden for non-car_mechanic trades in estimates form
- [x] Parts label changes based on trade type (Parts/Materials/Components)

## Files Modified
1. `lib/features.ts` (created)
2. `app/[tenant]/welcome/page.tsx` (updated)
3. `app/[tenant]/jotter/page.tsx` (updated)
4. `app/[tenant]/booking/page.tsx` (updated)
5. `app/[tenant]/estimates/create/page.tsx` (updated)

## Notes
- Trial tier gets full access to all features (7-day trial)
- Feature visibility works without Stripe integration (Phase 5 deferred)
- Trade type determines both field visibility and terminology
- Some AUTOW branding remains in legacy `/autow/*` routes (not updated)
