'use client';

import Link from 'next/link';
import Image from 'next/image';

// JSON-LD structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Business Dashboard',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '12',
    highPrice: '99',
    priceCurrency: 'GBP',
    offerCount: 4,
  },
  description: 'All-in-one dashboard for tradespeople. Manage bookings, estimates, invoices, and receipts with Telegram notifications.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '50',
  },
};

export default function LandingPage() {
  return (
    <div style={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section style={styles.hero} aria-labelledby="hero-heading">
        {/* Animated Background Elements */}
        <div style={styles.heroBackground}>
          <div style={styles.glowOrb1}></div>
          <div style={styles.glowOrb2}></div>
          <div style={styles.glowOrb3}></div>
        </div>

        <div style={styles.heroInner} className="hero-inner">
          <div style={styles.heroContent} className="hero-content">
            <div style={styles.badge}>
              <span style={styles.badgeDot}></span>
              Built for UK Tradespeople
            </div>
            <h1 id="hero-heading" style={styles.heroTitle} className="hero-title">
              <span style={styles.heroTitleGradient}>Manage Your Trade</span>
              <br />
              <span style={styles.heroTitleWhite}>Business in One Place</span>
            </h1>
            <p style={styles.heroSubtitle} className="hero-subtitle">
              The all-in-one platform for mechanics, plumbers, electricians, and builders.
              Handle bookings, estimates, invoices, and expenses — with instant Telegram alerts
              when customers view your documents.
            </p>
            <div style={styles.heroCtas} className="hero-ctas" role="group" aria-label="Get started options">
              <Link
                href="/signup"
                style={styles.primaryCta}
                className="primary-cta"
                aria-label="Start your free trial - no credit card required"
              >
                <span style={styles.ctaGlow}></span>
                <span style={styles.ctaText}>Start Free Trial</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                href="#pricing"
                style={styles.secondaryCta}
                className="secondary-cta"
                aria-label="View pricing plans"
              >
                See Pricing
              </Link>
            </div>
            <div style={styles.trustIndicators} className="trust-indicators">
              <div style={styles.trustItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.6)">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>7-Day Free Trial</span>
              </div>
              <div style={styles.trustItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.6)">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>No Credit Card</span>
              </div>
              <div style={styles.trustItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.6)">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
          <div style={styles.heroVisual} className="hero-visual">
            <div style={styles.imageWrapper}>
              <div style={styles.imageBorder}></div>
              <Image
                src="/assets/splash.png"
                alt="Dashboard preview showing invoices, estimates and booking management"
                width={600}
                height={450}
                style={styles.heroImage}
                priority
              />
              <div style={styles.imageGlow}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={styles.problemSection} aria-labelledby="problem-heading">
        <div style={styles.problemInner}>
          <div style={styles.sectionHeader} className="section-header">
            <span style={styles.sectionLabel}>The Problem</span>
            <h2 id="problem-heading" style={styles.sectionTitle} className="section-title">
              Running a Trade Business is Hard Enough
            </h2>
            <p style={styles.sectionSubtitle} className="section-subtitle">
              Without the right tools, admin work takes over your evenings
            </p>
          </div>
          <div style={styles.problemGrid} className="problem-grid">
            <div style={styles.problemCard} className="problem-card">
              <div style={styles.problemIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="1.5">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
              </div>
              <h3 style={styles.problemTitle}>Paper Receipts Everywhere</h3>
              <p style={styles.problemText}>Shoeboxes full of receipts that you'll "sort later" — until tax time hits and you're scrambling.</p>
            </div>
            <div style={styles.problemCard} className="problem-card">
              <div style={styles.problemIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
                </svg>
              </div>
              <h3 style={styles.problemTitle}>Missed Appointments</h3>
              <p style={styles.problemText}>Double bookings, forgotten jobs, and customers left waiting because your diary is a mess.</p>
            </div>
            <div style={styles.problemCard} className="problem-card">
              <div style={styles.problemIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </div>
              <h3 style={styles.problemTitle}>Quotes That Vanish</h3>
              <p style={styles.problemText}>You send a quote and never know if they even opened it. Following up feels awkward.</p>
            </div>
            <div style={styles.problemCard} className="problem-card">
              <div style={styles.problemIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="1.5">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3 style={styles.problemTitle}>Chasing Payments</h3>
              <p style={styles.problemText}>Invoices on scraps of paper or forgotten entirely. Getting paid shouldn't be this hard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section style={styles.solutionSection} aria-labelledby="solution-heading">
        <div style={styles.solutionInner}>
          <div style={styles.sectionHeader} className="section-header">
            <span style={styles.sectionLabel}>The Solution</span>
            <h2 id="solution-heading" style={styles.sectionTitle} className="section-title">
              Your Business, Professionally Organised
            </h2>
            <p style={styles.sectionSubtitle} className="section-subtitle">
              One dashboard. All your admin. Zero stress.
            </p>
          </div>
          <div style={styles.solutionContent} className="solution-content">
            <div style={styles.solutionCard}>
              <div style={styles.solutionGlow}></div>
              <div style={styles.workspacePreview}>
                <div style={styles.workspaceUrl} className="workspace-url">
                  <span style={styles.urlLock}>🔒</span>
                  <span style={styles.urlText} className="url-text">yourbusiness.dashboard.com</span>
                </div>
                <p style={styles.workspaceDesc}>
                  Get your own branded workspace with a custom URL. Your customers see a professional
                  business — not a one-man-band with a notepad.
                </p>
              </div>
              <div style={styles.solutionFeatures}>
                <div style={styles.solutionFeature}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Professional branded invoices & quotes</span>
                </div>
                <div style={styles.solutionFeature}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Secure customer portal for approvals</span>
                </div>
                <div style={styles.solutionFeature}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Works on any device, anywhere</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Detailed */}
      <section id="features" style={styles.features} aria-labelledby="features-heading">
        <div style={styles.featuresInner}>
          <div style={styles.sectionHeader} className="section-header">
            <span style={styles.sectionLabel}>Features</span>
            <h2 id="features-heading" style={styles.sectionTitle} className="section-title">
              Everything You Need to Run Your Business
            </h2>
            <p style={styles.sectionSubtitle} className="section-subtitle">
              Powerful tools designed specifically for tradespeople
            </p>
          </div>

          {/* Feature 1: Bookings */}
          <div style={styles.featureRow} className="feature-row">
            <div style={styles.featureInfo}>
              <div style={styles.featureIconLarge}>
                <CalendarIcon size={32} />
              </div>
              <h3 style={styles.featureHeading}>Smart Booking System</h3>
              <p style={styles.featureText}>
                Never double-book or miss an appointment again. Our intelligent scheduling
                system shows your availability at a glance and lets customers request slots
                that work for both of you.
              </p>
              <ul style={styles.featureList}>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Calendar view with drag-and-drop scheduling
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Automatic reminders for upcoming jobs
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Customer booking requests via your link
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Travel time buffers between appointments
                </li>
              </ul>
            </div>
            <div style={styles.featureVisual} className="feature-visual">
              <div style={styles.featureCard} className="feature-card">
                <div style={styles.mockCalendar}>
                  <div style={styles.calendarHeader}>
                    <span>January 2025</span>
                  </div>
                  <div style={styles.calendarSlots}>
                    <div style={{...styles.calendarSlot, ...styles.slotBooked}}>9:00 - Boiler Service</div>
                    <div style={{...styles.calendarSlot, ...styles.slotAvailable}}>11:00 - Available</div>
                    <div style={{...styles.calendarSlot, ...styles.slotBooked}}>14:00 - Emergency Call</div>
                    <div style={{...styles.calendarSlot, ...styles.slotAvailable}}>16:00 - Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Estimates */}
          <div style={{...styles.featureRow, ...styles.featureRowReverse}} className="feature-row feature-row-reverse">
            <div style={styles.featureInfo}>
              <div style={styles.featureIconLarge}>
                <ClipboardIcon size={32} />
              </div>
              <h3 style={styles.featureHeading}>Professional Estimates</h3>
              <p style={styles.featureText}>
                Create polished, professional quotes in under a minute. Save your common
                items and rates, then generate estimates on-site while the customer watches.
                No more "I'll send that over later" — close the deal on the spot.
              </p>
              <ul style={styles.featureList}>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Pre-saved materials and labour rates
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Professional PDF generation
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  One-click convert to invoice
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Customer e-signature approval
                </li>
              </ul>
            </div>
            <div style={styles.featureVisual} className="feature-visual">
              <div style={styles.featureCard} className="feature-card">
                <div style={styles.mockQuote}>
                  <div style={styles.quoteHeader}>Estimate #2025-042</div>
                  <div style={styles.quoteLines}>
                    <div style={styles.quoteLine}>
                      <span>Boiler replacement</span>
                      <span>£1,200</span>
                    </div>
                    <div style={styles.quoteLine}>
                      <span>Labour (6hrs)</span>
                      <span>£360</span>
                    </div>
                    <div style={styles.quoteLine}>
                      <span>Parts & fittings</span>
                      <span>£145</span>
                    </div>
                    <div style={styles.quoteTotal}>
                      <span>Total</span>
                      <span>£1,705</span>
                    </div>
                  </div>
                  <div style={styles.quoteStatus}>✓ Customer Approved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Invoices */}
          <div style={styles.featureRow} className="feature-row">
            <div style={styles.featureInfo}>
              <div style={styles.featureIconLarge}>
                <InvoiceIcon size={32} />
              </div>
              <h3 style={styles.featureHeading}>Invoicing & Payments</h3>
              <p style={styles.featureText}>
                Get paid faster with professional invoices that customers actually pay.
                Track what's outstanding, send reminders, and see exactly who owes you
                money at any time.
              </p>
              <ul style={styles.featureList}>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  One-click invoicing from estimates
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Automatic payment reminders
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Payment tracking dashboard
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Export for your accountant
                </li>
              </ul>
            </div>
            <div style={styles.featureVisual} className="feature-visual">
              <div style={styles.featureCard} className="feature-card">
                <div style={styles.mockInvoiceStats}>
                  <div style={styles.statItem}>
                    <div style={styles.statLabel}>This Month</div>
                    <div style={styles.statValue}>£4,250</div>
                    <div style={styles.statSubtext}>12 invoices sent</div>
                  </div>
                  <div style={styles.statDivider}></div>
                  <div style={styles.statItem}>
                    <div style={styles.statLabel}>Outstanding</div>
                    <div style={{...styles.statValue, color: 'rgba(251, 191, 36, 0.9)'}}>£890</div>
                    <div style={styles.statSubtext}>3 awaiting payment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Receipts */}
          <div style={{...styles.featureRow, ...styles.featureRowReverse}} className="feature-row feature-row-reverse">
            <div style={styles.featureInfo}>
              <div style={styles.featureIconLarge}>
                <ReceiptIcon size={32} />
              </div>
              <h3 style={styles.featureHeading}>Receipt & Expense Tracking</h3>
              <p style={styles.featureText}>
                Snap a photo of any receipt and we'll extract the details automatically.
                No more shoeboxes of paper. Come tax time, everything's organised and
                ready for your accountant.
              </p>
              <ul style={styles.featureList}>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Photo capture with auto-extraction
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Categorise by job or expense type
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Running totals and reports
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Export for tax returns
                </li>
              </ul>
            </div>
            <div style={styles.featureVisual} className="feature-visual">
              <div style={styles.featureCard} className="feature-card">
                <div style={styles.mockReceipt}>
                  <div style={styles.receiptImage}>📷</div>
                  <div style={styles.receiptDetails}>
                    <div style={styles.receiptLine}>
                      <span style={styles.receiptLabel}>Vendor</span>
                      <span>Screwfix</span>
                    </div>
                    <div style={styles.receiptLine}>
                      <span style={styles.receiptLabel}>Amount</span>
                      <span>£87.50</span>
                    </div>
                    <div style={styles.receiptLine}>
                      <span style={styles.receiptLabel}>Category</span>
                      <span>Materials</span>
                    </div>
                    <div style={styles.receiptLine}>
                      <span style={styles.receiptLabel}>Job</span>
                      <span>Smith Kitchen</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 5: Telegram Alerts */}
          <div style={styles.featureRow} className="feature-row">
            <div style={styles.featureInfo}>
              <div style={styles.featureIconLarge}>
                <TelegramIcon size={32} />
              </div>
              <h3 style={styles.featureHeading}>Instant Telegram Alerts</h3>
              <p style={styles.featureText}>
                Know the moment a customer opens your quote or invoice. Get notified
                instantly on Telegram so you can follow up at exactly the right time —
                while you're still on their mind.
              </p>
              <ul style={styles.featureList}>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Real-time "viewed" notifications
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  New booking request alerts
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Payment received confirmations
                </li>
                <li style={styles.featureListItem}>
                  <span style={styles.checkmark}>✓</span>
                  Daily summary digest
                </li>
              </ul>
            </div>
            <div style={styles.featureVisual} className="feature-visual">
              <div style={styles.featureCard} className="feature-card">
                <div style={styles.mockTelegram}>
                  <div style={styles.telegramMessage}>
                    <div style={styles.telegramIcon}>📱</div>
                    <div style={styles.telegramContent}>
                      <div style={styles.telegramTitle}>Business Dashboard</div>
                      <div style={styles.telegramText}>
                        <strong>Quote Viewed!</strong><br/>
                        John Smith just opened your estimate #2025-042 for £1,705
                      </div>
                      <div style={styles.telegramTime}>Just now</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howItWorks} aria-labelledby="how-heading">
        <div style={styles.howInner}>
          <div style={styles.sectionHeader} className="section-header">
            <span style={styles.sectionLabel}>How It Works</span>
            <h2 id="how-heading" style={styles.sectionTitle} className="section-title">
              Up and Running in Minutes
            </h2>
            <p style={styles.sectionSubtitle} className="section-subtitle">
              No complicated setup. No training required.
            </p>
          </div>
          <div style={styles.howSteps} className="how-steps">
            <div style={styles.howStep}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Sign Up Free</h3>
              <p style={styles.stepText}>
                Enter your business name and email. No credit card needed.
                Your dashboard is ready in seconds.
              </p>
            </div>
            <div style={styles.howStepConnector}></div>
            <div style={styles.howStep}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Add Your Details</h3>
              <p style={styles.stepText}>
                Upload your logo, set your rates, and customise your invoice template.
                Takes about 5 minutes.
              </p>
            </div>
            <div style={styles.howStepConnector}></div>
            <div style={styles.howStep}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Start Using It</h3>
              <p style={styles.stepText}>
                Create your first estimate, book your first job, or snap a receipt.
                You're in business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Types */}
      <section style={styles.tradesSection} aria-labelledby="trades-heading">
        <div style={styles.tradesInner}>
          <div style={styles.sectionHeader} className="section-header">
            <span style={styles.sectionLabel}>Built For</span>
            <h2 id="trades-heading" style={styles.sectionTitle} className="section-title">
              Every Trade, One Platform
            </h2>
            <p style={styles.sectionSubtitle} className="section-subtitle">
              Tailored workflows for how you actually work
            </p>
          </div>
          <div style={styles.tradesGrid} className="trades-grid">
            <div style={styles.tradeCard} className="trade-card">
              <span style={styles.tradeEmoji}>🚗</span>
              <h3 style={styles.tradeName}>Mechanics</h3>
              <p style={styles.tradeDesc}>Vehicle service logs, MOT reminders, parts tracking</p>
            </div>
            <div style={styles.tradeCard} className="trade-card">
              <span style={styles.tradeEmoji}>🔧</span>
              <h3 style={styles.tradeName}>Plumbers</h3>
              <p style={styles.tradeDesc}>Emergency callouts, parts lists, boiler service records</p>
            </div>
            <div style={styles.tradeCard} className="trade-card">
              <span style={styles.tradeEmoji}>⚡</span>
              <h3 style={styles.tradeName}>Electricians</h3>
              <p style={styles.tradeDesc}>Certificate generation, test records, compliance tracking</p>
            </div>
            <div style={styles.tradeCard} className="trade-card">
              <span style={styles.tradeEmoji}>🏗️</span>
              <h3 style={styles.tradeName}>Builders</h3>
              <p style={styles.tradeDesc}>Project phases, material costs, subcontractor payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={styles.pricingSection} aria-labelledby="pricing-heading">
        <div style={styles.pricingInner}>
          <div style={styles.sectionHeader} className="section-header">
            <span style={styles.sectionLabel}>Pricing</span>
            <h2 id="pricing-heading" style={styles.sectionTitle} className="section-title">
              Simple, Transparent Pricing
            </h2>
            <p style={styles.sectionSubtitle} className="section-subtitle">
              Start free. Upgrade when you're ready. Cancel anytime.
            </p>
          </div>

          <div style={styles.pricingToggle}>
            <span style={styles.pricingToggleText}>All plans include 7-day free trial</span>
          </div>

          <div style={styles.pricingGrid} className="pricing-grid">
            {/* Starter Plan */}
            <div style={styles.pricingCard} className="pricing-card">
              <div style={styles.pricingCardInner}>
                <div style={styles.planHeader}>
                  <h3 style={styles.planName}>Starter</h3>
                  <p style={styles.planDesc}>Perfect for solo tradespeople just getting started</p>
                </div>
                <div style={styles.planPricing}>
                  <span style={styles.planCurrency}>£</span>
                  <span style={styles.planPrice}>12</span>
                  <span style={styles.planPeriod}>/month</span>
                </div>
                <ul style={styles.planFeatures}>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Up to 50 bookings/month
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Unlimited estimates & invoices
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Receipt scanning (50/month)
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Telegram notifications
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Your branded workspace
                  </li>
                </ul>
                <Link href="/signup" style={styles.planButton}>
                  Start Free Trial
                </Link>
              </div>
            </div>

            {/* Professional Plan - Popular */}
            <div style={{...styles.pricingCard, ...styles.pricingCardPopular}} className="pricing-card pricing-card-popular">
              <div style={styles.popularBadge}>Most Popular</div>
              <div style={styles.pricingCardInner}>
                <div style={styles.planHeader}>
                  <h3 style={styles.planName}>Professional</h3>
                  <p style={styles.planDesc}>For established tradespeople growing their business</p>
                </div>
                <div style={styles.planPricing}>
                  <span style={styles.planCurrency}>£</span>
                  <span style={styles.planPrice}>29</span>
                  <span style={styles.planPeriod}>/month</span>
                </div>
                <ul style={styles.planFeatures}>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Unlimited bookings
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Unlimited estimates & invoices
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Unlimited receipt scanning
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Telegram notifications
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Customer portal
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Automated payment reminders
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Priority support
                  </li>
                </ul>
                <Link href="/signup?plan=professional" style={{...styles.planButton, ...styles.planButtonPopular}}>
                  Start Free Trial
                </Link>
              </div>
            </div>

            {/* Business Plan */}
            <div style={styles.pricingCard} className="pricing-card">
              <div style={styles.pricingCardInner}>
                <div style={styles.planHeader}>
                  <h3 style={styles.planName}>Business</h3>
                  <p style={styles.planDesc}>For small teams and growing operations</p>
                </div>
                <div style={styles.planPricing}>
                  <span style={styles.planCurrency}>£</span>
                  <span style={styles.planPrice}>49</span>
                  <span style={styles.planPeriod}>/month</span>
                </div>
                <ul style={styles.planFeatures}>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Everything in Professional
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Up to 3 team members
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Team scheduling & assignments
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Advanced reporting
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Multi-location support
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Accountant export tools
                  </li>
                </ul>
                <Link href="/signup?plan=business" style={styles.planButton}>
                  Start Free Trial
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div style={styles.pricingCard} className="pricing-card">
              <div style={styles.pricingCardInner}>
                <div style={styles.planHeader}>
                  <h3 style={styles.planName}>Enterprise</h3>
                  <p style={styles.planDesc}>For larger teams with custom needs</p>
                </div>
                <div style={styles.planPricing}>
                  <span style={styles.planCurrency}>£</span>
                  <span style={styles.planPrice}>99</span>
                  <span style={styles.planPeriod}>/month</span>
                </div>
                <ul style={styles.planFeatures}>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Everything in Business
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Unlimited team members
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Custom integrations
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    API access
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    Dedicated account manager
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    White-label options
                  </li>
                  <li style={styles.planFeature}>
                    <span style={styles.featureCheck}>✓</span>
                    SLA guarantee
                  </li>
                </ul>
                <Link href="/signup?plan=enterprise" style={styles.planButton}>
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

          <div style={styles.pricingFooter} className="pricing-footer">
            <p style={styles.pricingFooterText}>
              All prices exclude VAT. Need something custom? <a href="mailto:hello@businessdashboard.com" style={styles.pricingFooterLink}>Get in touch</a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection} aria-labelledby="cta-heading">
        <div style={styles.ctaInner} className="cta-inner">
          <div style={styles.ctaGlowBg}></div>
          <h2 id="cta-heading" style={styles.ctaTitle} className="cta-title">
            Ready to Take Control of Your Business?
          </h2>
          <p style={styles.ctaSubtitle} className="cta-subtitle">
            Join hundreds of UK tradespeople who've ditched the paperwork
          </p>
          <div style={styles.ctaPricing}>
            <span style={styles.ctaPriceFrom}>From just</span>
            <span style={styles.ctaPrice}>£12/month</span>
            <span style={styles.ctaPriceNote}>after your free trial</span>
          </div>
          <Link
            href="/signup"
            style={styles.ctaButton}
            className="cta-button"
            aria-label="Get started with your free trial"
          >
            Start Your Free Trial
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <p style={styles.ctaNote}>No credit card required • Cancel anytime</p>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(79, 209, 197, 0.3); }
          50% { box-shadow: 0 0 60px rgba(79, 209, 197, 0.5); }
        }

        .feature-card:hover, .problem-card:hover, .trade-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        }

        /* Desktop - Large screens */
        @media (min-width: 1025px) {
          .hero-inner {
            grid-template-columns: 1fr 1fr !important;
          }
          .problem-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .feature-row {
            grid-template-columns: 1fr 1fr !important;
          }
          .feature-row-reverse {
            direction: rtl;
          }
          .feature-row-reverse > * {
            direction: ltr;
          }
          .how-steps {
            flex-direction: row !important;
          }
          .trades-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .pricing-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .pricing-card-popular {
            padding-top: 32px;
          }
        }

        /* Tablet - Medium screens */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-inner {
            grid-template-columns: 1fr !important;
            text-align: center;
            padding: 40px 20px !important;
            gap: 32px !important;
          }
          .hero-content {
            align-items: center !important;
          }
          .hero-visual {
            order: -1;
            max-width: 450px;
            margin: 0 auto;
          }
          .hero-title {
            font-size: 36px !important;
          }
          .hero-subtitle {
            font-size: 14px !important;
          }
          .trust-indicators {
            justify-content: center !important;
          }
          .problem-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .feature-row {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .feature-row-reverse {
            direction: ltr;
          }
          .how-steps {
            flex-direction: column !important;
            gap: 24px !important;
          }
          .trades-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          .pricing-card-popular {
            transform: scale(1) !important;
          }
          .section-title {
            font-size: 28px !important;
          }
          .cta-title {
            font-size: 28px !important;
          }
        }

        /* Mobile - Small screens */
        @media (max-width: 768px) {
          .hero-inner {
            grid-template-columns: 1fr !important;
            text-align: center;
            padding: 24px 14px !important;
            gap: 20px !important;
          }
          .hero-content {
            align-items: center !important;
            gap: 14px !important;
          }
          .hero-visual {
            order: -1;
            max-width: 320px;
            margin: 0 auto;
          }
          .hero-title {
            font-size: 26px !important;
            line-height: 1.2 !important;
          }
          .hero-subtitle {
            font-size: 12px !important;
            line-height: 1.6 !important;
            max-width: 300px !important;
          }
          .hero-ctas {
            flex-direction: column !important;
            width: 100%;
            gap: 10px !important;
          }
          .hero-ctas a, .primary-cta, .secondary-cta {
            width: 100% !important;
            justify-content: center !important;
            padding: 12px 20px !important;
            font-size: 13px !important;
          }
          .trust-indicators {
            justify-content: center !important;
            gap: 12px !important;
            flex-wrap: wrap !important;
          }
          .trust-indicators > div {
            font-size: 10px !important;
          }
          .problem-grid {
            grid-template-columns: 1fr !important;
          }
          .feature-row {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 20px !important;
          }
          .feature-row-reverse {
            direction: ltr;
          }
          .feature-visual {
            order: -1 !important;
          }
          .how-steps {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .trades-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          .pricing-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .pricing-card-popular {
            transform: scale(1) !important;
            order: -1;
          }
          .section-header {
            margin-bottom: 24px !important;
          }
          .section-title {
            font-size: 20px !important;
            margin-bottom: 8px !important;
          }
          .section-subtitle {
            font-size: 12px !important;
          }
          .cta-inner {
            padding: 28px 18px !important;
            border-radius: 18px !important;
          }
          .cta-title {
            font-size: 20px !important;
            margin-bottom: 8px !important;
          }
          .cta-subtitle {
            font-size: 12px !important;
            margin-bottom: 16px !important;
          }
          .cta-button {
            padding: 12px 24px !important;
            font-size: 13px !important;
          }
          .workspace-url {
            padding: 10px 14px !important;
          }
          .url-text {
            font-size: 11px !important;
          }
        }

        /* Extra small screens */
        @media (max-width: 380px) {
          .hero-title {
            font-size: 22px !important;
          }
          .hero-subtitle {
            font-size: 11px !important;
          }
          .section-title {
            font-size: 18px !important;
          }
          .cta-title {
            font-size: 18px !important;
          }
          .trades-grid {
            grid-template-columns: 1fr !important;
          }
          .workspace-url {
            padding: 8px 12px !important;
          }
          .url-text {
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

// Icon Components
function CalendarIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function ClipboardIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
      <line x1="8" y1="16" x2="12" y2="16"/>
    </svg>
  );
}

function InvoiceIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="12" y1="18" x2="12" y2="12"/>
      <line x1="9" y1="15" x2="15" y2="15"/>
    </svg>
  );
}

function ReceiptIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5">
      {/* Receipt paper */}
      <path d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-2.5-1.5L14 20l-2.5-1.5L9 20l-2.5-1.5L4 20V4a2 2 0 0 1 1 0z"/>
      {/* Receipt content lines */}
      <line x1="8" y1="6" x2="16" y2="6"/>
      <line x1="8" y1="9" x2="16" y2="9"/>
      <line x1="8" y1="12" x2="12" y2="12"/>
      {/* Camera/scan indicator */}
      <circle cx="17" cy="17" r="4" fill="rgba(0,0,0,0.3)" stroke="rgba(255, 255, 255, 0.8)"/>
      <circle cx="17" cy="17" r="2" fill="rgba(255, 255, 255, 0.8)"/>
    </svg>
  );
}

function TelegramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.8)">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
  },
  // Hero Section
  hero: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
  },
  heroBackground: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
  glowOrb1: {
    position: 'absolute',
    top: '10%',
    right: '20%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'pulse 4s ease-in-out infinite',
  },
  glowOrb2: {
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    width: '250px',
    height: '250px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'pulse 4s ease-in-out infinite 2s',
  },
  glowOrb3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 60%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
  },
  heroInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 20px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    alignItems: 'flex-start',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '100px',
    padding: '6px 14px',
    fontSize: '11px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: '0.3px',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '50%',
    boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: 700,
    lineHeight: 1.15,
    margin: 0,
    fontFamily: '"Space Grotesk", sans-serif',
  },
  heroTitleGradient: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroTitleWhite: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroSubtitle: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.7,
    margin: 0,
    maxWidth: '480px',
    fontFamily: '"Outfit", sans-serif',
  },
  heroCtas: {
    display: 'flex',
    gap: '12px',
    marginTop: '6px',
  },
  primaryCta: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    letterSpacing: '0.3px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  ctaGlow: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  ctaText: {
    position: 'relative',
    zIndex: 1,
  },
  secondaryCta: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.8)',
    padding: '12px 24px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    letterSpacing: '0.3px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    transition: 'all 0.3s ease',
  },
  trustIndicators: {
    display: 'flex',
    gap: '18px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '11px',
    fontFamily: '"Outfit", sans-serif',
  },
  heroVisual: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
  },
  imageBorder: {
    position: 'absolute',
    inset: '-2px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(100, 180, 255, 0.4) 0%, rgba(100, 180, 255, 0.1) 100%)',
    zIndex: 0,
  },
  heroImage: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    borderRadius: '14px',
    border: '1px solid rgba(100, 180, 255, 0.2)',
    zIndex: 1,
  },
  imageGlow: {
    position: 'absolute',
    inset: '-15px',
    borderRadius: '30px',
    boxShadow: '0 0 60px rgba(100, 180, 255, 0.15), 0 0 40px rgba(100, 180, 255, 0.08)',
    zIndex: 0,
  },

  // Problem Section
  problemSection: {
    position: 'relative',
    padding: '80px 0',
  },
  problemInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  problemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  problemCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 15px rgba(100, 180, 255, 0.03)',
  },
  problemIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  problemTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 8px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  problemText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.6,
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },

  // Solution Section
  solutionSection: {
    position: 'relative',
    padding: '80px 0',
  },
  solutionInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  solutionContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  solutionCard: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(100, 180, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  solutionGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.6), transparent)',
  },
  workspacePreview: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  workspaceUrl: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '12px 20px',
    marginBottom: '16px',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  urlLock: {
    fontSize: '14px',
    flexShrink: 0,
  },
  urlText: {
    fontSize: '14px',
    fontFamily: '"Space Grotesk", monospace',
    color: 'rgba(255, 255, 255, 0.9)',
    wordBreak: 'break-all',
  },
  workspaceDesc: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.7,
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  solutionFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  solutionFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: '"Outfit", sans-serif',
  },

  // Features Section
  features: {
    position: 'relative',
    padding: '80px 0',
  },
  featuresInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionLabel: {
    display: 'inline-block',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '100px',
    padding: '6px 16px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.95)',
    margin: '0 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  featureRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    marginBottom: '80px',
  },
  featureRowReverse: {},
  featureInfo: {},
  featureIconLarge: {
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(100, 180, 255, 0.08)',
    border: '1px solid rgba(100, 180, 255, 0.25)',
    borderRadius: '16px',
    marginBottom: '20px',
    boxShadow: '0 0 15px rgba(100, 180, 255, 0.1)',
  },
  featureHeading: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  featureText: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.7,
    margin: '0 0 20px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  featureListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: '"Outfit", sans-serif',
  },
  checkmark: {
    color: 'rgba(74, 222, 128, 0.9)',
    fontWeight: 600,
  },
  featureVisual: {
    display: 'flex',
    justifyContent: 'center',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    width: '100%',
    maxWidth: '400px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 20px rgba(100, 180, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },

  // Mock UI Components
  mockCalendar: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  calendarHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  calendarSlots: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  calendarSlot: {
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontFamily: '"Outfit", sans-serif',
  },
  slotBooked: {
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    color: 'rgba(147, 197, 253, 0.9)',
  },
  slotAvailable: {
    background: 'rgba(74, 222, 128, 0.1)',
    border: '1px solid rgba(74, 222, 128, 0.2)',
    color: 'rgba(74, 222, 128, 0.9)',
  },
  mockQuote: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  quoteHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  quoteLines: {
    padding: '12px 16px',
  },
  quoteLine: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: '"Outfit", sans-serif',
  },
  quoteTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0 0 0',
    fontSize: '15px',
    fontWeight: 600,
    color: '#ffffff',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  quoteStatus: {
    padding: '12px 16px',
    background: 'rgba(74, 222, 128, 0.1)',
    color: 'rgba(74, 222, 128, 0.9)',
    fontSize: '12px',
    fontWeight: 600,
    textAlign: 'center',
    fontFamily: '"Outfit", sans-serif',
  },
  mockInvoiceStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '8px',
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'rgba(74, 222, 128, 0.9)',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  statSubtext: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '4px',
    fontFamily: '"Outfit", sans-serif',
  },
  statDivider: {
    width: '1px',
    height: '60px',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  mockReceipt: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  receiptImage: {
    width: '80px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
  },
  receiptDetails: {
    flex: 1,
  },
  receiptLine: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: '"Outfit", sans-serif',
  },
  receiptLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '11px',
  },
  mockTelegram: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '16px',
  },
  telegramMessage: {
    display: 'flex',
    gap: '12px',
  },
  telegramIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(59, 130, 246, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },
  telegramContent: {
    flex: 1,
  },
  telegramTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '4px',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  telegramText: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.5,
    fontFamily: '"Outfit", sans-serif',
  },
  telegramTime: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '6px',
    fontFamily: '"Outfit", sans-serif',
  },

  // How It Works
  howItWorks: {
    position: 'relative',
    padding: '80px 0',
  },
  howInner: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px',
  },
  howSteps: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '40px',
    flexDirection: 'row',
  },
  howStep: {
    flex: 1,
    textAlign: 'center',
  },
  stepNumber: {
    width: '48px',
    height: '48px',
    background: 'rgba(100, 180, 255, 0.1)',
    border: '1px solid rgba(100, 180, 255, 0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 700,
    color: '#ffffff',
    fontFamily: '"Space Grotesk", sans-serif',
    margin: '0 auto 16px',
    boxShadow: '0 0 20px rgba(100, 180, 255, 0.15)',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 8px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  stepText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.6,
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  howStepConnector: {
    width: '60px',
    height: '2px',
    background: 'linear-gradient(90deg, rgba(100, 180, 255, 0.1), rgba(100, 180, 255, 0.4), rgba(100, 180, 255, 0.1))',
    marginTop: '24px',
    flexShrink: 0,
    boxShadow: '0 0 8px rgba(100, 180, 255, 0.3)',
  },

  // Trades Section
  tradesSection: {
    position: 'relative',
    padding: '80px 0',
  },
  tradesInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  tradesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  tradeCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '28px 24px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 15px rgba(100, 180, 255, 0.03)',
  },
  tradeEmoji: {
    fontSize: '36px',
    display: 'block',
    marginBottom: '12px',
  },
  tradeName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 6px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  tradeDesc: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
    lineHeight: 1.5,
  },

  // CTA Section
  ctaSection: {
    position: 'relative',
    padding: '80px 20px',
    textAlign: 'center',
  },
  ctaInner: {
    position: 'relative',
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: '48px 40px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(100, 180, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  },
  ctaGlowBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.7), transparent)',
    boxShadow: '0 0 15px rgba(100, 180, 255, 0.4)',
  },
  ctaTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  ctaSubtitle: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: '0 0 24px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  ctaPricing: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '28px',
  },
  ctaPriceFrom: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: '"Outfit", sans-serif',
  },
  ctaPrice: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#ffffff',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  ctaPriceNote: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: '"Outfit", sans-serif',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    padding: '16px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  ctaNote: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '16px',
    margin: '16px 0 0 0',
    fontFamily: '"Outfit", sans-serif',
  },

  // Pricing Section
  pricingSection: {
    position: 'relative',
    padding: '80px 0',
  },
  pricingInner: {
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '0 20px',
  },
  pricingToggle: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '48px',
  },
  pricingToggleText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: '"Outfit", sans-serif',
    background: 'rgba(74, 222, 128, 0.1)',
    border: '1px solid rgba(74, 222, 128, 0.2)',
    padding: '8px 20px',
    borderRadius: '100px',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    alignItems: 'stretch',
  },
  pricingCard: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(100, 180, 255, 0.05)',
  },
  pricingCardPopular: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(100, 180, 255, 0.4)',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(100, 180, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.02)',
  },
  popularBadge: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    background: 'linear-gradient(90deg, rgba(100, 180, 255, 0.3), rgba(100, 180, 255, 0.15))',
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: '"Space Grotesk", sans-serif',
    textAlign: 'center',
    padding: '8px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    boxShadow: '0 2px 10px rgba(100, 180, 255, 0.2)',
  },
  pricingCardInner: {
    padding: '32px 24px',
  },
  planHeader: {
    marginBottom: '24px',
  },
  planName: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 8px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  planDesc: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    lineHeight: 1.5,
    fontFamily: '"Outfit", sans-serif',
  },
  planPricing: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '28px',
    paddingBottom: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  planCurrency: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: '"Space Grotesk", sans-serif',
    marginRight: '2px',
  },
  planPrice: {
    fontSize: '48px',
    fontWeight: 700,
    color: '#ffffff',
    fontFamily: '"Space Grotesk", sans-serif',
    lineHeight: 1,
  },
  planPeriod: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: '"Outfit", sans-serif',
    marginLeft: '4px',
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 28px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  planFeature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: '"Outfit", sans-serif',
    lineHeight: 1.4,
  },
  featureCheck: {
    color: 'rgba(74, 222, 128, 0.9)',
    fontWeight: 600,
    flexShrink: 0,
  },
  planButton: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    padding: '14px 20px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
  },
  planButtonPopular: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  },
  pricingFooter: {
    textAlign: 'center',
    marginTop: '48px',
  },
  pricingFooterText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: '"Outfit", sans-serif',
    margin: 0,
  },
  pricingFooterLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
};
