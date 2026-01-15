'use client';

import Link from 'next/link';

export default function SupportPage() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <span style={styles.badge}>Support</span>
          <h1 style={styles.heroTitle}>How Can We Help?</h1>
          <p style={styles.heroSubtitle}>
            Find answers to common questions, or get in touch with our support team.
            We're here to help you succeed.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.quickLinksGrid}>
            <Link href="/contact" style={styles.quickLinkCard}>
              <div style={styles.quickLinkIcon}>💬</div>
              <h3 style={styles.quickLinkTitle}>Contact Us</h3>
              <p style={styles.quickLinkText}>Send us a message and we'll respond within 24 hours</p>
            </Link>
            <a href="mailto:support@businessdashboard.com" style={styles.quickLinkCard}>
              <div style={styles.quickLinkIcon}>📧</div>
              <h3 style={styles.quickLinkTitle}>Email Support</h3>
              <p style={styles.quickLinkText}>support@businessdashboard.com</p>
            </a>
            <div style={styles.quickLinkCard}>
              <div style={styles.quickLinkIcon}>📱</div>
              <h3 style={styles.quickLinkTitle}>Telegram</h3>
              <p style={styles.quickLinkText}>Get notified instantly via Telegram for all alerts</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>

          <div style={styles.faqGrid}>
            <div style={styles.faqColumn}>
              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>How do I get started?</h3>
                <p style={styles.faqAnswer}>
                  Simply sign up for a free 7-day trial. No credit card required. Once registered,
                  you can set up your business profile, add your logo, and start creating estimates
                  and invoices right away.
                </p>
              </div>

              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>Can I import my existing data?</h3>
                <p style={styles.faqAnswer}>
                  Yes! You can import customer contacts from a CSV file. For historical invoices
                  and estimates, contact our support team and we'll help migrate your data.
                </p>
              </div>

              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>How do Telegram notifications work?</h3>
                <p style={styles.faqAnswer}>
                  Connect your Telegram account in settings. You'll receive instant notifications
                  when customers view your estimates or invoices, new booking requests come in,
                  or payments are received.
                </p>
              </div>

              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>Is my data secure?</h3>
                <p style={styles.faqAnswer}>
                  Absolutely. We use bank-level encryption (256-bit SSL) for all data transmission.
                  Your data is stored securely on UK-based servers and we never share it with
                  third parties.
                </p>
              </div>
            </div>

            <div style={styles.faqColumn}>
              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>Can I cancel my subscription anytime?</h3>
                <p style={styles.faqAnswer}>
                  Yes, you can cancel at any time with no penalties. Your data remains accessible
                  until the end of your billing period, and you can export everything before leaving.
                </p>
              </div>

              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>Do you offer refunds?</h3>
                <p style={styles.faqAnswer}>
                  We offer a full refund within the first 14 days if you're not satisfied.
                  No questions asked. After that, you can cancel anytime but refunds aren't
                  available for partial months.
                </p>
              </div>

              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>Can multiple people use one account?</h3>
                <p style={styles.faqAnswer}>
                  Our Business and Enterprise plans support multiple team members. Each user
                  gets their own login and you can assign permissions for what they can access.
                </p>
              </div>

              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>What payment methods do you accept?</h3>
                <p style={styles.faqAnswer}>
                  We accept all major credit and debit cards (Visa, Mastercard, American Express)
                  through our secure payment partner Stripe. We also support Direct Debit for
                  annual plans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Topics */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>Help by Topic</h2>
          <div style={styles.topicsGrid}>
            <div style={styles.topicCard}>
              <div style={styles.topicIcon}>📅</div>
              <h3 style={styles.topicTitle}>Bookings</h3>
              <ul style={styles.topicList}>
                <li>Creating appointments</li>
                <li>Managing your calendar</li>
                <li>Customer booking requests</li>
                <li>Reminders and notifications</li>
              </ul>
            </div>
            <div style={styles.topicCard}>
              <div style={styles.topicIcon}>📋</div>
              <h3 style={styles.topicTitle}>Estimates</h3>
              <ul style={styles.topicList}>
                <li>Creating professional quotes</li>
                <li>Saved items and rates</li>
                <li>Customer approvals</li>
                <li>Converting to invoices</li>
              </ul>
            </div>
            <div style={styles.topicCard}>
              <div style={styles.topicIcon}>💷</div>
              <h3 style={styles.topicTitle}>Invoices</h3>
              <ul style={styles.topicList}>
                <li>Sending invoices</li>
                <li>Payment tracking</li>
                <li>Automatic reminders</li>
                <li>Exporting for accounts</li>
              </ul>
            </div>
            <div style={styles.topicCard}>
              <div style={styles.topicIcon}>🧾</div>
              <h3 style={styles.topicTitle}>Receipts</h3>
              <ul style={styles.topicList}>
                <li>Scanning receipts</li>
                <li>Categorising expenses</li>
                <li>Linking to jobs</li>
                <li>Tax reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div style={styles.ctaGlow}></div>
          <h2 style={styles.ctaTitle}>Still Need Help?</h2>
          <p style={styles.ctaText}>
            Our support team is available Monday to Friday, 9am to 5pm GMT.
          </p>
          <Link href="/contact" style={styles.ctaButton}>
            Contact Support
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
  },
  hero: {
    padding: '80px 20px 40px',
    textAlign: 'center',
  },
  heroInner: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '100px',
    padding: '8px 20px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '24px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 16px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  heroSubtitle: {
    fontSize: '17px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.7,
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  section: {
    padding: '40px 20px',
  },
  sectionInner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 32px 0',
    fontFamily: '"Space Grotesk", sans-serif',
    textAlign: 'center',
  },
  quickLinksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  quickLinkCard: {
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  quickLinkIcon: {
    fontSize: '36px',
    marginBottom: '16px',
  },
  quickLinkTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 8px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  quickLinkText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  faqColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  faqCard: {
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  faqQuestion: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  faqAnswer: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.7,
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  topicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  topicCard: {
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  topicIcon: {
    fontSize: '32px',
    marginBottom: '16px',
  },
  topicTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 16px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  topicList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  ctaSection: {
    padding: '40px 20px 80px',
  },
  ctaCard: {
    position: 'relative',
    maxWidth: '500px',
    margin: '0 auto',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
  },
  ctaGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.5), transparent)',
  },
  ctaTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  ctaText: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0 0 24px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
};
