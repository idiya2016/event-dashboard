import { Event, Attendee, AttendeeStatus } from '../types';

export type EventAction =
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_DATE_FILTER'; payload: string }
  | { type: 'ADD_ATTENDEE'; payload: { eventId: string; attendee: Attendee } }
  | { type: 'UPDATE_ATTENDEE_STATUS'; payload: { eventId: string; attendeeId: string; status: AttendeeStatus } }
  | { type: 'REMOVE_ATTENDEE'; payload: { eventId: string; attendeeId: string } };

export interface EventState {
  events: Event[];
  searchQuery: string;
  dateFilter: string;
}

const sampleEvents: Event[] = [
  {
    id: '1',
    name: 'Tech Conference 2026',
    date: '2026-03-15T09:00:00.000Z',
    location: 'San Francisco, CA',
    description: 'Annual technology conference featuring the latest innovations in AI, cloud computing, and software development.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    attendees: [
      { id: 'a1', name: 'John Doe', email: 'john@example.com', status: 'confirmed' },
      { id: 'a2', name: 'Jane Smith', email: 'jane@example.com', status: 'pending' },
      { id: 'a3', name: 'Bob Wilson', email: 'bob@example.com', status: 'confirmed' },
    ],
  },
  {
    id: '2',
    name: 'Summer Music Festival',
    date: '2026-06-20T18:00:00.000Z',
    location: 'Austin, TX',
    description: 'Three-day outdoor music festival with live performances from top artists across multiple genres.',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    attendees: [
      { id: 'a4', name: 'Alice Brown', email: 'alice@example.com', status: 'confirmed' },
      { id: 'a5', name: 'Charlie Davis', email: 'charlie@example.com', status: 'declined' },
    ],
  },
  {
    id: '3',
    name: 'Art Gallery Opening',
    date: '2026-04-05T19:00:00.000Z',
    location: 'New York, NY',
    description: 'Exclusive preview of contemporary art exhibition featuring works from emerging local artists.',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
    attendees: [],
  },
  {
    id: '4',
    name: 'Startup Pitch Night',
    date: '2026-03-28T18:30:00.000Z',
    location: 'Boston, MA',
    description: 'Networking event where early-stage startups pitch their ideas to investors and industry mentors.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    attendees: [
      { id: 'a6', name: 'Eva Martinez', email: 'eva@example.com', status: 'pending' },
    ],
  },
  {
    id: '5',
    name: 'Food & Wine Expo',
    date: '2026-05-10T12:00:00.000Z',
    location: 'Napa Valley, CA',
    description: 'Culinary showcase featuring renowned chefs, wine tastings, and cooking demonstrations.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    attendees: [],
  },
  {
    id: '6',
    name: 'Marathon 2026',
    date: '2026-04-18T07:00:00.000Z',
    location: 'Chicago, IL',
    description: 'Annual city marathon with full, half, and 5K race options for runners of all levels.',
    image: 'https://images.unsplash.com/photo-1552674605-469523f9a5e2?w=800&q=80',
    attendees: [],
  },
  {
    id: '7',
    name: 'Digital Marketing Summit',
    date: '2026-05-22T09:00:00.000Z',
    location: 'Seattle, WA',
    description: 'Two-day summit covering SEO, social media strategy, content marketing, and analytics.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    attendees: [],
  },
  {
    id: '8',
    name: 'Comic Con Convention',
    date: '2026-07-12T10:00:00.000Z',
    location: 'Los Angeles, CA',
    description: 'Pop culture celebration with celebrity guests, cosplay contests, and exclusive merchandise.',
    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80',
    attendees: [],
  },
  {
    id: '9',
    name: 'Wellness Retreat Weekend',
    date: '2026-06-05T15:00:00.000Z',
    location: 'Sedona, AZ',
    description: 'Relaxing weekend retreat featuring yoga, meditation, spa treatments, and healthy cooking workshops.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
    attendees: [],
  },
  {
    id: '10',
    name: 'Gaming Tournament',
    date: '2026-08-01T11:00:00.000Z',
    location: 'Las Vegas, NV',
    description: 'Competitive esports tournament with top teams competing for prizes and championship titles.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    attendees: [],
  },
];

export const initialState: EventState = {
  events: sampleEvents,
  searchQuery: '',
  dateFilter: '',
};

export const eventReducer = (state: EventState, action: EventAction): EventState => {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_DATE_FILTER':
      return { ...state, dateFilter: action.payload };
    case 'ADD_ATTENDEE':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.eventId
            ? { ...event, attendees: [...(event.attendees || []), action.payload.attendee] }
            : event
        ),
      };
    case 'UPDATE_ATTENDEE_STATUS':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.eventId
            ? {
                ...event,
                attendees: (event.attendees || []).map((attendee) =>
                  attendee.id === action.payload.attendeeId
                    ? { ...attendee, status: action.payload.status }
                    : attendee
                ),
              }
            : event
        ),
      };
    case 'REMOVE_ATTENDEE':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.eventId
            ? {
                ...event,
                attendees: (event.attendees || []).filter(
                  (attendee) => attendee.id !== action.payload.attendeeId
                ),
              }
            : event
        ),
      };
    default:
      return state;
  }
};

const STORAGE_KEY = 'events';

export const saveToStorage = (events: Event[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const loadFromStorage = (): Event[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};
