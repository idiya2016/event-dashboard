import React, { useState, useMemo } from 'react';
import { Event } from '../types';
import styles from './CalendarView.module.css';

interface CalendarViewProps {
  events: Event[];
  onDayClick: (date: Date, events: Event[]) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onDayClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const calendarDays = useMemo((): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });

      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime(),
        events: dayEvents,
      });
    }

    return days;
  }, [currentMonth, events]);

  const goToPreviousMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = (): void => {
    setCurrentMonth(new Date());
  };

  const handleDayClick = (day: CalendarDay): void => {
    onDayClick(day.date, day.events);
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button
          className={styles.navButton}
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className={styles.monthYear}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          className={styles.navButton}
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
        <button className={styles.todayButton} onClick={goToToday}>
          Today
        </button>
      </div>

      <div className={styles.weekDays}>
        {weekDays.map((day) => (
          <div key={day} className={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {calendarDays.map((day, index) => (
          <button
            key={index}
            className={`${styles.dayCell} ${!day.isCurrentMonth ? styles.otherMonth : ''} ${
              day.isToday ? styles.today : ''
            } ${day.events.length > 0 ? styles.hasEvents : ''}`}
            onClick={() => handleDayClick(day)}
          >
            <span className={styles.dayNumber}>{day.date.getDate()}</span>
            {day.events.length > 0 && (
              <div className={styles.eventDots}>
                {day.events.slice(0, 3).map((event, i) => (
                  <span
                    key={i}
                    className={styles.eventDot}
                    style={{ backgroundColor: getEventColor(event.id) }}
                    title={event.name}
                  />
                ))}
                {day.events.length > 3 && (
                  <span className={styles.moreIndicator}>+{day.events.length - 3}</span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const getEventColor = (id: string): string => {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b', '#fa709a', '#fee140'];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
