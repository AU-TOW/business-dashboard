#!/usr/bin/env python3
"""
Business Dashboard - User Management Script
Manage tenants in the database (add, remove, list)
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import argparse
from datetime import datetime, timedelta

# Database connection settings
DB_CONFIG = {
    "host": "aws-1-eu-west-1.pooler.supabase.com",
    "port": 5432,
    "database": "postgres",
    "user": "postgres.zzjgzvzkmuguelibdtzc",
    "password": "ai7Z5mXWpTd5ZLtG",
    "sslmode": "require"
}

VALID_TRADE_TYPES = ['car_mechanic', 'plumber', 'electrician', 'builder', 'general']
VALID_SUBSCRIPTION_TIERS = ['trial', 'starter', 'pro', 'business', 'enterprise']


def get_connection():
    """Get database connection"""
    return psycopg2.connect(**DB_CONFIG)


def generate_slug(business_name: str) -> str:
    """Generate URL-safe slug from business name"""
    import re
    slug = business_name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug[:50]


def generate_schema_name(slug: str) -> str:
    """Generate schema name from slug"""
    import re
    safe_name = re.sub(r'[^a-z0-9]', '_', slug.lower())
    return f"tenant_{safe_name}"


def list_tenants():
    """List all tenants"""
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, slug, business_name, email, trade_type,
                       subscription_tier, subscription_status, schema_name,
                       created_at
                FROM public.tenants
                ORDER BY created_at DESC
            """)
            tenants = cur.fetchall()

            if not tenants:
                print("No tenants found.")
                return

            print(f"\n{'='*80}")
            print(f"{'TENANTS':^80}")
            print(f"{'='*80}")

            for t in tenants:
                print(f"\n  Slug: {t['slug']}")
                print(f"  Business: {t['business_name']}")
                print(f"  Email: {t['email']}")
                print(f"  Trade: {t['trade_type']}")
                print(f"  Tier: {t['subscription_tier']} ({t['subscription_status']})")
                print(f"  Schema: {t['schema_name']}")
                print(f"  Created: {t['created_at']}")
                print(f"  {'-'*60}")

            print(f"\nTotal: {len(tenants)} tenant(s)")
    finally:
        conn.close()


def add_tenant(business_name: str, email: str, trade_type: str = 'general',
               subscription_tier: str = 'trial'):
    """Add a new tenant"""

    if trade_type not in VALID_TRADE_TYPES:
        print(f"Error: Invalid trade type. Must be one of: {', '.join(VALID_TRADE_TYPES)}")
        return False

    if subscription_tier not in VALID_SUBSCRIPTION_TIERS:
        print(f"Error: Invalid subscription tier. Must be one of: {', '.join(VALID_SUBSCRIPTION_TIERS)}")
        return False

    slug = generate_slug(business_name)
    schema_name = generate_schema_name(slug)

    # Trade type defaults
    trade_defaults = {
        'car_mechanic': {'parts_label': 'Parts', 'show_vehicle_fields': True},
        'plumber': {'parts_label': 'Materials', 'show_vehicle_fields': False},
        'electrician': {'parts_label': 'Components', 'show_vehicle_fields': False},
        'builder': {'parts_label': 'Supplies', 'show_vehicle_fields': False},
        'general': {'parts_label': 'Items', 'show_vehicle_fields': False},
    }

    defaults = trade_defaults.get(trade_type, trade_defaults['general'])

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # Check if slug exists
            cur.execute("SELECT 1 FROM public.tenants WHERE slug = %s", (slug,))
            if cur.fetchone():
                print(f"Error: Tenant with slug '{slug}' already exists.")
                return False

            # Check if email exists
            cur.execute("SELECT 1 FROM public.tenants WHERE email = %s", (email,))
            if cur.fetchone():
                print(f"Error: Tenant with email '{email}' already exists.")
                return False

            # Calculate trial end date
            trial_ends_at = datetime.now() + timedelta(days=7) if subscription_tier == 'trial' else None

            # Insert tenant
            cur.execute("""
                INSERT INTO public.tenants (
                    slug, business_name, email, trade_type, subscription_tier,
                    subscription_status, schema_name, parts_label, show_vehicle_fields,
                    trial_ends_at, primary_color, max_bookings_per_month,
                    max_telegram_bots, max_users
                ) VALUES (
                    %s, %s, %s, %s, %s,
                    'active', %s, %s, %s,
                    %s, '#3b82f6', -1, 1, 1
                ) RETURNING id
            """, (
                slug, business_name, email, trade_type, subscription_tier,
                schema_name, defaults['parts_label'], defaults['show_vehicle_fields'],
                trial_ends_at
            ))

            tenant_id = cur.fetchone()[0]

            # Create schema
            cur.execute(f"CREATE SCHEMA IF NOT EXISTS {schema_name}")

            # Create basic tables in schema
            cur.execute(f"""
                CREATE TABLE IF NOT EXISTS {schema_name}.bookings (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    customer_name TEXT NOT NULL,
                    customer_email TEXT,
                    customer_phone TEXT,
                    booking_date DATE NOT NULL,
                    status TEXT DEFAULT 'pending',
                    notes TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                )
            """)

            cur.execute(f"""
                CREATE TABLE IF NOT EXISTS {schema_name}.business_settings (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    setting_key TEXT UNIQUE NOT NULL,
                    setting_value JSONB,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                )
            """)

            conn.commit()

            print(f"\nTenant created successfully!")
            print(f"  ID: {tenant_id}")
            print(f"  Slug: {slug}")
            print(f"  Schema: {schema_name}")
            print(f"  Business: {business_name}")
            print(f"  Email: {email}")
            print(f"  Trade: {trade_type}")
            print(f"  Tier: {subscription_tier}")

            return True

    except Exception as e:
        conn.rollback()
        print(f"Error creating tenant: {e}")
        return False
    finally:
        conn.close()


def remove_tenant(slug: str, force: bool = False):
    """Remove a tenant and their schema"""

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Get tenant info
            cur.execute("""
                SELECT id, slug, business_name, email, schema_name
                FROM public.tenants WHERE slug = %s
            """, (slug,))
            tenant = cur.fetchone()

            if not tenant:
                print(f"Error: Tenant with slug '{slug}' not found.")
                return False

            print(f"\nTenant to remove:")
            print(f"  Slug: {tenant['slug']}")
            print(f"  Business: {tenant['business_name']}")
            print(f"  Email: {tenant['email']}")
            print(f"  Schema: {tenant['schema_name']}")

            if not force:
                confirm = input("\nAre you sure you want to delete this tenant? (yes/no): ")
                if confirm.lower() != 'yes':
                    print("Cancelled.")
                    return False

            # Drop schema
            schema_name = tenant['schema_name']
            cur.execute(f"DROP SCHEMA IF EXISTS {schema_name} CASCADE")

            # Delete tenant record
            cur.execute("DELETE FROM public.tenants WHERE slug = %s", (slug,))

            conn.commit()

            print(f"\nTenant '{slug}' removed successfully.")
            return True

    except Exception as e:
        conn.rollback()
        print(f"Error removing tenant: {e}")
        return False
    finally:
        conn.close()


def update_tenant(slug: str, **kwargs):
    """Update tenant properties"""

    valid_fields = ['business_name', 'email', 'trade_type', 'subscription_tier',
                    'subscription_status', 'primary_color']

    updates = {k: v for k, v in kwargs.items() if v is not None and k in valid_fields}

    if not updates:
        print("No valid fields to update.")
        return False

    if 'trade_type' in updates and updates['trade_type'] not in VALID_TRADE_TYPES:
        print(f"Error: Invalid trade type. Must be one of: {', '.join(VALID_TRADE_TYPES)}")
        return False

    if 'subscription_tier' in updates and updates['subscription_tier'] not in VALID_SUBSCRIPTION_TIERS:
        print(f"Error: Invalid subscription tier. Must be one of: {', '.join(VALID_SUBSCRIPTION_TIERS)}")
        return False

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # Check tenant exists
            cur.execute("SELECT 1 FROM public.tenants WHERE slug = %s", (slug,))
            if not cur.fetchone():
                print(f"Error: Tenant with slug '{slug}' not found.")
                return False

            # Build update query
            set_clauses = [f"{k} = %s" for k in updates.keys()]
            set_clauses.append("updated_at = NOW()")

            query = f"UPDATE public.tenants SET {', '.join(set_clauses)} WHERE slug = %s"
            values = list(updates.values()) + [slug]

            cur.execute(query, values)
            conn.commit()

            print(f"\nTenant '{slug}' updated successfully.")
            for k, v in updates.items():
                print(f"  {k}: {v}")

            return True

    except Exception as e:
        conn.rollback()
        print(f"Error updating tenant: {e}")
        return False
    finally:
        conn.close()


def main():
    parser = argparse.ArgumentParser(description='Business Dashboard - User Management')
    subparsers = parser.add_subparsers(dest='command', help='Commands')

    # List command
    subparsers.add_parser('list', help='List all tenants')

    # Add command
    add_parser = subparsers.add_parser('add', help='Add a new tenant')
    add_parser.add_argument('--business', '-b', required=True, help='Business name')
    add_parser.add_argument('--email', '-e', required=True, help='Email address')
    add_parser.add_argument('--trade', '-t', default='general',
                          choices=VALID_TRADE_TYPES, help='Trade type')
    add_parser.add_argument('--tier', default='trial',
                          choices=VALID_SUBSCRIPTION_TIERS, help='Subscription tier')

    # Remove command
    remove_parser = subparsers.add_parser('remove', help='Remove a tenant')
    remove_parser.add_argument('slug', help='Tenant slug to remove')
    remove_parser.add_argument('--force', '-f', action='store_true',
                              help='Skip confirmation')

    # Update command
    update_parser = subparsers.add_parser('update', help='Update a tenant')
    update_parser.add_argument('slug', help='Tenant slug to update')
    update_parser.add_argument('--business', '-b', help='New business name')
    update_parser.add_argument('--email', '-e', help='New email')
    update_parser.add_argument('--trade', '-t', choices=VALID_TRADE_TYPES, help='Trade type')
    update_parser.add_argument('--tier', choices=VALID_SUBSCRIPTION_TIERS, help='Subscription tier')
    update_parser.add_argument('--status', choices=['active', 'past_due', 'cancelled', 'paused'],
                              help='Subscription status')

    args = parser.parse_args()

    if args.command == 'list':
        list_tenants()
    elif args.command == 'add':
        add_tenant(args.business, args.email, args.trade, args.tier)
    elif args.command == 'remove':
        remove_tenant(args.slug, args.force)
    elif args.command == 'update':
        update_tenant(args.slug,
                     business_name=args.business,
                     email=args.email,
                     trade_type=args.trade,
                     subscription_tier=args.tier,
                     subscription_status=args.status)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
