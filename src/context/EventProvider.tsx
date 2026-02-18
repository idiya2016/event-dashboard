import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Event, EventFormData, Attendee, AttendeeFormData, AttendeeStatus } from '../types';
import {
  EventState,
  initialState,
  eventReducer,
  saveToStorage,
} from './EventContext';
import { useToast } from './ToastContext';

interface EventContextType extends EventState {
  addEvent: (eventData: EventFormData) => void;
  updateEvent: (id: string, eventData: EventFormData) => void;
  deleteEvent: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setDateFilter: (date: string) => void;
  getEventById: (id: string) => Event | undefined;
  filteredEvents: Event[];
  addAttendee: (eventId: string, attendeeData: AttendeeFormData) => void;
  updateAttendeeStatus: (eventId: string, attendeeId: string, status: AttendeeStatus) => void;
  removeAttendee: (eventId: string, attendeeId: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);
  const { success } = useToast();

  // Load events from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('events');
    if (stored) {
      dispatch({ type: 'SET_EVENTS', payload: JSON.parse(stored) });
    }
  }, []);

  // Save to localStorage whenever events change
  useEffect(() => {
    saveToStorage(state.events);
  }, [state.events]);

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addEvent = (eventData: EventFormData): void => {
    const newEvent: Event = {
      ...eventData,
      id: generateId(),
      attendees: [],
    };
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
    success('Event created successfully!');
  };

  const updateEvent = (id: string, eventData: EventFormData): void => {
    const updatedEvent: Event = {
      ...eventData,
      id,
    };
    dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent });
    success('Event updated successfully!');
  };

  const deleteEvent = (id: string): void => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
    success('Event deleted successfully!');
  };

  const addAttendee = (eventId: string, attendeeData: AttendeeFormData): void => {
    const newAttendee: Attendee = {
      id: generateId(),
      name: attendeeData.name,
      email: attendeeData.email,
      status: attendeeData.status || 'pending',
    };
    dispatch({ type: 'ADD_ATTENDEE', payload: { eventId, attendee: newAttendee } });
    success('Attendee added successfully!');
  };

  const updateAttendeeStatus = (
    eventId: string,
    attendeeId: string,
    status: AttendeeStatus
  ): void => {
    dispatch({ type: 'UPDATE_ATTENDEE_STATUS', payload: { eventId, attendeeId, status } });
    success('Attendee status updated!');
  };

  const removeAttendee = (eventId: string, attendeeId: string): void => {
    dispatch({ type: 'REMOVE_ATTENDEE', payload: { eventId, attendeeId } });
    success('Attendee removed successfully!');
  };

  const setSearchQuery = (query: string): void => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  };

  const setDateFilter = (date: string): void => {
    dispatch({ type: 'SET_DATE_FILTER', payload: date });
  };

  const getEventById = (id: string): Event | undefined => {
    return state.events.find((event) => event.id === id);
  };

  const filteredEvents = state.events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesDate = state.dateFilter ? event.date === state.dateFilter : true;
    return matchesSearch && matchesDate;
  });

  return (
    <EventContext.Provider
      value={{
        ...state,
        addEvent,
        updateEvent,
        deleteEvent,
        setSearchQuery,
        setDateFilter,
        getEventById,
        filteredEvents,
        addAttendee,
        updateAttendeeStatus,
        removeAttendee,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
