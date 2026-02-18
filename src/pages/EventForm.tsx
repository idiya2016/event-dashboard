import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEventContext, useToast } from '../context';
import { EventFormData, EventFormErrors } from '../types';
import { Card, CardContent, Button, Input, TextArea } from '../components';
import styles from './EventForm.module.css';

export const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addEvent, updateEvent, getEventById } = useEventContext();
  const { error } = useToast();

  const isEditMode = Boolean(id);
  const event = id ? getEventById(id) : undefined;

  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    date: '',
    location: '',
    description: '',
    image: '',
  });

  const [errors, setErrors] = useState<EventFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        date: event.date,
        location: event.location,
        description: event.description,
        image: event.image || '',
      });
    }
  }, [event]);

  const validateForm = (): boolean => {
    const newErrors: EventFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Event name must be at least 3 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today && !isEditMode) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length < 3) {
      newErrors.location = 'Location must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    
    // Show error toast if validation fails
    if (Object.keys(newErrors).length > 0) {
      error('Please fix the errors in the form');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EventFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && id) {
        updateEvent(id, formData);
      } else {
        addEvent(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    navigate(id ? `/events/${id}` : '/');
  };

  return (
    <div className={styles.formPage}>
      <div className={styles.formHeader}>
        <h1 className={styles.title}>{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
        <p className={styles.subtitle}>
          {isEditMode ? 'Update the event details below' : 'Fill in the details to create a new event'}
        </p>
      </div>

      <Card className={styles.formCard}>
        <CardContent>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Event Name"
              name="name"
              type="text"
              placeholder="e.g., Annual Tech Conference 2025"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isSubmitting}
            />

            <Input
              label="Event Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              disabled={isSubmitting}
            />

            <Input
              label="Location"
              name="location"
              type="text"
              placeholder="e.g., San Francisco Convention Center"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              disabled={isSubmitting}
            />

            <Input
              label="Image URL (optional)"
              name="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
              error={errors.image}
              disabled={isSubmitting}
            />

            <TextArea
              label="Description"
              name="description"
              placeholder="Describe your event in detail..."
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              disabled={isSubmitting}
              rows={5}
            />

            <div className={styles.formActions}>
              <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
