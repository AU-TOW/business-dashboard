'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant, useTenantPath, useBranding } from '@/lib/tenant/TenantProvider';
import { colors, shadows, animations } from '@/lib/theme';

export default function ReceiptUploadPage() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const branding = useBranding();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageData, setImageData] = useState<string | null>(null);
  const [supplier, setSupplier] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('bd_logged_in');
    if (!token) {
      router.push(paths.welcome);
    }
  }, [router, paths]);

  const parseReceipt = async (imgData: string) => {
    setScanning(true);
    setError(null);

    try {
      const response = await fetch('/api/autow/receipt/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ imageData: imgData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan receipt');
      }

      if (data.success && data.data) {
        const extracted = data.data;
        const filledFields = new Set<string>();

        if (extracted.supplier) {
          setSupplier(extracted.supplier);
          filledFields.add('supplier');
        }
        if (extracted.amount !== null && extracted.amount !== undefined) {
          setAmount(extracted.amount.toString());
          filledFields.add('amount');
        }
        if (extracted.date) {
          setReceiptDate(extracted.date);
          filledFields.add('date');
        }
        if (extracted.category) {
          setCategory(extracted.category);
          filledFields.add('category');
        }
        if (extracted.description) {
          setDescription(extracted.description);
          filledFields.add('description');
        }

        setAutoFilledFields(filledFields);
        setConfidence(extracted.confidence);
        setScanned(true);
      }
    } catch (err: any) {
      console.error('Receipt scan error:', err);
      setScanned(true);
    } finally {
      setScanning(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imgData = event.target?.result as string;
        setImageData(imgData);
        setError(null);
        await parseReceipt(imgData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    setImageData(null);
    setSupplier('');
    setAmount('');
    setReceiptDate(new Date().toISOString().slice(0, 10));
    setCategory('');
    setDescription('');
    setScanned(false);
    setConfidence(null);
    setAutoFilledFields(new Set());
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRescan = async () => {
    if (imageData) {
      setSupplier('');
      setAmount('');
      setReceiptDate(new Date().toISOString().slice(0, 10));
      setCategory('');
      setDescription('');
      setAutoFilledFields(new Set());
      await parseReceipt(imageData);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!imageData) {
      setError('Please capture or upload a receipt image');
      return;
    }
    if (!supplier.trim()) {
      setError('Please enter the supplier name');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setLoadingMessage('Uploading receipt...');

    try {
      const response = await fetch('/api/autow/receipt/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({
          imageData,
          supplier: supplier.trim(),
          amount: parseFloat(amount),
          receipt_date: receiptDate,
          category: category || null,
          description: description.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload receipt');
      }

      setSuccess(`Receipt ${data.receipt.receipt_number} uploaded successfully!`);

      setTimeout(() => {
        router.push(paths.receipts);
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Failed to upload receipt');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const isFormValid = imageData && supplier.trim() && amount && parseFloat(amount) > 0;

  return (
    <div style={styles.container}>
      <style>{animations}</style>

      {(loading || scanning) && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
          <div style={styles.loadingText}>
            {scanning ? 'Scanning Receipt...' : loadingMessage}
          </div>
          {scanning && (
            <div style={styles.loadingSubtext}>
              AI is reading the receipt data
            </div>
          )}
        </div>
      )}

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          {branding.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={branding.businessName}
              style={styles.logo}
            />
          ) : (
            <h2 style={styles.businessName}>{branding.businessName}</h2>
          )}
        </div>
        <div style={styles.headerActions}>
          <button style={styles.backButton} onClick={() => router.push(paths.receipts)}>
            Back to Receipts
          </button>
          <button style={styles.menuButton} onClick={() => router.push(paths.welcome)}>
            Menu
          </button>
        </div>
      </div>

      <h1 style={styles.title}>Upload Receipt</h1>
      <p style={styles.subtitle}>Capture or upload a receipt image for automatic scanning</p>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={styles.hiddenInput}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={styles.hiddenInput}
      />

      {/* Image Section */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>Receipt Image</div>
        <div style={styles.imageSection}>
          {imageData ? (
            <>
              <img src={imageData} alt="Receipt preview" style={styles.imagePreview} />
              <div style={styles.buttonRow}>
                <button style={styles.clearButton} onClick={handleClearImage}>
                  Clear
                </button>
                <button style={styles.rescanButton} onClick={handleRescan}>
                  Re-scan
                </button>
              </div>
            </>
          ) : (
            <div style={styles.buttonRow}>
              <button style={styles.captureButton} onClick={handleCameraCapture}>
                Take Photo
              </button>
              <button style={styles.uploadButton} onClick={handleFileUpload}>
                Upload from Gallery
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confidence Banner */}
      {scanned && confidence !== null && (
        <div style={styles.confidenceBanner}>
          <span style={styles.confidenceText}>
            AI scanned your receipt and auto-filled the fields below
          </span>
          <span style={styles.confidenceScore}>
            {Math.round(confidence * 100)}% confident
          </span>
        </div>
      )}

      {scanned && autoFilledFields.size === 0 && (
        <div style={styles.warningBanner}>
          <span style={styles.warningText}>
            Couldn't read receipt clearly - please fill in manually
          </span>
        </div>
      )}

      {/* Form Section */}
      <div style={styles.card}>
        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Supplier <span style={styles.required}>*</span>
              {autoFilledFields.has('supplier') && (
                <span style={styles.autoFillBadge}>Auto-filled</span>
              )}
            </label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="e.g., Shell, Screwfix, GSF"
              style={autoFilledFields.has('supplier') ? styles.inputAutoFilled : styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Amount <span style={styles.required}>*</span>
              {autoFilledFields.has('amount') && (
                <span style={styles.autoFillBadge}>Auto-filled</span>
              )}
            </label>
            <div style={styles.amountGroup}>
              <span style={styles.currencySymbol}>£</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                style={{ ...(autoFilledFields.has('amount') ? styles.inputAutoFilled : styles.input), flex: 1 }}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Date
              {autoFilledFields.has('date') && (
                <span style={styles.autoFillBadge}>Auto-filled</span>
              )}
            </label>
            <input
              type="date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              style={autoFilledFields.has('date') ? styles.inputAutoFilled : styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Category
              {autoFilledFields.has('category') && (
                <span style={styles.autoFillBadge}>Auto-filled</span>
              )}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={autoFilledFields.has('category') ? styles.selectAutoFilled : styles.select}
            >
              <option value="">Select category...</option>
              <option value="fuel">Fuel</option>
              <option value="parts">Parts</option>
              <option value="tools">Tools</option>
              <option value="supplies">Supplies</option>
              <option value="misc">Miscellaneous</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Description
              {autoFilledFields.has('description') && (
                <span style={styles.autoFillBadge}>Auto-filled</span>
              )}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes about this receipt..."
              style={autoFilledFields.has('description') ? styles.textareaAutoFilled : styles.textarea}
            />
          </div>

          <p style={styles.manualEntryNote}>
            You can edit any auto-filled fields before uploading
          </p>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            style={{
              ...styles.submitButton,
              ...((!isFormValid || loading) ? styles.submitButtonDisabled : {}),
            }}
          >
            {loading ? 'Uploading...' : 'Upload Receipt'}
          </button>
        </div>
      </div>
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
  header: {
    background: colors.cardBackground,
    backdropFilter: 'blur(20px)',
    padding: '20px 24px',
    borderRadius: '16px',
    marginBottom: '24px',
    boxShadow: shadows.small,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '16px',
    border: `1px solid ${colors.borderLight}`,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    height: '40px',
    width: 'auto',
    objectFit: 'contain' as const,
  },
  businessName: {
    color: colors.textHeading,
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  backButton: {
    padding: '10px 20px',
    background: `rgba(${colors.primaryRgb}, 0.1)`,
    color: colors.primary,
    border: `1px solid ${colors.border}`,
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  menuButton: {
    padding: '10px 20px',
    background: `rgba(${colors.primaryRgb}, 0.1)`,
    color: colors.primary,
    border: `1px solid ${colors.border}`,
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  title: {
    color: colors.textHeading,
    fontSize: '28px',
    margin: '0 0 8px 0',
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: '14px',
    margin: '0 0 24px 0',
  },
  card: {
    background: colors.cardBackground,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: shadows.small,
  },
  sectionTitle: {
    fontSize: '14px',
    color: colors.textSecondary,
    marginBottom: '16px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  imageSection: {
    border: `2px dashed ${colors.borderLight}`,
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center' as const,
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  captureButton: {
    padding: '14px 28px',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: shadows.button,
  },
  uploadButton: {
    padding: '14px 28px',
    background: `rgba(${colors.primaryRgb}, 0.1)`,
    color: colors.primary,
    border: `1px solid ${colors.border}`,
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
  },
  clearButton: {
    padding: '10px 20px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: colors.error,
    border: `1px solid rgba(239, 68, 68, 0.3)`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  rescanButton: {
    padding: '10px 20px',
    background: `rgba(${colors.primaryRgb}, 0.1)`,
    color: colors.primary,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    color: colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
  },
  required: {
    color: colors.error,
  },
  autoFillBadge: {
    backgroundColor: `rgba(${colors.primaryRgb}, 0.15)`,
    color: colors.primary,
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '10px',
    textTransform: 'uppercase' as const,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#fff',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '10px',
    padding: '14px 16px',
    color: colors.textPrimary,
    fontSize: '15px',
  },
  inputAutoFilled: {
    backgroundColor: '#fff',
    border: `1px solid ${colors.primary}`,
    borderRadius: '10px',
    padding: '14px 16px',
    color: colors.textPrimary,
    fontSize: '15px',
  },
  select: {
    backgroundColor: '#fff',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '10px',
    padding: '14px 16px',
    color: colors.textPrimary,
    fontSize: '15px',
    cursor: 'pointer',
  },
  selectAutoFilled: {
    backgroundColor: '#fff',
    border: `1px solid ${colors.primary}`,
    borderRadius: '10px',
    padding: '14px 16px',
    color: colors.textPrimary,
    fontSize: '15px',
    cursor: 'pointer',
  },
  textarea: {
    backgroundColor: '#fff',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '10px',
    padding: '14px 16px',
    color: colors.textPrimary,
    fontSize: '15px',
    minHeight: '100px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  textareaAutoFilled: {
    backgroundColor: '#fff',
    border: `1px solid ${colors.primary}`,
    borderRadius: '10px',
    padding: '14px 16px',
    color: colors.textPrimary,
    fontSize: '15px',
    minHeight: '100px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  amountGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  currencySymbol: {
    fontSize: '18px',
    color: colors.primary,
    fontWeight: '700',
  },
  submitButton: {
    padding: '16px 32px',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
    marginTop: '10px',
    boxShadow: shadows.button,
  },
  submitButtonDisabled: {
    background: colors.borderLight,
    color: colors.textSecondary,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: `1px solid rgba(239, 68, 68, 0.3)`,
    color: colors.error,
    padding: '14px 18px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  success: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: `1px solid rgba(16, 185, 129, 0.3)`,
    color: colors.success,
    padding: '14px 18px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  hiddenInput: {
    display: 'none',
  },
  loadingOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: `4px solid ${colors.borderLight}`,
    borderTop: `4px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    color: colors.primary,
    fontSize: '18px',
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: '8px',
    color: colors.textSecondary,
    fontSize: '14px',
  },
  confidenceBanner: {
    backgroundColor: `rgba(${colors.primaryRgb}, 0.1)`,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '14px 20px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  confidenceText: {
    color: colors.primary,
    fontSize: '14px',
    fontWeight: '500',
  },
  confidenceScore: {
    backgroundColor: colors.primary,
    color: '#fff',
    padding: '5px 12px',
    borderRadius: '15px',
    fontSize: '13px',
    fontWeight: '700',
  },
  warningBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '12px',
    padding: '14px 20px',
    marginBottom: '20px',
  },
  warningText: {
    color: '#f59e0b',
    fontSize: '14px',
    fontWeight: '500',
  },
  manualEntryNote: {
    color: colors.textSecondary,
    fontSize: '13px',
    fontStyle: 'italic' as const,
    margin: 0,
  },
};
