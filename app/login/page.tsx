'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        {/* Top Navigation */}
        <div style={styles.topNav}>
          <a href="/" style={styles.brandLink}>
            <span style={styles.brandText}>Business Dashboard</span>
          </a>
        </div>

        <div style={styles.loginBox}>
          <div style={styles.successContent}>
            <div style={styles.successIcon}>✉️</div>
            <h1 style={styles.successTitle}>Check Your Email</h1>
            <p style={styles.successText}>
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p style={styles.successSubtext}>
              Click the link in your email to sign in to your dashboard.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              style={styles.backButton}
            >
              ← Try Different Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Top Navigation */}
      <div style={styles.topNav}>
        <a href="/" style={styles.brandLink}>
          <span style={styles.backArrow}>←</span>
          <span style={styles.brandText}>Business Dashboard</span>
        </a>
      </div>

      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>
            Sign in to your Business Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
              style={styles.input}
              placeholder="you@yourbusiness.com"
              disabled={loading}
              autoFocus
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
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>

          <p style={styles.infoText}>
            We'll send you a secure link to sign in — no password needed.
          </p>

          <div style={styles.signupLink}>
            Don't have an account?{' '}
            <a href="/signup" style={styles.link}>Start free trial</a>
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
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    gap: '20px',
  },
  topNav: {
    position: 'fixed' as const,
    top: '20px',
    left: '20px',
    zIndex: 100,
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#1e40af',
    fontWeight: '700',
    fontSize: '18px',
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
    transition: 'all 0.3s',
  },
  backArrow: {
    fontSize: '16px',
  },
  brandText: {
    color: '#1e40af',
  },
  loginBox: {
    maxWidth: '450px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '48px 40px',
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
    padding: '16px',
    border: '2px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: 'inherit',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#1e293b',
    transition: 'all 0.3s',
    boxSizing: 'border-box' as const,
    outline: 'none',
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
  infoText: {
    fontSize: '13px',
    color: '#94a3b8',
    textAlign: 'center' as const,
    margin: '0',
  },
  signupLink: {
    fontSize: '14px',
    color: '#64748b',
    textAlign: 'center' as const,
    paddingTop: '20px',
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
