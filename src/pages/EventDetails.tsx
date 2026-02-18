import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '../context';
import { Card, CardContent, Button, AttendeeList, AddAttendeeForm } from '../components';
import { AttendeeStatus } from '../types';
import styles from './EventDetails.module.css';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById, deleteEvent, addAttendee, updateAttendeeStatus, removeAttendee } = useEventContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showAttendees, setShowAttendees] = useState(false);

  const event = id ? getEventById(id) : undefined;

  const handleDelete = (): void => {
    if (id) {
      deleteEvent(id);
      navigate('/');
    }
  };

  const handleAddAttendee = (eventId: string, data: { name: string; email: string; status?: AttendeeStatus }): void => {
    addAttendee(eventId, data);
  };

  const handleStatusChange = (attendeeId: string, status: AttendeeStatus): void => {
    if (id) {
      updateAttendeeStatus(id, attendeeId, status);
    }
  };

  const handleRemoveAttendee = (attendeeId: string): void => {
    if (id) {
      removeAttendee(id, attendeeId);
    }
  };

  if (!event) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h1 className={styles.notFoundTitle}>Event Not Found</h1>
        <p className={styles.notFoundText}>
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (): string => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const defaultImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop';

  const attendees = event.attendees || [];
  const confirmedCount = attendees.filter((a) => a.status === 'confirmed').length;
  const pendingCount = attendees.filter((a) => a.status === 'pending').length;
  const declinedCount = attendees.filter((a) => a.status === 'declined').length;

  return (
    <div className={styles.detailsPage}>
      <div className={styles.backButton}>
        <Button variant="outline" size="small" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </Button>
      </div>

      <Card className={styles.detailsCard}>
        <div className={styles.imageContainer}>
          <img src={event.image || defaultImage} alt={event.name} className={styles.eventImage} />
        </div>

        <CardContent className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.eventName}>{event.name}</h1>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>📅</span>
              <span>{formatDate(event.date)}</span>
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📍</span>
              <div>
                <span className={styles.infoLabel}>Location</span>
                <span className={styles.infoValue}>{event.location}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>👥</span>
              <div>
                <span className={styles.infoLabel}>Attendees</span>
                <span className={styles.infoValue}>
                  {confirmedCount} confirmed, {pendingCount} pending
                </span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🕐</span>
              <div>
                <span className={styles.infoLabel}>Last Updated</span>
                <span className={styles.infoValue}>{formatTime()}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>About This Event</h2>
            <p className={styles.description}>{event.description}</p>
          </div>

          {/* Attendee Management Section */}
          <div className={styles.attendeeSection}>
            <div className={styles.attendeeHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.attendeeIcon}>🎫</span>
                Attendee Management
              </h2>
              <button
                className={styles.toggleButton}
                onClick={() => setShowAttendees(!showAttendees)}
              >
                {showAttendees ? 'Hide' : 'Show'} Attendees ({attendees.length})
              </button>
            </div>

            {showAttendees && (
              <div className={styles.attendeeContent}>
                <AddAttendeeForm eventId={event.id} onAdd={handleAddAttendee} />
                <div className={styles.attendeeListWrapper}>
                  <AttendeeList
                    attendees={attendees}
                    onStatusChange={handleStatusChange}
                    onRemove={handleRemoveAttendee}
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <Button variant="primary" onClick={() => navigate(`/events/${event.id}/edit`)}>
              ✏️ Edit Event
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
              🗑️ Delete Event
            </Button>
          </div>
        </CardContent>
      </Card>

      {showDeleteConfirm && (
        <div className={styles.deleteOverlay} onClick={() => setShowDeleteConfirm(false)}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteIcon}>⚠️</div>
            <h2 className={styles.deleteTitle}>Delete Event?</h2>
            <p className={styles.deleteText}>
              Are you sure you want to delete "{event.name}"? This action cannot be undone.
            </p>
            <div className={styles.deleteActions}>
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
