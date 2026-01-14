'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <Link href="/" style={styles.logo} aria-label="Business Dashboard Home">
          Business Dashboard
        </Link>

        {/* Desktop Navigation */}
        <nav style={styles.desktopNav} aria-label="Main navigation">
          <Link href="/" style={styles.navLink}>
            Home
          </Link>
          <Link href="/pricing" style={styles.navLink}>
            Pricing
          </Link>
          <Link href="/login" style={styles.loginButton}>
            Log In
          </Link>
          <Link href="/signup" style={styles.signupButton}>
            Start Free Trial
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          style={styles.mobileOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <nav style={styles.mobileNav}>
            <Link href="/" style={styles.mobileNavLink} onClick={closeMenu}>
              Home
            </Link>
            <Link href="/pricing" style={styles.mobileNavLink} onClick={closeMenu}>
              Pricing
            </Link>
            <Link href="/login" style={styles.mobileLoginButton} onClick={closeMenu}>
              Log In
            </Link>
            <Link href="/signup" style={styles.mobileSignupButton} onClick={closeMenu}>
              Start Free Trial
            </Link>
          </nav>
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
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
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    padding: '16px 24px',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e40af',
    textDecoration: 'none',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  loginButton: {
    color: '#3B82F6',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    padding: '10px 16px',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  signupButton: {
    background: 'linear-gradient(135deg, #3B82F6, #2563eb)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '24px',
    height: '18px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  hamburgerLine: {
    width: '100%',
    height: '2px',
    background: '#1e293b',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  mobileOverlay: {
    position: 'fixed',
    top: '65px',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    zIndex: 99,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '48px',
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    width: '100%',
    maxWidth: '300px',
  },
  mobileNavLink: {
    color: '#1e293b',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 500,
    padding: '12px 24px',
    width: '100%',
    textAlign: 'center',
    borderRadius: '8px',
    transition: 'background 0.2s',
  },
  mobileLoginButton: {
    color: '#3B82F6',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 600,
    padding: '14px 24px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    marginTop: '8px',
  },
  mobileSignupButton: {
    background: 'linear-gradient(135deg, #3B82F6, #2563eb)',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 600,
    padding: '14px 24px',
    width: '100%',
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
};
