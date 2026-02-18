import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../context';
import { Card, CardContent, Button, Skeleton } from '../components';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import styles from './Analytics.module.css';

export const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { events } = useEventContext();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Detect dark mode
  React.useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => observer.disconnect();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const allAttendees = events.flatMap((e) => e.attendees || []);
    const confirmedAttendees = allAttendees.filter((a) => a.status === 'confirmed').length;
    const pendingAttendees = allAttendees.filter((a) => a.status === 'pending').length;
    const declinedAttendees = allAttendees.filter((a) => a.status === 'declined').length;

    // Events by month (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const eventsByMonth = events
      .filter((e) => new Date(e.date) >= sixMonthsAgo)
      .reduce((acc, event) => {
        const date = new Date(event.date);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        acc[monthKey] = (acc[monthKey] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Ensure all 6 months are represented
    const monthLabels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthLabels.push(d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
    }
    const eventsByMonthData = monthLabels.map((month) => ({
      month,
      events: eventsByMonth[month] || 0,
    }));

    // Popular locations (top 5)
    const locationCounts = events.reduce((acc, event) => {
      acc[event.location] = (acc[event.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const popularLocationsData = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    // Attendee summary
    const attendeeSummaryData = [
      { name: 'Confirmed', value: confirmedAttendees, color: '#10b981' },
      { name: 'Pending', value: pendingAttendees, color: '#f59e0b' },
      { name: 'Declined', value: declinedAttendees, color: '#ef4444' },
    ];

    // Upcoming events (next 7 days)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingEvents = events
      .filter((e) => {
        const eventDate = new Date(e.date);
        return eventDate >= now && eventDate <= sevenDaysFromNow;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((e) => ({
        ...e,
        attendeeCount: (e.attendees || []).length,
        confirmedCount: (e.attendees || []).filter((a) => a.status === 'confirmed').length,
      }));

    return {
      totalEvents,
      confirmedAttendees,
      pendingAttendees,
      declinedAttendees,
      totalAttendees: allAttendees.length,
      eventsByMonthData,
      popularLocationsData,
      attendeeSummaryData,
      upcomingEvents,
    };
  }, [events]);

  const chartColors = {
    text: isDarkMode ? '#e5e7eb' : '#374151',
    grid: isDarkMode ? '#374151' : '#e5e7eb',
    background: isDarkMode ? '#1f2937' : '#ffffff',
  };

  const barColors = isDarkMode ? ['#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fbbf24'] : ['#7c3aed', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
  const pieColors = isDarkMode ? ['#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fbbf24'] : ['#7c3aed', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics Dashboard</h1>
        <p className={styles.subtitle}>
          Insights and statistics about your events and attendees
        </p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <CardContent className={styles.statContent}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.totalEvents}</span>
              <span className={styles.statLabel}>Total Events</span>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent className={styles.statContent}>
            <div className={styles.statIcon}>🎫</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.totalAttendees}</span>
              <span className={styles.statLabel}>Total Attendees</span>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent className={styles.statContent}>
            <div className={styles.statIcon}>✓</div>
            <div className={styles.statInfo}>
              <span className={`${styles.statValue} ${styles.confirmed}`}>{stats.confirmedAttendees}</span>
              <span className={styles.statLabel}>Confirmed</span>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent className={styles.statContent}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statInfo}>
              <span className={`${styles.statValue} ${styles.pending}`}>{stats.pendingAttendees}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent className={styles.statContent}>
            <div className={styles.statIcon}>✕</div>
            <div className={styles.statInfo}>
              <span className={`${styles.statValue} ${styles.declined}`}>{stats.declinedAttendees}</span>
              <span className={styles.statLabel}>Declined</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Events by Month */}
        <Card className={styles.chartCard}>
          <CardContent className={styles.chartContent}>
            <h3 className={styles.chartTitle}>Events by Month</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.eventsByMonthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" stroke={chartColors.text} fontSize={12} />
                  <YAxis stroke={chartColors.text} fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartColors.background,
                      border: '1px solid ' + chartColors.grid,
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ color: chartColors.text }}
                  />
                  <Bar dataKey="events" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isDarkMode ? '#a78bfa' : '#7c3aed'} />
                      <stop offset="100%" stopColor={isDarkMode ? '#60a5fa' : '#3b82f6'} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Popular Locations */}
        <Card className={styles.chartCard}>
          <CardContent className={styles.chartContent}>
            <h3 className={styles.chartTitle}>Popular Locations</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats.popularLocationsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.popularLocationsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartColors.background,
                      border: '1px solid ' + chartColors.grid,
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ color: chartColors.text }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendee Summary */}
        <Card className={styles.chartCard}>
          <CardContent className={styles.chartContent}>
            <h3 className={styles.chartTitle}>Attendee Summary</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats.attendeeSummaryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.attendeeSummaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartColors.background,
                      border: '1px solid ' + chartColors.grid,
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ color: chartColors.text }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className={styles.chartCard}>
          <CardContent className={styles.chartContent}>
            <h3 className={styles.chartTitle}>Upcoming Events (Next 7 Days)</h3>
            <div className={styles.upcomingList}>
              {stats.upcomingEvents.length === 0 ? (
                <div className={styles.noUpcoming}>
                  <span className={styles.noUpcomingIcon}>📭</span>
                  <p className={styles.noUpcomingText}>No upcoming events in the next 7 days</p>
                </div>
              ) : (
                stats.upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className={styles.upcomingItem}
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className={styles.upcomingInfo}>
                      <h4 className={styles.upcomingName}>{event.name}</h4>
                      <span className={styles.upcomingDate}>{formatDate(event.date)}</span>
                    </div>
                    <div className={styles.upcomingAttendees}>
                      <span className={styles.upcomingCount}>
                        {event.confirmedCount}/{event.attendeeCount}
                      </span>
                      <span className={styles.upcomingLabel}>attendees</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
