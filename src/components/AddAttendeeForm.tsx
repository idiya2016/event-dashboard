import React, { useState } from 'react';
import { AttendeeFormData, AttendeeFormErrors } from '../types';
import styles from './AddAttendeeForm.module.css';

interface AddAttendeeFormProps {
  eventId: string;
  onAdd: (eventId: string, data: AttendeeFormData) => void;
}

export const AddAttendeeForm: React.FC<AddAttendeeFormProps> = ({ eventId, onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<AttendeeFormData>({
    name: '',
    email: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState<AttendeeFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: AttendeeFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AttendeeFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    onAdd(eventId, {
      name: formData.name.trim(),
      email: formData.email.trim(),
      status: formData.status,
    });
    setFormData({ name: '', email: '', status: 'pending' });
    setIsExpanded(false);
    setIsSubmitting(false);
  };

  const handleCancel = (): void => {
    setFormData({ name: '', email: '', status: 'pending' });
    setErrors({});
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button className={styles.expandButton} onClick={() => setIsExpanded(true)}>
        <span className={styles.expandIcon}>+</span>
        Add Attendee
      </button>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>
            Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter attendee name"
            className={`${styles.input} ${errors.name ? styles.error : ''}`}
            disabled={isSubmitting}
            autoComplete="name"
          />
          {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={`${styles.input} ${errors.email ? styles.error : ''}`}
            disabled={isSubmitting}
            autoComplete="email"
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="status" className={styles.label}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.select}
            disabled={isSubmitting}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Attendee'}
        </button>
      </div>
    </form>
  );
};
