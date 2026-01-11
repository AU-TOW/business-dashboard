# Plan 07-02 Summary: Dynamic Theming

## Completed: 2026-01-11

## Objective
Implement dynamic theming system with CSS variables for tenant branding.

## What Was Done

### Task 1: Create Theme Provider and CSS Variables ✓
Created comprehensive theming system:

**ThemeProvider Component (`lib/theme/ThemeProvider.tsx`):**
- Reads primaryColor from tenant context
- Checks tier permissions with `canAccessFeature('customBranding')`
- Sets CSS custom properties on document root:
  - `--primary-color`: The hex color
  - `--primary-rgb`: RGB values for rgba() usage
  - `--primary-light`: 15% lighter version
  - `--primary-dark`: 15% darker version
- Falls back to default blue (#3B82F6) for non-Business tiers
- Includes helper functions: `hexToRgb()`, `lightenColor()`, `darkenColor()`

**ThemeWrapper Component (`lib/theme/ThemeWrapper.tsx`):**
- Client-side wrapper for use in server component layouts

**Tenant Layout Integration:**
- Updated `app/[tenant]/layout.tsx` to wrap content with ThemeWrapper
- Theme now automatically applies to all tenant pages

**Global CSS Fallbacks (`app/globals.css`):**
```css
:root {
  --primary-color: #3B82F6;
  --primary-rgb: 59, 130, 246;
  --primary-light: #60a5fa;
  --primary-dark: #2563eb;
}
```

### Task 2: Color Picker in Settings ✓
Already implemented in 07-01:
- Color picker with native HTML input
- Hex text input for manual entry
- Preview button showing selected color
- Tier-gated: Shows upgrade message for non-Business tiers
- Saves to database via `/api/autow/tenant/settings`

### Task 3: Apply Theme to Key Components ✓
Updated pages to use CSS variables:

**Welcome Page (`app/[tenant]/welcome/page.tsx`):**
- Box shadow: `rgba(var(--primary-rgb), 0.15)`
- Card borders: `rgba(var(--primary-rgb), 0.2)`
- Titles: `var(--primary-dark)`
- Loading text: `var(--primary-color)`
- Logo shadow: `rgba(var(--primary-rgb), 0.2)`

**Settings Page (`app/[tenant]/settings/page.tsx`):**
- Back button: `var(--primary-color)`
- Section titles: `var(--primary-dark)`
- Section borders: `rgba(var(--primary-rgb), 0.1)`
- Input borders: `rgba(var(--primary-rgb), 0.2)`
- Upload button: `var(--primary-color)`
- Save button: `linear-gradient(...var(--primary-color), var(--primary-dark))`
- Logo container: `rgba(var(--primary-rgb), 0.3)`
- Tier name: `var(--primary-dark)`

## Files Created/Modified

### New Files
- `lib/theme/ThemeProvider.tsx` - Theme context and CSS variable management
- `lib/theme/ThemeWrapper.tsx` - Client wrapper for server layouts

### Modified Files
- `app/[tenant]/layout.tsx` - Added ThemeWrapper
- `app/globals.css` - Added CSS variable defaults
- `app/[tenant]/welcome/page.tsx` - Updated to use CSS variables
- `app/[tenant]/settings/page.tsx` - Updated to use CSS variables

## Technical Notes

**CSS Variable Pattern:**
```css
/* Direct color usage */
color: var(--primary-color);

/* For rgba() with opacity */
background: rgba(var(--primary-rgb), 0.15);

/* Gradients */
background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
```

**Tier Gating:**
- Trial: Can customize (trial has all features)
- Starter/Pro: Uses default blue
- Business/Enterprise: Can customize

**Theme Hook Exports:**
- `useTheme()` - Get theme values
- `useThemeStyles()` - Get pre-built style objects

## Verification
- [x] `npm run build` succeeds without errors
- [x] CSS variables set correctly on tenant pages
- [x] Color picker works for Business+ tiers
- [x] Lower tiers see upgrade message for color customization
- [x] Default blue used when no custom color set

## Not Updated (Future Work)
- Dashboard page (uses dark theme with green accents - legacy design)
- Share pages (will be updated in 07-03)

## Next Steps
- Plan 07-03: Share Page Customization (apply tenant branding to public share pages)
