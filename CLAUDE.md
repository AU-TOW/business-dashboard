# Business Dashboard - Project Instructions

## Project Overview

Multi-tenant SaaS platform for trade businesses. Enables booking, estimate, invoice, and receipt management with Telegram notifications.

**Repository:** https://github.com/AU-TOW/business-dashboard
**Live URL:** https://business-dashboard.autow-services.co.uk

## Core Principle

**Adapt, Don't Rebuild** — This project was created from the working autow-booking system. Preserve all unique features while adapting for multi-tenancy.

## Key Features to Preserve

| Feature | Flow |
|---------|------|
| Booking → Estimate | One-click conversion, no data re-entry |
| Estimate → Invoice | Seamless quote-to-bill workflow |
| Share Links + Telegram | Customer views → instant notification |
| OCR Receipt Import | Photo → AI parse → cloud storage |
| Smart Jotter → Booking | Handwritten note → structured booking |

## Architecture

- **Database:** Schema-per-tenant (Postgres schemas in Supabase)
- **Auth:** Magic link (passwordless via Supabase Auth)
- **Payments:** Stripe subscriptions
- **Stack:** Next.js 14 (App Router), TypeScript, Supabase

## Subscription Tiers

| Tier | Price | Bookings | Telegram Bots | Users |
|------|-------|----------|---------------|-------|
| Starter | £12/mo | 10/month | 1 | 1 |
| Pro | £29/mo | Unlimited | 1 | 1 |
| Business | £59/mo | Unlimited | 3 | 3 |
| Enterprise | £99/mo | Unlimited | Unlimited | Unlimited |

## Trade Types

- Car Mechanic (shows vehicle fields, uses "Parts")
- Plumber (uses "Materials")
- Electrician (uses "Components")
- Builder (uses "Supplies")
- General Trades (customizable)

## Project Structure

```
business-dashboard/
├── .planning/           # GSD planning files
│   ├── PROJECT.md      # Project specification
│   ├── ROADMAP.md      # 8-phase roadmap
│   ├── STATE.md        # Current progress
│   └── phases/         # Phase plans
├── app/                # Next.js App Router
├── components/         # React components
├── lib/                # Utilities
├── database/           # Schemas and migrations
└── migrations/         # SQL migrations
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run linter
```

## Planning System

This project uses GSD (Get Shit Done) planning:
- `/gsd:plan-phase N` — Create plan for phase N
- `/gsd:execute-plan` — Execute current plan
- `/gsd:progress` — Check project status

## Current Phase

See `.planning/STATE.md` for current position.
