'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <Link href="/" style={styles.logoLink} aria-label="Business Dashboard Home">
          <Image
            src="/assets/Business-Dash.png"
            alt="Business Dashboard"
            width={210}
            height={60}
            style={styles.logoImage}
            priority
          />
        </Link>

        {/* Desktop Navigation - hidden via CSS on mobile */}
        <nav className="desktop-nav" style={styles.desktopNav} aria-label="Main navigation">
          <Link href="/" style={styles.navLink}>
            Home
          </Link>
          <Link href="/#features" style={styles.navLink}>
            Features
          </Link>
          <Link href="/#pricing" style={styles.navLink}>
            Pricing
          </Link>
          <Link href="/login" style={styles.loginButton}>
            Log In
          </Link>
          <Link href="/signup" style={styles.signupButton}>
            Start Free Trial
          </Link>
        </nav>

        {/* Mobile Menu Button - hidden via CSS on desktop */}
        <button
          className="hamburger-btn"
          style={styles.hamburger}
          onClick={toggleMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span style={{
            ...styles.hamburgerLine,
            transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
          }} />
          <span style={{
            ...styles.hamburgerLine,
            opacity: mobileMenuOpen ? 0 : 1,
          }} />
          <span style={{
            ...styles.hamburgerLine,
            transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
          }} />
        </button>
      </div>

      {/* Mobile Menu Glass Card Dropdown */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            style={styles.mobileBackdrop}
            onClick={closeMenu}
          />
          {/* Glass Card Menu */}
          <div
            id="mobile-menu"
            style={styles.mobileMenuCard}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div style={styles.mobileMenuGlow}></div>
            <nav style={styles.mobileNav}>
              <Link href="/" style={styles.mobileNavLink} onClick={closeMenu}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Home
              </Link>
              <Link href="/#features" style={styles.mobileNavLink} onClick={closeMenu}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
                Features
              </Link>
              <Link href="/#pricing" style={styles.mobileNavLink} onClick={closeMenu}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Pricing
              </Link>
              <div style={styles.mobileMenuDivider}></div>
              <Link href="/login" style={styles.mobileLoginButton} onClick={closeMenu}>
                Log In
              </Link>
              <Link href="/signup" style={styles.mobileSignupButton} onClick={closeMenu}>
                Start Free Trial
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </nav>
          </div>
        </>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        /* Responsive navigation visibility */
        .desktop-nav {
          display: flex !important;
        }
        .hamburger-btn {
          display: none !important;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    padding: '12px 0',
    width: '100%',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logoImage: {
    height: '60px',
    width: 'auto',
    objectFit: 'contain',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 500,
    fontFamily: '"Outfit", sans-serif',
    letterSpacing: '0.3px',
    transition: 'color 0.3s',
    position: 'relative',
  },
  loginButton: {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    letterSpacing: '0.3px',
    padding: '8px 16px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '8px',
    transition: 'all 0.3s',
    background: 'rgba(255, 255, 255, 0.08)',
  },
  signupButton: {
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    padding: '8px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    letterSpacing: '0.3px',
    transition: 'all 0.3s',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  },
  hamburger: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '22px',
    height: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    zIndex: 150,
  },
  hamburgerLine: {
    width: '100%',
    height: '2px',
    background: '#ffffff',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  mobileBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    zIndex: 98,
    animation: 'fadeIn 0.2s ease-out',
  },
  mobileMenuCard: {
    position: 'absolute',
    top: '100%',
    right: '12px',
    left: '12px',
    marginTop: '8px',
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    zIndex: 99,
    overflow: 'hidden',
    animation: 'slideDown 0.25s ease-out',
  },
  mobileMenuGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
    pointerEvents: 'none',
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    gap: '4px',
    position: 'relative',
  },
  mobileNavLink: {
    color: 'rgba(255, 255, 255, 0.85)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: '"Outfit", sans-serif',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    background: 'transparent',
  },
  mobileMenuDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    margin: '8px 0',
  },
  mobileLoginButton: {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    padding: '12px 16px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    transition: 'all 0.2s ease',
  },
  mobileSignupButton: {
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    padding: '12px 16px',
    textAlign: 'center',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
};
