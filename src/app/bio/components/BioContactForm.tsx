'use client';

import { useState, useCallback, useEffect } from 'react';
import { BioContactForm as BioContactFormConfig } from '@/config/bioPage';
import { BioToast } from './BioToast';

interface BioContactFormProps {
  config: BioContactFormConfig;
  showHeader?: boolean;
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

export function BioContactForm({ config, showHeader = true }: BioContactFormProps) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus({ type: 'loading' });
      // Basic client validation
      const hasName = form.name.trim().length >= 2;
      const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      const hasMessage = form.message.trim().length >= 10;

      if (!hasName || !hasEmail || !hasMessage) {
        setStatus({
          type: 'error',
          message: 'Need your name, email, and a short brief to kick this off. 😊',
        });
        return;
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to send message');
        }

        setStatus({ type: 'success', message: config.successMessage });
        setForm({ name: '', email: '', message: '' });
      } catch (err: unknown) {
        setStatus({
          type: 'error',
          message: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        });
      }
    },
    [form, config.successMessage]
  );

  // Auto-dismiss snackbar for success/error after a short delay
  useEffect(() => {
    if (status.type === 'success' || status.type === 'error') {
      const timer = setTimeout(() => setStatus({ type: 'idle' }), 5200);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <>
      <section className="bio-contact">
        {showHeader && (
          <>
            <div className="bio-contact__header">
              <h2 className="bio-contact__heading">{config.heading}</h2>
              <p className="bio-contact__subheading">{config.subheading}</p>
            </div>
            <hr className="bio-separator" />
          </>
        )}

        <form className="bio-contact__form" onSubmit={handleSubmit} noValidate>
          <div className="bio-contact__field">
            <label htmlFor="bio-name" className="bio-contact__label">
              Name
            </label>
            <input
              id="bio-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="bio-contact__input"
              placeholder={config.namePlaceholder}
              required
              autoComplete="name"
            />
          </div>

          <div className="bio-contact__field">
            <label htmlFor="bio-email" className="bio-contact__label">
              Email
            </label>
            <input
              id="bio-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="bio-contact__input"
              placeholder={config.emailPlaceholder}
              required
              autoComplete="email"
            />
          </div>

          <div className="bio-contact__field">
            <label htmlFor="bio-message" className="bio-contact__label">
              Message
            </label>
            <textarea
              id="bio-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              className="bio-contact__textarea"
              placeholder={config.messagePlaceholder}
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="bio-contact__submit"
            disabled={status.type === 'loading'}
          >
            {status.type === 'loading' ? 'Sending...' : config.submitLabel}
          </button>
        </form>
      </section>

      <BioToast
        message={status.message ?? ''}
        visible={status.type !== 'idle' && !!status.message}
        loading={status.type === 'loading'}
      />
    </>
  );
}
