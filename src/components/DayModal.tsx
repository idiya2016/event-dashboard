import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { Modal, Button, CardImage, CardContent } from '../components';
import styles from './DayModal.module.css';

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: Event[];
}

export const DayModal: React.FC<DayModalProps> = ({ isOpen, onClose, date, events }) => {
  const navigate = useNavigate();

  if (!date) return null;

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatDate = (dateString: string): string => {
    const eventDate = new Date(dateString);
    return eventDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const defaultImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formattedDate}
      footer={
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className={styles.dayModal}>
        {events.length === 0 ? (
          <div className={styles.noEvents}>
            <span className={styles.noEventsIcon}>📅</span>
            <p className={styles.noEventsText}>No events scheduled for this day</p>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                navigate('/events/new');
              }}
            >
              Create Event
            </Button>
          </div>
        ) : (
          <div className={styles.eventsList}>
            {events.map((event) => (
              <div
                key={event.id}
                className={styles.eventItem}
                onClick={() => {
                  onClose();
                  navigate(`/events/${event.id}`);
                }}
              >
                <div className={styles.eventImage}>
                  <CardImage src={event.image} alt={event.name} />
                </div>
                <CardContent className={styles.eventInfo}>
                  <h4 className={styles.eventName}>{event.name}</h4>
                  <div className={styles.eventMeta}>
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon}>📍</span>
                      {event.location}
                    </span>
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon}>🕐</span>
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <p className={styles.eventDescription}>{event.description}</p>
                </CardContent>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
