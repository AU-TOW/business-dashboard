# Business Dashboard

## What This Is

A multi-tenant SaaS platform that productizes the AUTOW booking system for tradespeople across multiple industries. Businesses sign up, select their trade type, customize their branding, and get a complete booking/invoicing/receipts dashboard. Features are visible but greyed out based on subscription tier to encourage upgrades.

## Core Value

**Enable any trade business to manage bookings, estimates, invoices, and receipts from one dashboard with Telegram notifications - without needing technical skills to set up.**

## Requirements

### Validated

(None yet - ship to validate)

### Active

**Multi-Tenancy & Isolation**
- [ ] Schema-per-tenant database architecture (Postgres schemas)
- [ ] Tenant identification via subdomain or path
- [ ] Complete data isolation between businesses

**Signup & Onboarding**
- [ ] Landing page showcasing all features (based on autow-parts-bot pattern)
- [ ] Trade type selection dropdown (Car Mechanic, Plumber, Electrician, Builder, General Trades)
- [ ] Business details capture (name, logo, contact info, bank details)
- [ ] Magic link (passwordless) authentication
- [ ] 7-day free trial activation

**Subscription Tiers**
- [ ] Starter: £12/mo - 10 bookings, 1 Telegram bot, basic branding
- [ ] Pro: £29/mo - Unlimited bookings, Telegram, enhanced branding
- [ ] Business: £59/mo - Multi-user (3 seats), receipts, 3 Telegram bots, custom colors
- [ ] Enterprise: £99/mo - Unlimited users, API access, unlimited bots, priority support, custom domain option
- [ ] Stripe integration for subscription billing

**Feature Gating**
- [ ] All features visible in UI
- [ ] Locked features greyed out with upgrade prompt
- [ ] Tier-based access control middleware

**Core Features (from AUTOW Booking)**
- [ ] Bookings - appointments with availability checking
- [ ] Estimates - quotes with line items, VAT calculation, share links
- [ ] Invoices - billing, payment tracking, share links
- [ ] Receipts - expense tracking with cloud storage
- [ ] Smart Jotter - AI-powered OCR notes
- [ ] Notes - general note-taking system
- [ ] Damage Assessments - (automotive-only, hidden for other trades)

**Trade-Specific Customization**
- [ ] Vehicle fields shown/hidden based on trade type
- [ ] Line item labels customizable (Parts vs Materials vs Supplies)
- [ ] Trade-specific defaults set at signup, editable in settings

**Branding (Tiered)**
- [ ] Starter: Logo + business name + contact details
- [ ] Pro: Above + email templates customization
- [ ] Business: Above + primary color theming + custom share page styling
- [ ] Enterprise: Above + custom domain + full white-label (remove Business Dashboard branding)

**Telegram Integration (Tiered)**
- [ ] Starter: 1 Telegram bot connection
- [ ] Pro: 1 Telegram bot + richer notifications
- [ ] Business: 3 Telegram bot connections
- [ ] Enterprise: Unlimited bots + webhook integrations

**Share Links**
- [ ] Public estimate/invoice viewing (no auth required)
- [ ] Business branding on share pages
- [ ] Telegram notification when customer views document

### Out of Scope

- **Native mobile apps (iOS/Android)** - Web-only (responsive) for v1, mobile apps considered for v2+
- **Accounting integrations (Xero/QuickBooks/Sage)** - May add later based on demand
- **Custom payment provider** - Stripe for now, Tide integration considered later
- **AI phone calling (VAPI)** - Not relevant for general Business Dashboard
- **DVLA vehicle lookup** - Automotive-only feature, may add as premium add-on

## Context

### CRITICAL: Adapt, Don't Rebuild

This project is NOT built from scratch. We are:
1. **Backing up** autow-booking as the codebase foundation
2. **Backing up** autow-parts-bot landing/signup system as template
3. **Adapting** existing working code for multi-tenancy
4. **Preserving** all unique features that make the system valuable

### Key Differentiating Features (MUST PRESERVE)

| Feature | Flow | Why It's Special |
|---------|------|------------------|
| **Booking → Estimate** | Click convert → all data transfers | No re-entering customer/vehicle/job info |
| **Estimate → Invoice** | Click convert → all data transfers | Seamless quote-to-bill workflow |
| **Share Links + Telegram** | Generate link → customer opens → instant notification | Real-time awareness when customer views document |
| **OCR Receipt Import** | Photo → AI parse → Google Drive | Snap receipt, auto-extract supplier/amount/date |
| **Smart Jotter → Booking** | Handwritten note → AI OCR → structured booking | Field notes become real bookings instantly |

### Cloud Storage Strategy (Multi-Tenant)

**Decision needed:**
- **Supabase Storage** (Recommended) - Built-in, per-tenant buckets, no extra credentials
- **Shared Google Drive** - Tenant folders, simpler but shared service account
- **Tenant's own Google Drive** - Most isolated, requires each tenant to connect

**Source Projects:**
- `D:\Projects-AI\autow-booking` - Full booking/invoicing system (Next.js 14, PostgreSQL)
- `D:\Projects-AI\AUTOW-ONLINE\autow-parts-bot` - Landing page + signup flow (n8n workflows)

**Technical Foundation:**
- Next.js 14 (App Router) with TypeScript
- PostgreSQL via Supabase (schema-per-tenant)
- Stripe for subscription billing
- Magic link authentication (email-based, passwordless)
- Telegram Bot API for notifications
- Google Drive API for receipt storage (or Supabase Storage)
- OpenAI API for Smart Jotter OCR

**Trade Types (v1):**
1. Car Mechanic - Shows vehicle fields, uses "Parts"
2. Plumber - Hides vehicle fields, uses "Materials"
3. Electrician - Hides vehicle fields, uses "Components"
4. Builder - Hides vehicle fields, uses "Supplies"
5. General Trades - Hides vehicle fields, uses "Items" (customizable)

**Competitor Landscape:**
- ServiceM8: £24-120/mo - Popular in UK/AU
- Jobber: £20-90/mo - US-focused
- Tradify: £34/mo per user - UK-friendly
- **Our differentiator:** Telegram notifications, simpler pricing, UK-focused

## Constraints

- **Tech Stack**: Must use Next.js 14 + PostgreSQL (leverage existing autow-booking codebase)
- **Database**: Supabase (existing relationship, free tier available)
- **Payments**: Stripe (standard, well-documented, handles subscriptions)
- **Budget**: Bootstrap-friendly - minimize external service costs initially
- **Timeline**: No fixed deadline - ship incrementally, validate with real users

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Schema-per-tenant isolation | Better security than shared tables, more cost-effective than separate DBs | - Pending |
| Magic link authentication | Modern UX, no password management, reduces friction | - Pending |
| Feature visibility with grey-out | Shows value, encourages upgrades, better than hiding features | - Pending |
| 5 subscription tiers | Covers solo traders to enterprises, competitive pricing | - Pending |
| Start with 5 trade types | Manageable scope, covers major UK trades | - Pending |
| Stripe for payments | Industry standard, may switch to Tide later | - Pending |
| All features in v1 | Ambitious but provides complete solution from launch | - Pending |
| Vercel deployment (testing) | Use existing Vercel account for dev/testing, revisit for production scale | - Pending |
| Subdomain: business-dashboard.autow-services.co.uk | Separate from booking.autow-services.co.uk, clear branding | Live |
| Light theme only (no dark mode) | Clean, professional appearance for business users | - Pending |
| Glass UI design | Ultra modern glassmorphism with light blue backgrounds, futuristic aesthetic | - Pending |

---
*Last updated: 2026-01-11 — added UI design requirements*
