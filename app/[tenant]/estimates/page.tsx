'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Estimate } from '@/lib/types';
import { useTenant, useTenantPath } from '@/lib/tenant/TenantProvider';
import { colors, shadows, animations } from '@/lib/theme';

export default function EstimatesPage() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('autow_token');
    if (!token) {
      router.push(paths.welcome);
      return;
    }

    fetchEstimates();
  }, [router, statusFilter]);

  const fetchEstimates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('autow_token');
      const url = statusFilter === 'all'
        ? '/api/autow/estimate/list'
        : `/api/autow/estimate/list?status=${statusFilter}`;

      const response = await fetch(url, {
        headers: {
          'X-Tenant-Slug': tenant.slug,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEstimates(data.estimates || []);
      }
    } catch (error) {
      console.error('Error fetching estimates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: { bg: 'rgba(148, 163, 184, 0.2)', color: '#64748b' },
      sent: { bg: 'rgba(59, 130, 246, 0.2)', color: colors.primary },
      accepted: { bg: 'rgba(16, 185, 129, 0.2)', color: colors.success },
      declined: { bg: 'rgba(239, 68, 68, 0.2)', color: colors.error },
      converted: { bg: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }
    };

    const style = statusStyles[status as keyof typeof statusStyles] || statusStyles.draft;

    return (
      <span style={{
        ...styles.statusBadge,
        background: style.bg,
        color: style.color
      }}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading estimates...</p>
        </div>
        <style>{animations}</style>
      </div>
    );
  }

  return (
    <div style={styles.container} className="estimates-page">
      <div style={styles.header} className="page-header">
        <div>
          <h1 style={styles.title}>Estimates</h1>
          <p style={styles.subtitle}>Manage customer estimates and quotes</p>
        </div>
        <div style={styles.headerActions}>
          <button
            onClick={() => router.push(paths.path('/estimates/create'))}
            style={styles.createButton}
            className="header-btn"
          >
            + New Estimate
          </button>
          <button
            onClick={() => router.push(paths.invoices)}
            style={styles.invoicesButton}
            className="header-btn"
          >
            📄 Invoices
          </button>
          <button
            onClick={() => router.push(paths.welcome)}
            style={styles.backButton}
            className="header-btn"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div style={styles.filterBar}>
        {['all', 'draft', 'sent', 'accepted', 'declined', 'converted'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              ...styles.filterButton,
              ...(statusFilter === status ? styles.filterButtonActive : {})
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Estimates List */}
      <div style={styles.estimatesList}>
        {estimates.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No estimates found</p>
            <button
              onClick={() => router.push(paths.path('/estimates/create'))}
              style={styles.createButton}
            >
              Create Your First Estimate
            </button>
          </div>
        ) : (
          estimates.map((estimate) => (
            <div key={estimate.id} style={styles.estimateCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.estimateNumber}>{estimate.vehicle_reg || 'No Vehicle'}</h3>
                  <p style={styles.clientName}>{estimate.client_name}</p>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  {getStatusBadge(estimate.status)}
                  <p style={styles.estimateDate}>
                    {estimate.estimate_date
                      ? new Date(estimate.estimate_date).toLocaleDateString('en-GB')
                      : 'No date'}
                  </p>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Total:</span>
                  <span style={styles.value}>£{parseFloat(estimate.total.toString()).toFixed(2)}</span>
                </div>
                {estimate.vehicle_reg && (
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Vehicle:</span>
                    <span style={styles.value}>{estimate.vehicle_reg}</span>
                  </div>
                )}
                {estimate.client_phone && (
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Phone:</span>
                    <span style={styles.value}>{estimate.client_phone}</span>
                  </div>
                )}
              </div>

              <div style={styles.cardActions}>
                <button
                  onClick={() => router.push(`${paths.estimates}/view?id=${estimate.id}`)}
                  style={styles.actionButton}
                >
                  View
                </button>
                <button
                  onClick={() => router.push(`${paths.estimates}/edit?id=${estimate.id}`)}
                  style={styles.actionButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => generateShareLink(estimate.id!)}
                  style={{ ...styles.actionButton, ...styles.shareButton }}
                >
                  Share Link
                </button>
                <button
                  onClick={() => convertToInvoice(estimate.id!)}
                  style={{ ...styles.actionButton, ...styles.convertButton }}
                >
                  Convert to Invoice
                </button>
                <button
                  onClick={() => deleteEstimate(estimate.id!)}
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .page-header > div:last-child {
            width: 100%;
          }

          .header-btn {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );

  async function convertToInvoice(estimateId: number) {
    if (!confirm('Convert this estimate to an invoice?')) return;

    try {
      const token = localStorage.getItem('autow_token');
      const response = await fetch('/api/autow/estimate/convert-to-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ estimate_id: estimateId })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Estimate converted to invoice successfully!');
        router.push(`${paths.invoices}/view?id=${data.invoice.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error converting estimate:', error);
      alert('Failed to convert estimate');
    }
  }

  async function generateShareLink(estimateId: number) {
    try {
      const token = localStorage.getItem('autow_token');
      const response = await fetch('/api/autow/estimate/generate-share-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ estimate_id: estimateId })
      });

      if (response.ok) {
        const data = await response.json();

        // Copy to clipboard
        navigator.clipboard.writeText(data.share_url);
        alert(`Share link copied to clipboard!\n\n${data.share_url}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link');
    }
  }

  async function deleteEstimate(estimateId: number) {
    if (!confirm('Are you sure you want to delete this estimate? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('autow_token');
      const response = await fetch('/api/autow/estimate/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ id: estimateId })
      });

      if (response.ok) {
        alert('Estimate deleted successfully');
        fetchEstimates(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting estimate:', error);
      alert('Failed to delete estimate');
    }
  }
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
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  title: {
    color: colors.textHeading,
    fontSize: '28px',
    margin: '0 0 5px 0',
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: '14px',
    margin: '0',
  },
  createButton: {
    padding: '12px 24px',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700' as const,
    cursor: 'pointer',
    boxShadow: shadows.button,
  },
  invoicesButton: {
    padding: '12px 24px',
    background: `rgba(${colors.primaryRgb}, 0.1)`,
    color: colors.primary,
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600' as const,
    cursor: 'pointer',
  },
  backButton: {
    padding: '12px 24px',
    background: `rgba(${colors.primaryRgb}, 0.1)`,
    color: colors.primary,
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  filterBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
  },
  filterButton: {
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.8)',
    color: colors.textSecondary,
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '12px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  filterButtonActive: {
    background: `rgba(${colors.primaryRgb}, 0.15)`,
    color: colors.primary,
    borderColor: colors.primary,
  },
  estimatesList: {
    display: 'grid',
    gap: '20px',
  },
  estimateCard: {
    background: colors.cardBackground,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: shadows.small,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: `1px solid ${colors.borderLight}`,
  },
  estimateNumber: {
    color: colors.textHeading,
    fontSize: '20px',
    margin: '0 0 5px 0',
    fontWeight: '700' as const,
  },
  clientName: {
    color: colors.textPrimary,
    fontSize: '16px',
    margin: '0',
  },
  estimateDate: {
    color: colors.textSecondary,
    fontSize: '14px',
    margin: '10px 0 0 0',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700' as const,
    display: 'inline-block',
  },
  cardBody: {
    marginBottom: '20px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  label: {
    color: colors.textSecondary,
    fontSize: '14px',
  },
  value: {
    color: colors.textPrimary,
    fontSize: '14px',
    fontWeight: '600' as const,
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
    paddingTop: '16px',
    borderTop: `1px solid ${colors.borderLight}`,
  },
  actionButton: {
    padding: '8px 16px',
    background: `rgba(${colors.primaryRgb}, 0.1)`,
    color: colors.primary,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  convertButton: {
    background: 'rgba(139, 92, 246, 0.1)',
    color: '#8b5cf6',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  shareButton: {
    background: 'rgba(245, 158, 11, 0.1)',
    color: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  deleteButton: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: colors.error,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    background: colors.cardBackground,
    borderRadius: '16px',
    boxShadow: shadows.small,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: '18px',
    marginBottom: '20px',
  },
};
