'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { TradeType } from '@/lib/tenant/types';
import Lightning from '@/components/marketing/Lightning';

const TRADE_OPTIONS: { value: TradeType; label: string; icon: string }[] = [
  { value: 'car_mechanic', label: 'Car Mechanic / Automotive', icon: '🚗' },
  { value: 'plumber', label: 'Plumber', icon: '🔧' },
  { value: 'electrician', label: 'Electrician', icon: '⚡' },
  { value: 'builder', label: 'Builder / Construction', icon: '🏗️' },
  { value: 'general', label: 'General Trades / Other', icon: '🛠️' },
];

function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    tradeType: 'general' as TradeType,
    phone: '',
  });
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailFailed, setEmailFailed] = useState(false);

  // Auto-generate slug from business name
  useEffect(() => {
    setSlug(generateSlug(formData.businessName));
  }, [formData.businessName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.email || !formData.businessName) {
      setError('Email and business name are required');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      });

      const data = await response.json();

      if (!response.ok && !data.success) {
        throw new Error(data.error || 'Signup failed');
      }

      // Account created - check if email was sent
      if (data.success && !data.emailSent) {
        // Email failed but account exists - show alternate message
        setEmailFailed(true);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        {/* Background Elements */}
        <div style={styles.background}>
          <div style={styles.gridOverlay}></div>
          <Lightning />
          <div style={styles.glowOrb1}></div>
          <div style={styles.glowOrb2}></div>
          <div style={styles.glowOrb3}></div>
        </div>

        {/* Centered Logo */}
        <div style={styles.logoContainer}>
          <Link href="/" style={styles.logoLink}>
            <div style={styles.logoGlow}></div>
            <Image
              src="/assets/Business-Dash.png"
              alt="Business Dashboard"
              width={280}
              height={80}
              style={styles.logoImage}
              priority
            />
          </Link>
        </div>

        <div style={styles.signupBox}>
          <div style={styles.boxBorder}></div>
          <div style={styles.boxContent}>
            <div style={styles.successContent}>
              <div style={styles.successIconWrapper}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5">
                  {emailFailed ? (
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  ) : (
                    <>
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </>
                  )}
                </svg>
              </div>
              <h1 style={styles.successTitle}>
                {emailFailed ? 'Account Created!' : 'Check Your Email'}
              </h1>
              <p style={styles.successText}>
                {emailFailed ? (
                  <>Your account for <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{formData.businessName}</strong> is ready!</>
                ) : (
                  <>We've sent a magic link to <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{formData.email}</strong></>
                )}
              </p>
              <p style={styles.successSubtext}>
                {emailFailed ? (
                  <>Email delivery was delayed. Visit the login page to request a new magic link.</>
                ) : (
                  <>Click the link in your email to complete your signup and access your dashboard.</>
                )}
              </p>
              {emailFailed ? (
                <Link href="/login" style={styles.successButton}>
                  Go to Login
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ) : (
                <button
                  onClick={() => setSuccess(false)}
                  style={styles.backButton}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back to Signup
                </button>
              )}
            </div>
          </div>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Background Elements */}
      <div style={styles.background}>
        <div style={styles.gridOverlay}></div>
        <Lightning />
        <div style={styles.glowOrb1}></div>
        <div style={styles.glowOrb2}></div>
        <div style={styles.glowOrb3}></div>
      </div>

      {/* Centered Logo */}
      <div style={styles.logoContainer}>
        <Link href="/" style={styles.logoLink}>
          <div style={styles.logoGlow}></div>
          <Image
            src="/assets/Business-Dash.png"
            alt="Business Dashboard"
            width={280}
            height={80}
            style={styles.logoImage}
            priority
          />
        </Link>
      </div>

      <div style={styles.signupBox}>
        <div style={styles.boxBorder}></div>
        <div style={styles.boxContent}>
          <div style={styles.header}>
            <div style={styles.trialBadge}>
              <span style={styles.badgeDot}></span>
              7-Day Free Trial
            </div>
            <h1 style={styles.title}>Start Your Free Trial</h1>
            <p style={styles.subtitle}>
              No credit card required • Cancel anytime
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
              <div style={styles.error}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Name *</label>
              <div style={styles.inputWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={styles.inputIcon}>
                  <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>
                </svg>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="e.g., Smith's Plumbing Services"
                  disabled={loading}
                />
              </div>
              {slug && (
                <p style={styles.slugPreview}>
                  Your dashboard: <span style={styles.slugText}>/{slug}/dashboard</span>
                </p>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address *</label>
              <div style={styles.inputWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={styles.inputIcon}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="you@yourbusiness.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Trade Type</label>
              <div style={styles.inputWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={styles.inputIcon}>
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                <select
                  name="tradeType"
                  value={formData.tradeType}
                  onChange={handleChange}
                  style={styles.select}
                  disabled={loading}
                >
                  {TRADE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone (Optional)</label>
              <div style={styles.inputWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={styles.inputIcon}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="07xxx xxxxxx"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Start Free Trial
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

            <p style={styles.termsText}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>

            <div style={styles.loginLink}>
              Already have an account?{' '}
              <Link href="/login" style={styles.link}>Log in</Link>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        input::placeholder, select::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        input:focus, select:focus {
          border-color: rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1) !important;
        }

        select option {
          background: #1a1a2e;
          color: #ffffff;
        }

        button:hover:not(:disabled) {
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
    background: '#000000',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
  },
  glowOrb1: {
    position: 'absolute',
    top: '10%',
    right: '25%',
    width: '450px',
    height: '450px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'pulse 4s ease-in-out infinite',
  },
  glowOrb2: {
    position: 'absolute',
    bottom: '20%',
    left: '15%',
    width: '350px',
    height: '350px',
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
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 60%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
  },
  logoContainer: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '-40px',
  },
  logoLink: {
    position: 'relative',
    display: 'block',
    textDecoration: 'none',
  },
  logoGlow: {
    position: 'absolute',
    inset: '-20px',
    background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
    filter: 'blur(20px)',
    zIndex: 0,
  },
  logoImage: {
    position: 'relative',
    height: '80px',
    width: 'auto',
    objectFit: 'contain',
    zIndex: 1,
    filter: 'drop-shadow(0 4px 20px rgba(255, 255, 255, 0.2))',
  },
  signupBox: {
    position: 'relative',
    maxWidth: '500px',
    width: '100%',
    zIndex: 1,
    paddingTop: '20px',
  },
  boxBorder: {
    position: 'absolute',
    inset: '-1px',
    borderRadius: '28px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
    zIndex: 0,
  },
  boxContent: {
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '26px',
    padding: '44px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  trialBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '100px',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: '0.5px',
    marginBottom: '16px',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '50%',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.5)',
  },
  title: {
    color: '#ffffff',
    fontSize: '34px',
    marginBottom: '10px',
    margin: '0 0 10px 0',
    fontWeight: 700,
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: '0.3px',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '15px',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#f87171',
    padding: '14px 18px',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: 500,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'block',
    fontWeight: 600,
    marginBottom: '10px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '13px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 52px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '14px',
    fontSize: '15px',
    fontFamily: '"Outfit", sans-serif',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '16px 16px 16px 52px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '14px',
    fontSize: '15px',
    fontFamily: '"Outfit", sans-serif',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
  },
  slugPreview: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '10px',
    margin: '10px 0 0 0',
    fontFamily: '"Outfit", sans-serif',
  },
  slugText: {
    fontFamily: '"Space Grotesk", monospace',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 500,
  },
  button: {
    width: '100%',
    padding: '18px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    letterSpacing: '0.5px',
    fontFamily: '"Outfit", sans-serif',
    transition: 'all 0.3s',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  termsText: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  loginLink: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    fontFamily: '"Outfit", sans-serif',
  },
  link: {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontWeight: 600,
  },
  // Success state styles
  successContent: {
    textAlign: 'center',
    padding: '20px 0',
  },
  successIconWrapper: {
    width: '88px',
    height: '88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    margin: '0 auto 28px',
    boxShadow: '0 0 50px rgba(255, 255, 255, 0.1)',
  },
  successTitle: {
    color: '#ffffff',
    fontSize: '30px',
    marginBottom: '16px',
    margin: '0 0 16px 0',
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 700,
  },
  successText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    marginBottom: '8px',
    margin: '0 0 8px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  successSubtext: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    marginBottom: '28px',
    margin: '0 0 28px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  successButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.3s',
    fontFamily: '"Outfit", sans-serif',
    letterSpacing: '0.3px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.9)',
    padding: '14px 28px',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontFamily: '"Outfit", sans-serif',
    letterSpacing: '0.3px',
  },
};
