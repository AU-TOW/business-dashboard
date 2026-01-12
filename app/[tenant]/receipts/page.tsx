'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Receipt } from '@/lib/types';
import { useTenant, useTenantPath } from '@/lib/tenant/TenantProvider';
import { colors, shadows, animations } from '@/lib/theme';

const styles = {
  container: {
    background: colors.background,
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  } as React.CSSProperties,
  header: {
    background: colors.cardBackground,
    backdropFilter: 'blur(20px)',
    padding: '24px 32px',
    borderRadius: '20px',
    marginBottom: '24px',
    boxShadow: shadows.small,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '20px',
    border: `1px solid ${colors.borderLight}`,
  } as React.CSSProperties,
  logo: {
    height: '50px',
    width: 'auto',
  } as React.CSSProperties,
  headerButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  backButton: {
    background: `rgba(${colors.primaryRgb}, 0.1)`,
    color: colors.primary,
    border: `2px solid ${colors.border}`,
    padding: '12px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
  } as React.CSSProperties,
  uploadButton: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    boxShadow: shadows.button,
  } as React.CSSProperties,
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: colors.textHeading,
  } as React.CSSProperties,
  statsRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  statCard: {
    background: colors.cardBackground,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '16px',
    padding: '20px',
    minWidth: '150px',
    flex: 1,
    boxShadow: shadows.small,
  } as React.CSSProperties,
  statLabel: {
    fontSize: '12px',
    color: colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  } as React.CSSProperties,
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: '5px',
  } as React.CSSProperties,
  filterRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  filterSelect: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '12px',
    padding: '12px 15px',
    color: colors.textPrimary,
    fontSize: '14px',
    cursor: 'pointer',
    minWidth: '150px',
  } as React.CSSProperties,
  filterInput: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '12px',
    padding: '12px 15px',
    color: colors.textPrimary,
    fontSize: '14px',
    minWidth: '200px',
  } as React.CSSProperties,
  receiptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  receiptCard: {
    background: colors.cardBackground,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '16px',
    padding: '20px',
    transition: 'border-color 0.2s',
    boxShadow: shadows.small,
  } as React.CSSProperties,
  receiptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  } as React.CSSProperties,
  receiptNumber: {
    fontSize: '12px',
    color: colors.textSecondary,
    fontFamily: 'monospace',
  } as React.CSSProperties,
  categoryBadge: {
    fontSize: '11px',
    padding: '4px 10px',
    borderRadius: '12px',
    textTransform: 'uppercase' as const,
    fontWeight: 'bold',
  } as React.CSSProperties,
  supplierName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.textHeading,
    marginBottom: '8px',
  } as React.CSSProperties,
  receiptDate: {
    fontSize: '14px',
    color: colors.textSecondary,
    marginBottom: '15px',
  } as React.CSSProperties,
  receiptAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: '15px',
  } as React.CSSProperties,
  receiptDescription: {
    fontSize: '14px',
    color: colors.textSecondary,
    marginBottom: '15px',
    fontStyle: 'italic',
  } as React.CSSProperties,
  receiptActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: `1px solid ${colors.borderLight}`,
  } as React.CSSProperties,
  viewButton: {
    background: `rgba(${colors.primaryRgb}, 0.1)`,
    color: colors.primary,
    border: `1px solid ${colors.border}`,
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    flex: 1,
    textDecoration: 'none',
    textAlign: 'center' as const,
    fontWeight: '600',
  } as React.CSSProperties,
  deleteButton: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: colors.error,
    border: '1px solid rgba(239, 68, 68, 0.3)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    background: colors.cardBackground,
    borderRadius: '16px',
    boxShadow: shadows.small,
  } as React.CSSProperties,
  emptyIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  } as React.CSSProperties,
  emptyText: {
    fontSize: '18px',
    marginBottom: '20px',
    color: colors.textSecondary,
  } as React.CSSProperties,
  loading: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: colors.textSecondary,
  } as React.CSSProperties,
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  } as React.CSSProperties,
  modalContent: {
    background: colors.cardBackground,
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center' as const,
    boxShadow: shadows.card,
    border: `1px solid ${colors.borderLight}`,
  } as React.CSSProperties,
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: colors.error,
  } as React.CSSProperties,
  modalText: {
    fontSize: '14px',
    color: colors.textSecondary,
    marginBottom: '25px',
  } as React.CSSProperties,
  modalButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  } as React.CSSProperties,
  modalCancel: {
    background: `rgba(${colors.primaryRgb}, 0.1)`,
    color: colors.primary,
    border: `2px solid ${colors.border}`,
    padding: '12px 25px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  } as React.CSSProperties,
  modalConfirm: {
    background: colors.error,
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  } as React.CSSProperties,
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  fuel: { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' },
  parts: { bg: `rgba(${colors.primaryRgb}, 0.2)`, text: colors.primary },
  tools: { bg: 'rgba(139, 92, 246, 0.2)', text: '#8b5cf6' },
  supplies: { bg: 'rgba(6, 182, 212, 0.2)', text: '#06b6d4' },
  misc: { bg: 'rgba(148, 163, 184, 0.2)', text: '#64748b' },
};

export default function ReceiptsPage() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stats, setStats] = useState({ total_count: 0, total_amount: 0, month_count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [monthFilter, setMonthFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; receipt: Receipt | null }>({
    show: false,
    receipt: null,
  });
  const [deleting, setDeleting] = useState(false);

  // Generate month options (last 12 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toISOString().slice(0, 7);
  });

  useEffect(() => {
    const token = localStorage.getItem('autow_token');
    if (!token) {
      router.push(paths.welcome);
      return;
    }
    fetchReceipts();
  }, [router, paths, monthFilter, categoryFilter, supplierSearch]);

  const fetchReceipts = async () => {
    try {
      const token = localStorage.getItem('autow_token');
      const params = new URLSearchParams();
      if (monthFilter) params.append('month', monthFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (supplierSearch) params.append('supplier', supplierSearch);

      const response = await fetch(`/api/autow/receipt/list?${params}`, {
        headers: {
          'X-Tenant-Slug': tenant.slug,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch receipts');
      }

      const data = await response.json();
      setReceipts(data.receipts);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.receipt) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem('autow_token');
      const response = await fetch('/api/autow/receipt/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ id: deleteModal.receipt.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete receipt');
      }

      setDeleteModal({ show: false, receipt: null });
      fetchReceipts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  return (
    <div style={styles.container}>
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalTitle}>Delete Receipt?</div>
            <div style={styles.modalText}>
              This will permanently delete {deleteModal.receipt?.receipt_number} and remove the image from storage.
            </div>
            <div style={styles.modalButtons}>
              <button
                style={styles.modalCancel}
                onClick={() => setDeleteModal({ show: false, receipt: null })}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                style={styles.modalConfirm}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.header}>
        <Image
          src="/logo.png"
          alt="AUTOW Logo"
          width={120}
          height={50}
          style={styles.logo}
          priority
        />
        <div style={styles.headerButtons}>
          <button style={styles.backButton} onClick={() => router.push(paths.welcome)}>
            ← Menu
          </button>
          <button style={styles.uploadButton} onClick={() => router.push(paths.receiptsUpload)}>
            + Upload Receipt
          </button>
        </div>
      </div>

      <h1 style={styles.title}>Receipts</h1>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Receipts</div>
          <div style={styles.statValue}>{stats.total_count}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Spend</div>
          <div style={styles.statValue}>{formatCurrency(Number(stats.total_amount))}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Months Tracked</div>
          <div style={styles.statValue}>{stats.month_count}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterRow}>
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Months</option>
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {new Date(month + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Categories</option>
          <option value="fuel">Fuel</option>
          <option value="parts">Parts</option>
          <option value="tools">Tools</option>
          <option value="supplies">Supplies</option>
          <option value="misc">Miscellaneous</option>
        </select>

        <input
          type="text"
          placeholder="Search supplier..."
          value={supplierSearch}
          onChange={(e) => setSupplierSearch(e.target.value)}
          style={styles.filterInput}
        />
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: `1px solid ${colors.error}`, color: colors.error, padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading receipts...</div>
      ) : receipts.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🧾</div>
          <div style={styles.emptyText}>No receipts found</div>
          <button style={styles.uploadButton} onClick={() => router.push(paths.receiptsUpload)}>
            Upload Your First Receipt
          </button>
        </div>
      ) : (
        <div style={styles.receiptGrid}>
          {receipts.map((receipt) => (
            <div key={receipt.id} style={styles.receiptCard}>
              <div style={styles.receiptHeader}>
                <span style={styles.receiptNumber}>{receipt.receipt_number}</span>
                {receipt.category && (
                  <span
                    style={{
                      ...styles.categoryBadge,
                      backgroundColor: categoryColors[receipt.category]?.bg || '#333',
                      color: categoryColors[receipt.category]?.text || '#fff',
                    }}
                  >
                    {receipt.category}
                  </span>
                )}
              </div>

              <div style={styles.supplierName}>{receipt.supplier}</div>
              <div style={styles.receiptDate}>{formatDate(receipt.receipt_date)}</div>
              <div style={styles.receiptAmount}>{formatCurrency(receipt.amount)}</div>

              {receipt.description && (
                <div style={styles.receiptDescription}>{receipt.description}</div>
              )}

              <div style={styles.receiptActions}>
                {(receipt as any).storage_file_url && (
                  <a
                    href={(receipt as any).storage_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.viewButton}
                  >
                    View Image
                  </a>
                )}
                {receipt.gdrive_file_url && !(receipt as any).storage_file_url && (
                  <a
                    href={receipt.gdrive_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{...styles.viewButton, background: colors.primary, color: '#fff'}}
                  >
                    View Image (Legacy)
                  </a>
                )}
                <button
                  style={styles.deleteButton}
                  onClick={() => setDeleteModal({ show: true, receipt })}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
