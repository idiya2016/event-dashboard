export type AttendeeStatus = 'confirmed' | 'pending' | 'declined';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  status: AttendeeStatus;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  image?: string;
  attendees?: Attendee[];
}

export interface EventFormData {
  name: string;
  date: string;
  location: string;
  description: string;
  image?: string;
}

export interface EventFormErrors {
  name?: string;
  date?: string;
  location?: string;
  description?: string;
  image?: string;
}

export interface AttendeeFormData {
  name: string;
  email: string;
  status?: AttendeeStatus;
}

export interface AttendeeFormErrors {
  name?: string;
  email?: string;
}
