import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../context';
import { Card, CardImage, CardContent, CardHeader, CardFooter, Button, Modal, SearchFilter, CalendarView, DayModal } from '../components';
import styles from './Dashboard.module.css';
import { Event } from '../types';

type ViewMode = 'grid' | 'calendar';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { filteredEvents, searchQuery, dateFilter, setSearchQuery, setDateFilter, deleteEvent } =
    useEventContext();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);

  const handleDeleteClick = (id: string): void => {
    setEventToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = (): void => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      setDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const handleClearFilters = (): void => {
    setSearchQuery('');
    setDateFilter('');
  };

  const handleDayClick = (date: Date, events: Event[]): void => {
    setSelectedDate(date);
    setSelectedDayEvents(events);
    setDayModalOpen(true);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Events Dashboard</h1>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <span className={styles.toggleIcon}>▦</span>
              Grid
            </button>
            <button
              className={`${styles.toggleButton} ${viewMode === 'calendar' ? styles.active : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <span className={styles.toggleIcon}>📅</span>
              Calendar
            </button>
          </div>
        </div>
        <p className={styles.subtitle}>
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
        </p>
      </div>

      <SearchFilter
        searchQuery={searchQuery}
        dateFilter={dateFilter}
        onSearchChange={setSearchQuery}
        onDateChange={setDateFilter}
        onClear={handleClearFilters}
      />

      {filteredEvents.length === 0 && viewMode === 'grid' ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <h2 className={styles.emptyTitle}>No events found</h2>
          <p className={styles.emptyText}>
            {searchQuery || dateFilter
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first event'}
          </p>
          <Button onClick={() => navigate('/events/new')} className={styles.emptyButton}>
            Create Event
          </Button>
        </div>
      ) : viewMode === 'calendar' ? (
        <CalendarView events={filteredEvents} onDayClick={handleDayClick} />
      ) : (
        <div className={styles.eventsGrid}>
          {filteredEvents.map((event) => {
            const attendees = event.attendees || [];
            const totalAttendees = attendees.length;
            const confirmedAttendees = attendees.filter((a) => a.status === 'confirmed').length;
            const progressPercent = totalAttendees > 0 ? (confirmedAttendees / totalAttendees) * 100 : 0;

            return (
              <Card
                key={event.id}
                hoverable
                onClick={() => navigate(`/events/${event.id}`)}
                className={styles.eventCard}
              >
                <CardImage src={event.image} alt={event.name} />
                <CardContent>
                  <CardHeader>
                    <h3 className={styles.eventName}>{event.name}</h3>
                  </CardHeader>
                  <div className={styles.eventDetails}>
                    <div className={styles.eventDetail}>
                      <span className={styles.detailIcon}>📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className={styles.eventDetail}>
                      <span className={styles.detailIcon}>📅</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                  </div>
                  <p className={styles.eventDescription}>{event.description}</p>
                  
                  {/* Attendee Progress */}
                  <div className={styles.attendeeProgress}>
                    <div className={styles.attendeeInfo}>
                      <span className={styles.attendeeIcon}>🎫</span>
                      <span className={styles.attendeeCount}>
                        {totalAttendees} {totalAttendees === 1 ? 'attendee' : 'attendees'}
                        {confirmedAttendees > 0 && (
                          <span className={styles.confirmedCount}>
                            ({confirmedAttendees} confirmed)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event.id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(event.id);
                    }}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Event"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this event? This action cannot be undone.</p>
      </Modal>

      <DayModal
        isOpen={dayModalOpen}
        onClose={() => setDayModalOpen(false)}
        date={selectedDate}
        events={selectedDayEvents}
      />
    </div>
  );
};
