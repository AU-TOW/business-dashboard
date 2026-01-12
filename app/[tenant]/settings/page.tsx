'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant, useTenantPath, useBranding } from '@/lib/tenant/TenantProvider';
import { createTenantApi } from '@/lib/api/tenantFetch';
import { canAccessFeature, getTierDisplayName, getUpgradeTierForFeature, SubscriptionTier, TradeType } from '@/lib/features';
import { colors, shadows, animations } from '@/lib/theme';

interface TenantSettings {
  id: string;
  slug: string;
  businessName: string;
  tradeType: TradeType;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  logoUrl: string | null;
  primaryColor: string;
  subscriptionTier: SubscriptionTier;
  trialEndsAt: string | null;
  subscriptionStatus: string;
  bankName: string;
  bankAccountName: string;
  bankSortCode: string;
  bankAccountNumber: string;
  partsLabel: string;
  showVehicleFields: boolean;
  maxBookingsPerMonth: number;
  maxTelegramBots: number;
  maxUsers: number;
}

export default function SettingsPage() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const branding = useBranding();

  const tier = (tenant.subscriptionTier || 'trial') as SubscriptionTier;
  const trade = (tenant.tradeType || 'general') as TradeType;
  const hasCustomBranding = canAccessFeature('customBranding', tier, trade);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [settings, setSettings] = useState<TenantSettings | null>(null);
  const [form, setForm] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    primaryColor: '#3B82F6',
    bankName: '',
    bankAccountName: '',
    bankSortCode: '',
    bankAccountNumber: '',
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const api = createTenantApi(tenant.slug);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response = await api.get('/api/autow/tenant/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setForm({
          businessName: data.businessName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          postcode: data.postcode || '',
          primaryColor: data.primaryColor || '#3B82F6',
          bankName: data.bankName || '',
          bankAccountName: data.bankAccountName || '',
          bankSortCode: data.bankSortCode || '',
          bankAccountNumber: data.bankAccountNumber || '',
        });
        setLogoPreview(data.logoUrl);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const response = await api.post('/api/autow/tenant/settings', form);
      if (response.ok) {
        const data = await response.json();
        setSettings(data.tenant);
        showMessage('success', 'Settings saved successfully');
      } else {
        const error = await response.json();
        showMessage('error', error.error || 'Failed to save settings');
      }
    } catch (error) {
      showMessage('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      showMessage('error', 'Invalid file type. Use PNG, JPG, or WEBP');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      showMessage('error', 'File too large. Maximum size is 2MB');
      return;
    }

    setUploadingLogo(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        try {
          const response = await api.post('/api/autow/tenant/logo', {
            imageData: base64,
            filename: file.name,
          });

          if (response.ok) {
            const data = await response.json();
            setLogoPreview(data.logoUrl);
            showMessage('success', 'Logo uploaded successfully');
          } else {
            const error = await response.json();
            showMessage('error', error.error || 'Failed to upload logo');
          }
        } catch (error) {
          showMessage('error', 'Failed to upload logo');
        } finally {
          setUploadingLogo(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      showMessage('error', 'Failed to read file');
      setUploadingLogo(false);
    }
  }

  async function handleRemoveLogo() {
    setUploadingLogo(true);
    try {
      const response = await fetch('/api/autow/tenant/logo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
      });

      if (response.ok) {
        setLogoPreview(null);
        showMessage('success', 'Logo removed');
      } else {
        showMessage('error', 'Failed to remove logo');
      }
    } catch (error) {
      showMessage('error', 'Failed to remove logo');
    } finally {
      setUploadingLogo(false);
    }
  }

  function formatTrialEnds(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) return 'Trial expired';
    return `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
  }

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading settings...</p>
        </div>
        <style>{animations}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.settingsBox} className="settings-box">
        <div style={styles.header}>
          <button onClick={() => router.push(paths.welcome)} style={styles.backButton}>
            ← Back
          </button>
          <h1 style={styles.title}>Business Settings</h1>
          <p style={styles.subtitle}>Manage your business details and branding</p>
        </div>

        {/* Message Toast */}
        {message && (
          <div style={{
            ...styles.toast,
            backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444',
          }}>
            {message.text}
          </div>
        )}

        <div style={styles.sectionsContainer}>
          {/* Business Information */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Business Information</h2>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Business Name</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Trade Type</label>
                <input
                  type="text"
                  value={settings?.tradeType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || ''}
                  disabled
                  style={styles.inputDisabled}
                />
                <span style={styles.helpText}>Contact support to change trade type</span>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Business Logo</h2>
            <div style={styles.logoSection}>
              <div style={styles.logoPreviewContainer}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Business Logo" style={styles.logoPreview} />
                ) : (
                  <div style={styles.logoPlaceholder}>
                    <span style={styles.logoPlaceholderIcon}>🏢</span>
                    <span style={styles.logoPlaceholderText}>No logo</span>
                  </div>
                )}
              </div>
              <div style={styles.logoActions}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  style={styles.uploadButton}
                >
                  {uploadingLogo ? 'Uploading...' : logoPreview ? 'Change Logo' : 'Upload Logo'}
                </button>
                {logoPreview && (
                  <button
                    onClick={handleRemoveLogo}
                    disabled={uploadingLogo}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
                <span style={styles.helpText}>PNG, JPG, or WEBP. Max 2MB.</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Contact Details</h2>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroupFull}>
                <label style={styles.label}>Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={styles.textarea}
                  rows={2}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Postcode</label>
                <input
                  type="text"
                  value={form.postcode}
                  onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Bank Details</h2>
            <p style={styles.sectionDescription}>These details appear on your invoices for customer payments.</p>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bank Name</label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  style={styles.input}
                  placeholder="e.g., Barclays"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Account Name</label>
                <input
                  type="text"
                  value={form.bankAccountName}
                  onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
                  style={styles.input}
                  placeholder="Name on account"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Sort Code</label>
                <input
                  type="text"
                  value={form.bankSortCode}
                  onChange={(e) => setForm({ ...form, bankSortCode: e.target.value })}
                  style={styles.input}
                  placeholder="00-00-00"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Account Number</label>
                <input
                  type="text"
                  value={form.bankAccountNumber}
                  onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                  style={styles.input}
                  placeholder="12345678"
                />
              </div>
            </div>
          </div>

          {/* Branding (Primary Color) */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Branding</h2>
            {hasCustomBranding ? (
              <div style={styles.colorPickerSection}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Primary Color</label>
                  <div style={styles.colorInputContainer}>
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      style={styles.colorInput}
                    />
                    <input
                      type="text"
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      style={styles.colorTextInput}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                <div style={styles.colorPreview}>
                  <span style={styles.colorPreviewLabel}>Preview:</span>
                  <button
                    style={{
                      ...styles.previewButton,
                      backgroundColor: form.primaryColor,
                    }}
                  >
                    Sample Button
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.lockedFeature}>
                <div style={styles.lockedBadge}>
                  Upgrade to {getTierDisplayName(getUpgradeTierForFeature('customBranding') || 'business')}
                </div>
                <p style={styles.lockedText}>
                  Custom branding colors are available on Business and Enterprise plans.
                  Upgrade to personalize your dashboard and share pages.
                </p>
              </div>
            )}
          </div>

          {/* Subscription Info */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Subscription</h2>
            <div style={styles.subscriptionInfo}>
              <div style={styles.tierBadge}>
                <span style={styles.tierLabel}>Current Plan</span>
                <span style={styles.tierName}>{getTierDisplayName(settings?.subscriptionTier as SubscriptionTier || 'trial')}</span>
                {settings?.subscriptionTier === 'trial' && settings.trialEndsAt && (
                  <span style={styles.trialText}>{formatTrialEnds(settings.trialEndsAt)}</span>
                )}
              </div>
              <div style={styles.planFeatures}>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>📅</span>
                  <span>
                    {settings?.maxBookingsPerMonth === -1
                      ? 'Unlimited bookings'
                      : `${settings?.maxBookingsPerMonth} bookings/month`}
                  </span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>🤖</span>
                  <span>
                    {settings?.maxTelegramBots === -1
                      ? 'Unlimited Telegram bots'
                      : `${settings?.maxTelegramBots} Telegram bot${settings?.maxTelegramBots === 1 ? '' : 's'}`}
                  </span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>👥</span>
                  <span>
                    {settings?.maxUsers === -1
                      ? 'Unlimited users'
                      : `${settings?.maxUsers} user${settings?.maxUsers === 1 ? '' : 's'}`}
                  </span>
                </div>
              </div>
              <button style={styles.upgradeButton} disabled>
                Upgrade Plan (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={styles.saveButton}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .settings-box {
            padding: 20px 15px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: colors.background,
    minHeight: '100vh',
    padding: '20px',
  },
  loadingBox: {
    textAlign: 'center' as const,
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: `4px solid ${colors.borderLight}`,
    borderTop: `4px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: '16px',
    margin: '0',
  },
  settingsBox: {
    maxWidth: '900px',
    margin: '0 auto',
    background: colors.cardBackground,
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: shadows.card,
    border: `1px solid ${colors.borderLight}`,
  },
  header: {
    marginBottom: '30px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: colors.primary,
    fontSize: '14px',
    cursor: 'pointer',
    padding: '0',
    marginBottom: '10px',
    fontWeight: '600',
  },
  title: {
    color: colors.textHeading,
    fontSize: '28px',
    margin: '0 0 5px 0',
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: '16px',
    margin: '0',
  },
  toast: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 1000,
  },
  sectionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '30px',
  },
  section: {
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${colors.borderLight}`,
  },
  sectionTitle: {
    color: colors.textHeading,
    fontSize: '18px',
    margin: '0 0 16px 0',
    fontWeight: '600',
  },
  sectionDescription: {
    color: '#64748b',
    fontSize: '14px',
    margin: '0 0 16px 0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  formGroupFull: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    gridColumn: '1 / -1',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#fff',
  },
  inputDisabled: {
    padding: '10px 14px',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  textarea: {
    padding: '10px 14px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    backgroundColor: '#fff',
  },
  helpText: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '4px',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px',
    flexWrap: 'wrap' as const,
  },
  logoPreviewContainer: {
    width: '120px',
    height: '120px',
    borderRadius: '12px',
    border: `2px dashed ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
  },
  logoPlaceholder: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    color: '#9ca3af',
  },
  logoPlaceholderIcon: {
    fontSize: '32px',
  },
  logoPlaceholderText: {
    fontSize: '12px',
  },
  logoActions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  uploadButton: {
    padding: '10px 20px',
    background: colors.primary,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  removeButton: {
    padding: '10px 20px',
    background: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  colorPickerSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  colorInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  colorInput: {
    width: '50px',
    height: '40px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  colorTextInput: {
    padding: '10px 14px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    width: '120px',
    fontFamily: 'monospace',
  },
  colorPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  colorPreviewLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  previewButton: {
    padding: '10px 24px',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'default',
  },
  lockedFeature: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center' as const,
  },
  lockedBadge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '6px 14px',
    borderRadius: '20px',
    marginBottom: '12px',
    textTransform: 'uppercase' as const,
  },
  lockedText: {
    color: '#6b7280',
    fontSize: '14px',
    margin: '0',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subscriptionInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  tierBadge: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  tierLabel: {
    fontSize: '12px',
    color: '#64748b',
    textTransform: 'uppercase' as const,
    fontWeight: '500',
  },
  tierName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: colors.textHeading,
  },
  trialText: {
    fontSize: '14px',
    color: '#f59e0b',
    fontWeight: '500',
  },
  planFeatures: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#374151',
  },
  featureIcon: {
    fontSize: '18px',
  },
  upgradeButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    opacity: 0.6,
    maxWidth: '200px',
  },
  saveButton: {
    marginTop: '30px',
    width: '100%',
    padding: '14px',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: shadows.button,
  },
};
