'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <span style={styles.badge}>Legal</span>
          <h1 style={styles.heroTitle}>Terms of Service</h1>
          <p style={styles.heroSubtitle}>
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={styles.section}>
        <div style={styles.contentCard}>
          <div style={styles.contentGlow}></div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>1. Agreement to Terms</h2>
            <p style={styles.paragraph}>
              By accessing or using Business Dashboard ("the Service"), you agree to be bound by these Terms of Service
              ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p style={styles.paragraph}>
              These Terms apply to all visitors, users, and others who access or use the Service. Business Dashboard
              is operated by Business Dashboard Ltd, a company registered in England and Wales.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>2. Description of Service</h2>
            <p style={styles.paragraph}>
              Business Dashboard provides a cloud-based business management platform for tradespeople and small businesses,
              including but not limited to:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Estimate and invoice creation and management</li>
              <li style={styles.listItem}>Receipt scanning and expense tracking</li>
              <li style={styles.listItem}>Appointment booking and calendar management</li>
              <li style={styles.listItem}>Customer relationship management</li>
              <li style={styles.listItem}>Telegram notifications and alerts</li>
              <li style={styles.listItem}>Business reporting and analytics</li>
            </ul>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>3. Account Registration</h2>
            <p style={styles.paragraph}>
              To use the Service, you must register for an account. You agree to:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Provide accurate, current, and complete information</li>
              <li style={styles.listItem}>Maintain and update your information to keep it accurate</li>
              <li style={styles.listItem}>Maintain the security of your account credentials</li>
              <li style={styles.listItem}>Accept responsibility for all activities under your account</li>
              <li style={styles.listItem}>Notify us immediately of any unauthorised access</li>
            </ul>
            <p style={styles.paragraph}>
              You must be at least 18 years old to create an account. By registering, you represent that you are
              of legal age to form a binding contract.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>4. Subscription and Payment</h2>
            <h3 style={styles.subTitle}>Free Trial</h3>
            <p style={styles.paragraph}>
              We offer a 7-day free trial for new users. No credit card is required to start your trial.
              At the end of the trial, you will need to subscribe to continue using the Service.
            </p>

            <h3 style={styles.subTitle}>Subscription Plans</h3>
            <p style={styles.paragraph}>
              Paid subscriptions are billed monthly or annually in advance. Prices are displayed on our
              pricing page and are subject to change with 30 days notice.
            </p>

            <h3 style={styles.subTitle}>Payment Processing</h3>
            <p style={styles.paragraph}>
              Payments are processed securely through Stripe. By subscribing, you authorise us to charge
              your payment method on a recurring basis until you cancel.
            </p>

            <h3 style={styles.subTitle}>Refund Policy</h3>
            <p style={styles.paragraph}>
              We offer a full refund within the first 14 days of your initial subscription if you're not
              satisfied. After this period, refunds are not available for partial months. You may cancel
              at any time and retain access until the end of your billing period.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>5. Acceptable Use</h2>
            <p style={styles.paragraph}>You agree not to use the Service to:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Violate any applicable laws or regulations</li>
              <li style={styles.listItem}>Infringe on the rights of others</li>
              <li style={styles.listItem}>Transmit malware, viruses, or harmful code</li>
              <li style={styles.listItem}>Attempt to gain unauthorised access to systems</li>
              <li style={styles.listItem}>Interfere with or disrupt the Service</li>
              <li style={styles.listItem}>Harvest or collect user information without consent</li>
              <li style={styles.listItem}>Send spam or unsolicited communications</li>
              <li style={styles.listItem}>Impersonate others or misrepresent your affiliation</li>
            </ul>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>6. Your Data</h2>
            <h3 style={styles.subTitle}>Ownership</h3>
            <p style={styles.paragraph}>
              You retain all rights to the data you input into the Service ("Your Data"). We claim no
              ownership over Your Data.
            </p>

            <h3 style={styles.subTitle}>Licence</h3>
            <p style={styles.paragraph}>
              You grant us a limited licence to use, process, and store Your Data solely for the purpose
              of providing the Service to you.
            </p>

            <h3 style={styles.subTitle}>Data Export</h3>
            <p style={styles.paragraph}>
              You may export Your Data at any time. Upon account termination, you will have 30 days to
              export Your Data before it is deleted.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>7. Intellectual Property</h2>
            <p style={styles.paragraph}>
              The Service and its original content (excluding Your Data), features, and functionality are
              owned by Business Dashboard Ltd and are protected by international copyright, trademark,
              patent, trade secret, and other intellectual property laws.
            </p>
            <p style={styles.paragraph}>
              Our trademarks and trade dress may not be used in connection with any product or service
              without prior written consent.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>8. Third-Party Services</h2>
            <p style={styles.paragraph}>
              The Service may integrate with third-party services (such as Stripe, Telegram, and email
              providers). Your use of these services is subject to their respective terms and privacy
              policies. We are not responsible for the practices of third parties.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>9. Service Availability</h2>
            <p style={styles.paragraph}>
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. The Service
              may be temporarily unavailable due to:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Scheduled maintenance (with advance notice where possible)</li>
              <li style={styles.listItem}>Emergency repairs</li>
              <li style={styles.listItem}>Circumstances beyond our reasonable control</li>
            </ul>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>10. Limitation of Liability</h2>
            <p style={styles.paragraph}>
              To the maximum extent permitted by law, Business Dashboard Ltd shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss of profits
              or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill,
              or other intangible losses.
            </p>
            <p style={styles.paragraph}>
              In no event shall our total liability exceed the amount you paid us in the twelve (12)
              months preceding the claim.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>11. Disclaimer of Warranties</h2>
            <p style={styles.paragraph}>
              The Service is provided "as is" and "as available" without warranties of any kind, either
              express or implied, including but not limited to implied warranties of merchantability,
              fitness for a particular purpose, and non-infringement.
            </p>
            <p style={styles.paragraph}>
              We do not warrant that the Service will be uninterrupted, secure, or error-free, or that
              defects will be corrected.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>12. Indemnification</h2>
            <p style={styles.paragraph}>
              You agree to indemnify and hold harmless Business Dashboard Ltd and its officers, directors,
              employees, and agents from any claims, damages, losses, liabilities, and expenses arising
              from your use of the Service or violation of these Terms.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>13. Termination</h2>
            <p style={styles.paragraph}>
              We may terminate or suspend your account immediately, without prior notice, if you breach
              these Terms. You may terminate your account at any time through your account settings or
              by contacting support.
            </p>
            <p style={styles.paragraph}>
              Upon termination:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Your right to use the Service will cease immediately</li>
              <li style={styles.listItem}>You will have 30 days to export Your Data</li>
              <li style={styles.listItem}>We may delete Your Data after the 30-day period</li>
              <li style={styles.listItem}>Any outstanding payments remain due</li>
            </ul>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>14. Changes to Terms</h2>
            <p style={styles.paragraph}>
              We reserve the right to modify these Terms at any time. We will provide notice of material
              changes by posting the updated Terms on our website and notifying you via email.
            </p>
            <p style={styles.paragraph}>
              Continued use of the Service after changes become effective constitutes acceptance of the
              modified Terms.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>15. Governing Law</h2>
            <p style={styles.paragraph}>
              These Terms shall be governed by and construed in accordance with the laws of England and
              Wales, without regard to conflict of law principles.
            </p>
            <p style={styles.paragraph}>
              Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of
              the courts of England and Wales.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>16. Severability</h2>
            <p style={styles.paragraph}>
              If any provision of these Terms is found to be unenforceable, the remaining provisions
              will continue in full force and effect.
            </p>
          </div>

          <div style={styles.policySection}>
            <h2 style={styles.sectionTitle}>17. Contact Information</h2>
            <p style={styles.paragraph}>
              If you have any questions about these Terms, please contact us:
            </p>
            <div style={styles.contactBox}>
              <p style={styles.contactLine}><strong>Email:</strong> legal@businessdashboard.com</p>
              <p style={styles.contactLine}><strong>Address:</strong> Business Dashboard Ltd, London, United Kingdom</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div style={styles.ctaGlow}></div>
          <h2 style={styles.ctaTitle}>Questions About Our Terms?</h2>
          <p style={styles.ctaText}>
            We're happy to clarify any part of our terms and conditions.
          </p>
          <Link href="/contact" style={styles.ctaButton}>
            Get in Touch
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
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  section: {
    padding: '20px 20px 60px',
  },
  contentCard: {
    position: 'relative',
    maxWidth: '900px',
    margin: '0 auto',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '48px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  contentGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.5), transparent)',
  },
  policySection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 16px 0',
    fontFamily: '"Space Grotesk", sans-serif',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(100, 180, 255, 0.2)',
  },
  subTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'rgba(100, 180, 255, 0.9)',
    margin: '20px 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  paragraph: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.8,
    margin: '0 0 16px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 16px 0',
  },
  listItem: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.8,
    paddingLeft: '24px',
    position: 'relative',
    marginBottom: '8px',
    fontFamily: '"Outfit", sans-serif',
  },
  contactBox: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '16px',
  },
  contactLine: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: '0 0 8px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  ctaSection: {
    padding: '20px 20px 80px',
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
