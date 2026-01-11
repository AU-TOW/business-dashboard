# Business Dashboard

A multi-tenant SaaS platform that enables trade businesses to manage bookings, estimates, invoices, and receipts from one unified dashboard — with real-time Telegram notifications.

## Overview

Business Dashboard productizes a proven booking system for tradespeople across multiple industries. Businesses sign up, select their trade type, customize their branding, and get a complete business management solution without needing technical skills to set up.

**Live at:** [business-dashboard.autow-services.co.uk](https://business-dashboard.autow-services.co.uk)

## Key Features

### Core Functionality
- **Bookings** — Appointment scheduling with availability management
- **Estimates** — Professional quotes with line items and VAT calculation
- **Invoices** — Billing and payment tracking
- **Receipts** — Expense tracking with cloud storage
- **Smart Jotter** — AI-powered OCR for handwritten notes
- **Notes** — General note-taking system

### What Makes It Different

| Feature | How It Works | Why It Matters |
|---------|--------------|----------------|
| **Booking → Estimate** | One-click conversion, all data transfers | No re-entering customer/job info |
| **Estimate → Invoice** | Seamless quote-to-bill workflow | Saves time, reduces errors |
| **Share Links + Telegram** | Customer opens link → instant notification | Know when customers view documents |
| **OCR Receipt Import** | Snap photo → AI extracts data | Receipts become records instantly |
| **Smart Jotter → Booking** | Handwritten note → structured booking | Field notes become real bookings |

### Multi-Tenant Architecture
- Schema-per-tenant database isolation
- Complete data separation between businesses
- Trade-specific customization (terminology, fields)

### Trade Types Supported
- **Car Mechanic** — Vehicle fields, "Parts" terminology
- **Plumber** — "Materials" terminology
- **Electrician** — "Components" terminology
- **Builder** — "Supplies" terminology
- **General Trades** — Customizable terminology

## Subscription Tiers

| Tier | Price | Bookings | Telegram Bots | Branding | Users |
|------|-------|----------|---------------|----------|-------|
| **Starter** | £12/mo | 10/month | 1 | Logo + contact | 1 |
| **Pro** | £29/mo | Unlimited | 1 | + Email templates | 1 |
| **Business** | £59/mo | Unlimited | 3 | + Custom colors | 3 |
| **Enterprise** | £99/mo | Unlimited | Unlimited | + Custom domain | Unlimited |

All plans include a **7-day free trial**.

### Feature Visibility
All features are visible in the UI regardless of tier — locked features appear greyed out with upgrade prompts. This shows the full value of the platform and encourages upgrades.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Database:** PostgreSQL via Supabase (schema-per-tenant)
- **Authentication:** Magic link (passwordless)
- **Payments:** Stripe subscriptions
- **Notifications:** Telegram Bot API
- **Storage:** Supabase Storage / Google Drive
- **AI:** OpenAI API (Smart Jotter OCR)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)
- Telegram Bot Token

### Installation

```bash
# Clone the repository
git clone https://github.com/AU-TOW/business-dashboard.git
cd business-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=your_supabase_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payments
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token

# AI (Smart Jotter)
OPENAI_API_KEY=your_openai_key
```

## Project Structure

```
business-dashboard/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── share/             # Public share pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── features/         # Feature-specific components
├── lib/                   # Utilities and helpers
├── database/             # Database schemas and migrations
└── public/               # Static assets
```

## Roadmap

- [x] Phase 1: Foundation & Backup
- [ ] Phase 2: Multi-Tenancy Architecture
- [ ] Phase 3: Authentication & Onboarding
- [ ] Phase 4: Core Features (Tenant-Aware)
- [ ] Phase 5: Subscription & Billing
- [ ] Phase 6: Extended Features
- [ ] Phase 7: Branding & Customization
- [ ] Phase 8: Landing Page & Polish

## Contributing

This is a private project. Contact the repository owner for contribution guidelines.

## License

Proprietary — All rights reserved.

## Support

For support inquiries, contact via the dashboard or Telegram.

---

*Built with the "adapt, don't rebuild" philosophy — preserving proven functionality while scaling for multi-tenancy.*
