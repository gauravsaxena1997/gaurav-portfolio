'use client';

import { memo, useState, useCallback, forwardRef } from 'react';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  className?: string;
}

interface FormState {
  name: string;
  email: string;
  message: string;
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
    { className },
    ref
  ) {
    const [formState, setFormState] = useState<FormState>({
      name: '',
      email: '',
      message: '',
    });
    const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
      },
      []
    );

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading' });

        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formState),
          });

          if (!response.ok) {
            throw new Error('Failed to send message');
          }

          setStatus({
            type: 'success',
            message: "Message sent! I'll get back to you soon.",
          });
          setFormState({ name: '', email: '', message: '' });
        } catch {
          setStatus({
            type: 'error',
            message: 'Something went wrong. Please try again.',
          });
        }
      },
      [formState]
    );

    const handleScheduleCall = useCallback(() => {
      // Replace with your actual Calendly/Cal.com link
      window.open('https://cal.com/gaurav', '_blank', 'noopener,noreferrer');
    }, []);

    return (
      <div className={`${styles.container} ${className || ''}`}>
        <h2 className={styles.title}>Get in Touch</h2>
        <p className={styles.subtitle}>
          Have a project in mind? Let&apos;s build something great together.
        </p>

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
              className={styles.input}
              placeholder="Your name"
              required
              autoComplete="name"
            />
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
              className={styles.input}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
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
              className={styles.textarea}
              placeholder="Tell me about your project..."
              rows={4}
              required
            />
          </div>

          {status.type !== 'idle' && (
            <div
              className={`${styles.status} ${
                status.type === 'success'
                  ? styles.success
                  : status.type === 'error'
                    ? styles.error
                    : ''
              }`}
            >
              {status.type === 'loading' ? 'Sending...' : status.message}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={status.type === 'loading'}
          >
            {status.type === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>or</span>
        </div>

        <button
          type="button"
          className={styles.scheduleButton}
          onClick={handleScheduleCall}
        >
          Schedule a Call
        </button>
      </div>
    );
  })
);
