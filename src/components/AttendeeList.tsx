import React from 'react';
import { Attendee, AttendeeStatus } from '../types';
import styles from './AttendeeList.module.css';

interface AttendeeListProps {
  attendees: Attendee[];
  onStatusChange: (attendeeId: string, status: AttendeeStatus) => void;
  onRemove: (attendeeId: string) => void;
}

export const AttendeeList: React.FC<AttendeeListProps> = ({
  attendees,
  onStatusChange,
  onRemove,
}) => {
  const getStatusBadgeClass = (status: AttendeeStatus): string => {
    switch (status) {
      case 'confirmed':
        return styles.confirmed;
      case 'pending':
        return styles.pending;
      case 'declined':
        return styles.declined;
      default:
        return styles.pending;
    }
  };

  const getStatusLabel = (status: AttendeeStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusIcon = (status: AttendeeStatus): string => {
    switch (status) {
      case 'confirmed':
        return '✓';
      case 'pending':
        return '⏳';
      case 'declined':
        return '✕';
      default:
        return '⏳';
    }
  };

  if (attendees.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>👥</span>
        <p className={styles.emptyText}>No attendees yet</p>
        <small className={styles.emptySubtext}>Be the first to register for this event</small>
      </div>
    );
  }

  // Group attendees by status
  const confirmed = attendees.filter((a) => a.status === 'confirmed');
  const pending = attendees.filter((a) => a.status === 'pending');
  const declined = attendees.filter((a) => a.status === 'declined');

  const renderAttendee = (attendee: Attendee) => (
    <div key={attendee.id} className={styles.attendeeItem}>
      <div className={styles.attendeeAvatar}>
        {attendee.name.charAt(0).toUpperCase()}
      </div>
      <div className={styles.attendeeInfo}>
        <span className={styles.attendeeName}>{attendee.name}</span>
        <span className={styles.attendeeEmail}>{attendee.email}</span>
      </div>
      <div className={styles.attendeeActions}>
        <span className={`${styles.statusBadge} ${getStatusBadgeClass(attendee.status)}`}>
          <span className={styles.statusIcon}>{getStatusIcon(attendee.status)}</span>
          {getStatusLabel(attendee.status)}
        </span>
        <select
          value={attendee.status}
          onChange={(e) => onStatusChange(attendee.id, e.target.value as AttendeeStatus)}
          className={styles.statusSelect}
          aria-label="Change attendee status"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="declined">Declined</option>
        </select>
        <button
          className={styles.removeButton}
          onClick={() => onRemove(attendee.id)}
          aria-label={`Remove ${attendee.name}`}
          title="Remove attendee"
        >
          🗑
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.attendeeList}>
      {confirmed.length > 0 && (
        <div className={styles.statusGroup}>
          <h4 className={styles.statusGroupTitle}>
            <span className={styles.statusGroupIcon}>✓</span>
            Confirmed ({confirmed.length})
          </h4>
          <div className={styles.attendees}>
            {confirmed.map(renderAttendee)}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className={styles.statusGroup}>
          <h4 className={styles.statusGroupTitle}>
            <span className={styles.statusGroupIcon}>⏳</span>
            Pending ({pending.length})
          </h4>
          <div className={styles.attendees}>
            {pending.map(renderAttendee)}
          </div>
        </div>
      )}

      {declined.length > 0 && (
        <div className={styles.statusGroup}>
          <h4 className={styles.statusGroupTitle}>
            <span className={styles.statusGroupIcon}>✕</span>
            Declined ({declined.length})
          </h4>
          <div className={styles.attendees}>
            {declined.map(renderAttendee)}
          </div>
        </div>
      )}
    </div>
  );
};
