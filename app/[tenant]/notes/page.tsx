'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JotterNote } from '@/lib/types';
import { useTenant, useTenantPath } from '@/lib/tenant/TenantProvider';
import { colors, shadows, animations } from '@/lib/theme';

export default function NotesPage() {
  const router = useRouter();
  const tenant = useTenant();
  const paths = useTenantPath();
  const [notes, setNotes] = useState<JotterNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('autow_token');
    if (!token) {
      router.push(paths.welcome);
      return;
    }
    fetchNotes();
  }, [router, statusFilter]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('autow_token');
      const url = statusFilter === 'all'
        ? '/api/autow/note/list'
        : `/api/autow/note/list?status=${statusFilter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Slug': tenant.slug,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: { bg: 'rgba(148, 163, 184, 0.2)', color: '#64748b' },
      active: { bg: 'rgba(16, 185, 129, 0.2)', color: colors.success },
      converted: { bg: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }
    };
    const style = statusStyles[status as keyof typeof statusStyles] || statusStyles.draft;
    return (
      <span style={{ ...styles.statusBadge, background: style.bg, color: style.color }}>
        {status.toUpperCase()}
      </span>
    );
  };

  const deleteNote = async (noteId: number) => {
    if (!confirm('Delete this note? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('autow_token');
      const response = await fetch('/api/autow/note/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Tenant-Slug': tenant.slug,
        },
        body: JSON.stringify({ id: noteId })
      });
      if (response.ok) {
        fetchNotes();
      } else {
        alert('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const convertToBooking = (note: JotterNote) => {
    const params = new URLSearchParams({
      note_id: note.id?.toString() || '',
      customer_name: note.customer_name || '',
      phone: note.customer_phone || '',
      vehicle_make: note.vehicle_make || '',
      vehicle_model: note.vehicle_model || '',
      registration: note.vehicle_reg || '',
      issue: note.issue_description || '',
      from_note: 'true'
    });
    router.push(`${paths.bookings}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading notes...</p>
        </div>
        <style>{animations}</style>
      </div>
    );
  }

  return (
    <div style={styles.container} className="mobile-container">
      <div style={styles.header} className="mobile-header">
        <div>
          <h1 style={styles.title} className="mobile-title">Jotter Notes</h1>
          <p style={styles.subtitle}>Quick notes from Smart Jotter</p>
        </div>
        <div style={styles.headerActions} className="mobile-actions">
          <button onClick={() => router.push(paths.jotter)} style={styles.createButton} className="mobile-btn">
            + New Note
          </button>
          <button onClick={() => router.push(paths.dashboard)} style={styles.dashboardButton} className="mobile-btn">
            Dashboard
          </button>
          <button onClick={() => router.push(paths.welcome)} style={styles.backButton} className="mobile-btn">
            Menu
          </button>
        </div>
      </div>

      <div style={styles.filterBar} className="mobile-actions">
        {['all', 'draft', 'active', 'converted'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              ...styles.filterButton,
              ...(statusFilter === status ? styles.filterButtonActive : {})
            }}
            className="mobile-btn"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.notesList} className="mobile-grid">
        {notes.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No notes found</p>
            <button onClick={() => router.push(paths.jotter)} style={styles.createButton} className="mobile-btn">
              Create Your First Note
            </button>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={styles.noteCard} className="mobile-card">
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.noteNumber}>{note.vehicle_reg || note.note_number}</h3>
                  <p style={styles.customerName}>{note.customer_name || 'No customer'}</p>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <span className="mobile-badge" style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: note.status === 'converted' ? 'rgba(139, 92, 246, 0.2)' : note.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                    color: note.status === 'converted' ? '#8b5cf6' : note.status === 'active' ? colors.success : '#64748b'
                  }}>
                    {note.status.toUpperCase()}
                  </span>
                  <p style={styles.noteDate}>
                    {note.note_date ? new Date(note.note_date).toLocaleDateString('en-GB') : 'No date'}
                  </p>
                </div>
              </div>

              <div style={styles.cardBody}>
                {note.customer_phone && (
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Phone:</span>
                    <span style={styles.value}>{note.customer_phone}</span>
                  </div>
                )}
                {note.vehicle_make && (
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Vehicle:</span>
                    <span style={styles.value}>{note.vehicle_make} {note.vehicle_model}</span>
                  </div>
                )}
                {note.issue_description && (
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Issue:</span>
                    <span style={styles.value}>{note.issue_description.substring(0, 50)}...</span>
                  </div>
                )}
                {note.confidence_score && (
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Confidence:</span>
                    <span style={styles.value}>{Math.round(note.confidence_score * 100)}%</span>
                  </div>
                )}
              </div>

              <div style={styles.cardActions} className="mobile-actions">
                <button
                  onClick={() => router.push(`${paths.notes}/view?id=${note.id}`)}
                  style={styles.actionButton}
                  className="mobile-btn"
                >
                  View
                </button>
                <button
                  onClick={() => router.push(`${paths.notes}/edit?id=${note.id}`)}
                  style={styles.actionButton}
                  className="mobile-btn"
                >
                  Edit
                </button>
                {note.status !== 'converted' && (
                  <button
                    onClick={() => convertToBooking(note)}
                    style={{ ...styles.actionButton, ...styles.convertButton }}
                    className="mobile-btn"
                  >
                    Make Booking
                  </button>
                )}
                <button
                  onClick={() => deleteNote(note.id!)}
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                  className="mobile-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
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
  dashboardButton: {
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
  notesList: {
    display: 'grid',
    gap: '20px',
  },
  noteCard: {
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
  noteNumber: {
    color: colors.textHeading,
    fontSize: '20px',
    margin: '0 0 5px 0',
    fontWeight: '700' as const,
  },
  customerName: {
    color: colors.textPrimary,
    fontSize: '16px',
    margin: '0',
  },
  noteDate: {
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
