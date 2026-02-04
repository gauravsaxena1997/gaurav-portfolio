'use client';

import { memo, useState, useCallback, forwardRef, useRef, useEffect } from 'react';
import { validate } from '@/lib/validation';
import { contactFormSchema } from '@/lib/validation/schemas';
import { AppError } from '@/lib/errors/AppError';
import { errorHandler } from '@/lib/errors/ErrorHandler';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  className?: string;
  onRegisterInteractables?: (refs: React.RefObject<HTMLElement | null>[]) => void;
}

interface FormState {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

/**
 * Contact form with name, email, message fields
 * Includes a "Schedule a Call" button for direct booking
 */
export const ContactForm = memo(
  forwardRef<HTMLFormElement, ContactFormProps>(function ContactForm(
    { className, onRegisterInteractables },
    ref
  ) {
    const sendButtonRef = useRef<HTMLButtonElement>(null);

    // Register interactive elements for character tracking
    useEffect(() => {
      if (onRegisterInteractables) {
        onRegisterInteractables([sendButtonRef]);
      }
    }, [onRegisterInteractables]);
    const [formState, setFormState] = useState<FormState>({
      name: '',
      email: '',
      message: '',
    });
    const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user types
        setFieldErrors((prev) => {
          if (!prev[name]) return prev;
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      },
      []
    );

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading' });
        setFieldErrors({});

        try {
          // 1. Client-side Validation (Zod)
          await validate(contactFormSchema, formState);

          // 2. API Request
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formState),
          });

          const data = await response.json();

          if (!response.ok) {
            // Handle API-returned validation errors if any
            if (data.error && typeof data.error === 'object' && data.error.context?.errors) {
              // Map backend validation errors back to fields
              const backendErrors: Record<string, string> = {};
              data.error.context.errors.forEach((err: any) => {
                const field = err.path.split('.').pop();
                if (field) backendErrors[field] = err.message;
              });
              setFieldErrors(backendErrors);
              throw new Error('Validation failed');
            }
            throw new Error(data.error?.message || 'Failed to send message');
          }

          setStatus({
            type: 'success',
            message: "Message sent! I'll get back to you soon.",
          });
          setFormState({ name: '', email: '', message: '', subject: '' });
        } catch (err: unknown) {
          // Check for local Validation Error
          if (err instanceof AppError && err.code === 'VALIDATION_ERROR') {
            const errors: Record<string, string> = {};
            if (err.context?.errors) {
              (err.context.errors as any[]).forEach((e: any) => {
                const field = e.path.split('.').pop();
                if (field) errors[field] = e.message;
              });
            }
            setFieldErrors(errors);
            setStatus({ type: 'idle' }); // Reset status so form is editable
            return;
          }

          // Generic Error
          errorHandler.handleError(err);
          setStatus({
            type: 'error',
            message: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
          });
        }
      },
      [formState]
    );

    return (
      <div className={`${styles.container} ${className || ''}`}>
        <form ref={ref} className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="contact-name" className={styles.label}>
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className={`${styles.input} ${fieldErrors.name ? styles.inputError : ''}`}
              placeholder="Your name"
              required
              autoComplete="name"
            />
            {fieldErrors.name && <span className={styles.errorMessage}>{fieldErrors.name}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="contact-email" className={styles.label}>
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
            {fieldErrors.email && <span className={styles.errorMessage}>{fieldErrors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="contact-message" className={styles.label}>
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              className={`${styles.textarea} ${fieldErrors.message ? styles.inputError : ''}`}
              placeholder="Tell me about your project..."
              rows={4}
              required
            />
            {fieldErrors.message && <span className={styles.errorMessage}>{fieldErrors.message}</span>}
          </div>

          {status.type !== 'idle' && status.type !== 'loading' && (
            <div
              className={`${styles.status} ${status.type === 'success'
                ? styles.success
                : status.type === 'error'
                  ? styles.error
                  : ''
                }`}
            >
              {status.message}
            </div>
          )}

          <button
            ref={sendButtonRef}
            type="submit"
            className={styles.submitButton}
            disabled={status.type === 'loading'}
          >
            {status.type === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    );
  })
);
