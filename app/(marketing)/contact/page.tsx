'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <span style={styles.badge}>Contact Us</span>
          <h1 style={styles.heroTitle}>Get in Touch</h1>
          <p style={styles.heroSubtitle}>
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
            Our team typically responds within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section style={styles.section}>
        <div style={styles.contactGrid}>
          {/* Contact Info */}
          <div style={styles.contactInfo}>
            <h2 style={styles.infoTitle}>Other Ways to Reach Us</h2>

            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📧</div>
              <div>
                <h3 style={styles.infoLabel}>Email</h3>
                <a href="mailto:hello@businessdashboard.com" style={styles.infoLink}>
                  hello@businessdashboard.com
                </a>
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>💬</div>
              <div>
                <h3 style={styles.infoLabel}>Live Chat</h3>
                <p style={styles.infoText}>Available Mon-Fri, 9am-5pm GMT</p>
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📱</div>
              <div>
                <h3 style={styles.infoLabel}>Telegram Support</h3>
                <p style={styles.infoText}>@BusinessDashboardSupport</p>
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📍</div>
              <div>
                <h3 style={styles.infoLabel}>Location</h3>
                <p style={styles.infoText}>United Kingdom</p>
              </div>
            </div>

            <div style={styles.socialSection}>
              <h3 style={styles.socialTitle}>Follow Us</h3>
              <div style={styles.socialLinks}>
                <a href="#" style={styles.socialLink} aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" style={styles.socialLink} aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={styles.formCard}>
            <div style={styles.formGlow}></div>

            {status === 'success' ? (
              <div style={styles.successMessage}>
                <div style={styles.successIcon}>✓</div>
                <h3 style={styles.successTitle}>Message Sent!</h3>
                <p style={styles.successText}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  style={styles.resetButton}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.formTitle}>Send us a Message</h2>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.label}>Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      placeholder="John Smith"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="subject" style={styles.label}>Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={styles.select}
                  >
                    <option value="">Select a topic...</option>
                    <option value="general">General Enquiry</option>
                    <option value="sales">Sales Question</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Issue</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="message" style={styles.label}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={styles.textarea}
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <span style={styles.spinner}></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        input::placeholder, textarea::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: rgba(100, 180, 255, 0.5) !important;
          box-shadow: 0 0 20px rgba(100, 180, 255, 0.15) !important;
        }
        select option {
          background: #1a1a1a;
          color: #ffffff;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
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
    padding: '40px 20px 80px',
  },
  contactGrid: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '60px',
    alignItems: 'start',
  },
  contactInfo: {},
  infoTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 24px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  infoCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  infoIcon: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 4px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  infoLink: {
    fontSize: '14px',
    color: 'rgba(100, 180, 255, 0.9)',
    textDecoration: 'none',
    fontFamily: '"Outfit", sans-serif',
  },
  infoText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
  },
  socialSection: {
    marginTop: '32px',
  },
  socialTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.7)',
    margin: '0 0 16px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  socialLinks: {
    display: 'flex',
    gap: '12px',
  },
  socialLink: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  formCard: {
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  formGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.5), transparent)',
  },
  form: {},
  formTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 28px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '8px',
    fontFamily: '"Outfit", sans-serif',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    fontFamily: '"Outfit", sans-serif',
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    fontFamily: '"Outfit", sans-serif',
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    fontFamily: '"Outfit", sans-serif',
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '120px',
  },
  submitButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '16px 28px',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  successMessage: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(74, 222, 128, 0.15)',
    border: '2px solid rgba(74, 222, 128, 0.4)',
    borderRadius: '50%',
    fontSize: '28px',
    color: 'rgba(74, 222, 128, 0.9)',
    margin: '0 auto 20px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 12px 0',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  successText: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0 0 28px 0',
    fontFamily: '"Outfit", sans-serif',
  },
  resetButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: '"Outfit", sans-serif',
    color: 'rgba(255, 255, 255, 0.8)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
