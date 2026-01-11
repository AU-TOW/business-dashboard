# Roadmap: Business Dashboard

## Overview

Transform the working AUTOW booking system into a multi-tenant SaaS platform for tradespeople. Starting with backups of both source projects (autow-booking + autow-parts-bot), we adapt the existing codebase for multi-tenancy, add subscription billing, and polish into a marketable product. The approach is "adapt, don't rebuild" — preserving all unique features like booking→estimate→invoice conversion flows and Telegram notifications.

## Domain Expertise

None (general web SaaS patterns)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation & Backup** - Backup source projects, set up business-dashboard structure
- [ ] **Phase 2: Multi-Tenancy Architecture** - Schema-per-tenant database, tenant identification
- [ ] **Phase 3: Authentication & Onboarding** - Magic link auth, signup flow, trade selection
- [ ] **Phase 4: Core Features (Tenant-Aware)** - Adapt bookings, estimates, invoices for multi-tenancy
- [ ] **Phase 5: Subscription & Billing** - Stripe integration, tier management, feature gating
- [ ] **Phase 6: Extended Features** - Receipts, Smart Jotter, Notes, Assessments
- [ ] **Phase 7: Branding & Customization** - Logo, settings, trade terminology, tiered branding
- [ ] **Phase 8: Landing Page & Polish** - Marketing site, share links, final touches

## Phase Details

### Phase 1: Foundation & Backup
**Goal**: Create timestamped backups of both source projects, copy autow-booking as the base codebase, initialize new project structure with proper git history
**Depends on**: Nothing (first phase)
**Research**: Unlikely (internal work, copying existing code)
**Plans**: TBD

Key tasks:
- Backup D:\Projects-AI\autow-booking → timestamped archive
- Backup D:\Projects-AI\AUTOW-ONLINE\autow-parts-bot → timestamped archive
- Copy autow-booking into business-dashboard
- Clean up AUTOW-specific branding/references
- Update package.json, README
- Verify build works

### Phase 2: Multi-Tenancy Architecture
**Goal**: Implement schema-per-tenant database isolation with tenant identification middleware
**Depends on**: Phase 1
**Research**: Likely (new architecture pattern)
**Research topics**: Postgres schema-per-tenant patterns, Supabase multi-tenancy, RLS policies, tenant context propagation
**Plans**: TBD

Key tasks:
- Design tenant schema creation workflow
- Implement tenant identification (subdomain or path-based)
- Create tenant context middleware
- Update all database queries to be tenant-aware
- Test data isolation

### Phase 3: Authentication & Onboarding
**Goal**: Replace basic auth with magic link, create signup flow with trade selection and business setup
**Depends on**: Phase 2
**Research**: Likely (Supabase Auth patterns)
**Research topics**: Supabase Auth magic links, passwordless flow, email templates, session management
**Plans**: TBD

Key tasks:
- Implement magic link authentication
- Create signup form with trade type dropdown
- Capture business details (name, logo, contact, bank)
- 7-day trial activation
- Welcome/onboarding flow

### Phase 4: Core Features (Tenant-Aware)
**Goal**: Adapt existing booking/estimate/invoice features to work with multi-tenancy, preserving all unique conversion flows
**Depends on**: Phase 3
**Research**: Unlikely (adapting existing working code)
**Plans**: TBD

Key tasks:
- Scope all queries to current tenant schema
- Preserve Booking → Estimate conversion (no re-entry)
- Preserve Estimate → Invoice conversion
- Preserve share links with Telegram notifications
- Update all API routes for tenant context
- Test all conversion flows work correctly

### Phase 5: Subscription & Billing
**Goal**: Integrate Stripe for subscription management, implement tier-based feature gating
**Depends on**: Phase 4
**Research**: Likely (Stripe integration)
**Research topics**: Stripe Subscriptions API, customer portal, webhook events, UK pricing, proration
**Plans**: TBD

Tiers to implement:
- Starter: £12/mo - 10 bookings, 1 Telegram bot, basic branding
- Pro: £29/mo - Unlimited bookings, Telegram, enhanced branding
- Business: £59/mo - Multi-user (3), receipts, 3 bots, custom colors
- Enterprise: £99/mo - Unlimited users, API, unlimited bots, custom domain

Key tasks:
- Stripe product/price setup
- Subscription creation on signup
- Webhook handling (payment success/failure)
- Feature gating middleware
- Grey-out locked features in UI
- Upgrade/downgrade flows

### Phase 6: Extended Features
**Goal**: Adapt receipts, Smart Jotter, Notes, and Assessments for multi-tenancy
**Depends on**: Phase 5
**Research**: Unlikely (adapting existing code, storage decision deferred)
**Plans**: TBD

Key tasks:
- Receipts with cloud storage (Supabase Storage or Google Drive - decide during implementation)
- Smart Jotter OCR with OpenAI
- Notes system
- Damage Assessments (automotive trade only - hide for others)
- Feature gating per tier

### Phase 7: Branding & Customization
**Goal**: Enable tenant-specific branding with tiered customization levels
**Depends on**: Phase 6
**Research**: Unlikely (internal patterns)
**Plans**: TBD

Branding by tier:
- Starter: Logo + business name + contact details
- Pro: + email templates customization
- Business: + primary color theming + custom share page styling
- Enterprise: + custom domain + full white-label

Key tasks:
- Logo upload and storage
- Business settings management
- Trade-specific terminology (Parts vs Materials vs Supplies)
- Dynamic theming based on tenant settings
- Share page customization

### Phase 8: Landing Page & Polish
**Goal**: Create marketing site based on autow-parts-bot template, final polish and launch prep
**Depends on**: Phase 7
**Research**: Unlikely (adapting existing template)
**Plans**: TBD

Key tasks:
- Adapt autow-parts-bot landing page for Business Dashboard
- Pricing page with tier comparison
- Feature showcase
- Signup CTA flow
- SEO and Open Graph metadata
- Final testing and bug fixes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Backup | 0/TBD | Not started | - |
| 2. Multi-Tenancy Architecture | 0/TBD | Not started | - |
| 3. Authentication & Onboarding | 0/TBD | Not started | - |
| 4. Core Features (Tenant-Aware) | 0/TBD | Not started | - |
| 5. Subscription & Billing | 0/TBD | Not started | - |
| 6. Extended Features | 0/TBD | Not started | - |
| 7. Branding & Customization | 0/TBD | Not started | - |
| 8. Landing Page & Polish | 0/TBD | Not started | - |
