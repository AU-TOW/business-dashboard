'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* Top Glow Line */}
      <div style={styles.glowLine}></div>

      <div style={styles.footerContent}>
        <div style={styles.footerGrid}>
          {/* Column 1: Logo + Tagline */}
          <div style={styles.footerColumn}>
            <Link href="/" style={styles.logoLink} aria-label="Business Dashboard Home">
              <Image
                src="/assets/Business-Dash.png"
                alt="Business Dashboard"
                width={216}
                height={60}
                style={styles.logoImage}
              />
            </Link>
            <p style={styles.tagline}>
              Next-generation management platform for UK tradespeople
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialIcon} aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" style={styles.socialIcon} aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div style={styles.footerColumn}>
            <h4 style={styles.columnTitle}>Product</h4>
            <nav aria-label="Product links" style={styles.navColumn}>
              <Link href="/#features" style={styles.footerLink}>
                Features
              </Link>
              <Link href="/#pricing" style={styles.footerLink}>
                Pricing
              </Link>
              <Link href="/signup" style={styles.footerLink}>
                Sign Up
              </Link>
            </nav>
          </div>

          {/* Column 3: Company */}
          <div style={styles.footerColumn}>
            <h4 style={styles.columnTitle}>Company</h4>
            <nav aria-label="Company links" style={styles.navColumn}>
              <Link href="/about" style={styles.footerLink}>
                About
              </Link>
              <Link href="/contact" style={styles.footerLink}>
                Contact
              </Link>
              <Link href="/support" style={styles.footerLink}>
                Support
              </Link>
            </nav>
          </div>

          {/* Column 4: Legal */}
          <div style={styles.footerColumn}>
            <h4 style={styles.columnTitle}>Legal</h4>
            <nav aria-label="Legal links" style={styles.navColumn}>
              <Link href="/privacy" style={styles.footerLink}>
                Privacy Policy
              </Link>
              <Link href="/terms" style={styles.footerLink}>
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} Business Dashboard. All rights reserved.
          </p>
          <p style={styles.madeWith}>
            Built for UK tradespeople
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        @media (max-width: 768px) {
          footer > div:nth-child(2) > div:first-child {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          footer > div:nth-child(2) > div:first-child > div {
            align-items: center !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          footer > div:nth-child(2) > div:first-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </footer>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    position: 'relative',
    padding: '0',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
  },
  glowLine: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '64px 24px 32px',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '48px',
    marginBottom: '48px',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    marginBottom: '8px',
  },
  logoImage: {
    height: '60px',
    width: 'auto',
    objectFit: 'contain',
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    lineHeight: 1.7,
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  socialLinks: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  },
  navColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  columnTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.6)',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: '"Outfit", sans-serif',
    transition: 'color 0.3s ease',
    position: 'relative',
  },
  footerBottom: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  copyright: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '13px',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  madeWith: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '13px',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
};
