'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TradeType } from '@/lib/tenant/types';

const TRADE_OPTIONS: { value: TradeType; label: string }[] = [
  { value: 'car_mechanic', label: 'Car Mechanic / Automotive' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'builder', label: 'Builder / Construction' },
  { value: 'general', label: 'General Trades / Other' },
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
        <div style={styles.signupBox}>
          <div style={styles.successContent}>
            <div style={styles.successIcon}>{emailFailed ? '✅' : '✉️'}</div>
            <h1 style={styles.successTitle}>
              {emailFailed ? 'Account Created!' : 'Check Your Email'}
            </h1>
            <p style={styles.successText}>
              {emailFailed ? (
                <>Your account for <strong>{formData.businessName}</strong> is ready!</>
              ) : (
                <>We've sent a magic link to <strong>{formData.email}</strong></>
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
              <a href="/login" style={{...styles.backButton, textDecoration: 'none', display: 'inline-block'}}>
                Go to Login →
              </a>
            ) : (
              <button
                onClick={() => setSuccess(false)}
                style={styles.backButton}
              >
                ← Back to Signup
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.signupBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>Start Your Free Trial</h1>
          <p style={styles.subtitle}>
            7 days free • No credit card required
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Business Name *</label>
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
            {slug && (
              <p style={styles.slugPreview}>
                Your dashboard: <span style={styles.slugText}>/{slug}/dashboard</span>
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address *</label>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Trade Type</label>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone (Optional)</label>
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

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : '🚀 Start Free Trial'}
          </button>

          <p style={styles.termsText}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div style={styles.loginLink}>
            Already have an account?{' '}
            <a href="/login" style={styles.link}>Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 50%, #f5f5f5 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  signupBox: {
    maxWidth: '500px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  title: {
    color: '#1e40af',
    fontSize: '28px',
    marginBottom: '8px',
    margin: '0 0 8px 0',
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '16px',
    margin: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  error: {
    background: 'rgba(244, 67, 54, 0.1)',
    border: '2px solid rgba(244, 67, 54, 0.3)',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1e40af',
    fontSize: '14px',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#1e293b',
    transition: 'all 0.3s',
    boxSizing: 'border-box' as const,
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#1e293b',
    transition: 'all 0.3s',
    boxSizing: 'border-box' as const,
    outline: 'none',
    cursor: 'pointer',
  },
  slugPreview: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '6px',
    margin: '6px 0 0 0',
  },
  slugText: {
    fontFamily: 'monospace',
    color: '#3b82f6',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
    letterSpacing: '0.3px',
    transition: 'all 0.3s',
    marginTop: '8px',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  termsText: {
    fontSize: '12px',
    color: '#94a3b8',
    textAlign: 'center' as const,
    margin: '0',
  },
  loginLink: {
    fontSize: '14px',
    color: '#64748b',
    textAlign: 'center' as const,
    paddingTop: '16px',
    borderTop: '1px solid rgba(59, 130, 246, 0.1)',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
  },
  // Success state styles
  successContent: {
    textAlign: 'center' as const,
    padding: '20px 0',
  },
  successIcon: {
    fontSize: '64px',
    marginBottom: '24px',
  },
  successTitle: {
    color: '#1e40af',
    fontSize: '24px',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  successText: {
    color: '#1e293b',
    fontSize: '16px',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  successSubtext: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '24px',
    margin: '0 0 24px 0',
  },
  backButton: {
    background: 'transparent',
    border: '2px solid rgba(59, 130, 246, 0.3)',
    color: '#3b82f6',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};
