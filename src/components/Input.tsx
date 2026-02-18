import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  const inputClass = `${styles.input} ${error ? styles.error : ''} ${className}`;

  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <input className={inputClass} {...props} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => {
  const textareaClass = `${styles.textarea} ${error ? styles.error : ''} ${className}`;

  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <textarea className={textareaClass} {...props} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
