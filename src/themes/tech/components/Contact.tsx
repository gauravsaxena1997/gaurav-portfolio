'use client';

import { useState } from 'react';
import { Calendar, Send } from 'lucide-react';
import { SUBMIT_BTN_TEXT } from '@/data';
import { useSectionAnimation } from '../hooks';
import { useTheme } from '@/hooks';
import type { SubmitStatus, ContactFormData } from '@/types';
import styles from './Contact.module.css';

const CALENDLY_URL = 'https://calendly.com/gauravsaxena/30min';

export function Contact() {
  const { isDarkTheme } = useTheme();
  const sectionTitleRef = useSectionAnimation('contact');
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const getButtonText = () => {
    switch (submitStatus) {
      case 'loading':
        return SUBMIT_BTN_TEXT.IN_PROGRESS;
      case 'success':
        return SUBMIT_BTN_TEXT.SUCCESS;
      case 'error':
        return SUBMIT_BTN_TEXT.FAILED;
      default:
        return SUBMIT_BTN_TEXT.DEFAULT;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.message.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} code-font`}>
          <span ref={sectionTitleRef} className="section-title"></span>
        </h2>
        <div
          className={`terminal ${!isDarkTheme ? 'light-terminal' : ''}`}
          style={{ maxWidth: 'none' }}
        >
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="terminal-title">contact.html</div>
          </div>
          <div className="terminal-body">
            <div className={styles.contactGrid}>
              {/* Contact Form */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionHeading}>Send a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-name" className="form-label">name: </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-email" className="form-label">email: </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-message" className="form-label">message: </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className="form-control"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!isFormValid || submitStatus === 'loading'}
                  >
                    <Send size={16} />
                    {getButtonText()}
                  </button>
                </form>
              </div>

              {/* Calendly Section */}
              <div className={styles.calendlySection}>
                <h3 className={styles.sectionHeading}>Schedule a Call</h3>
                <div className={styles.calendlyContent}>
                  <Calendar size={48} className={styles.calendarIcon} />
                  <p className={styles.calendlyText}>
                    Prefer a quick call? Book a 30-minute discovery call to
                    discuss your project.
                  </p>
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.calendlyButton}
                  >
                    <Calendar size={18} />
                    Book a Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
