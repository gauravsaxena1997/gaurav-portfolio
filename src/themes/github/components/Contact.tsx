'use client';

import { useState } from 'react';
import {
  CircleDot,
  MessageCircle,
  Calendar,
  Send,
  FileText,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { SUBMIT_BTN_TEXT } from '@/data';
import { validate } from '@/lib/validation';
import { contactFormSchema } from '@/lib/validation/schemas';
import { AppError } from '@/lib/errors/AppError';
import { errorHandler } from '@/lib/errors/ErrorHandler';
import type { SubmitStatus, ContactFormData } from '@/types';
import styles from './Contact.module.css';

const CALENDLY_URL = 'https://calendly.com/gauravsaxena/30min';

interface IssueTemplate {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: 'form' | 'calendly';
}

const ISSUE_TEMPLATES: IssueTemplate[] = [
  {
    id: 'message',
    icon: <MessageCircle size={20} />,
    title: 'Send a Message',
    description: 'Project inquiries, questions, or just say hello',
    action: 'form',
  },
  {
    id: 'call',
    icon: <Calendar size={20} />,
    title: 'Book a Call',
    description: 'Schedule a 30-minute discovery call',
    action: 'calendly',
  },
];

export function Contact() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const getButtonContent = () => {
    switch (submitStatus) {
      case 'loading':
        return (
          <>
            <Loader2 size={16} className={styles.spinning} />
            {SUBMIT_BTN_TEXT.IN_PROGRESS}
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle2 size={16} />
            {SUBMIT_BTN_TEXT.SUCCESS}
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle size={16} />
            {SUBMIT_BTN_TEXT.FAILED}
          </>
        );
      default:
        return (
          <>
            <Send size={16} />
            Submit new issue
          </>
        );
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
      // 1. Client-Side Validation (Zod)
      await validate(contactFormSchema, formData);

      // 2. API Request
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          template: selectedTemplate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setSelectedTemplate(null);
      } else {
        throw new Error(result.error?.message || 'Submission failed');
      }
    } catch (error) {
      // Handle Zod Validation errors gracefully
      if (error instanceof AppError && error.code === 'VALIDATION_ERROR') {
        // Could show inline errors here if needed
        setSubmitStatus('error');
      } else {
        // Log and report via centralized handler
        errorHandler.handleError(error, { component: 'GithubContact', action: 'handleSubmit' });
        setSubmitStatus('error');
      }
    } finally {
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  const handleTemplateClick = (template: IssueTemplate) => {
    if (template.action === 'calendly') {
      window.open(CALENDLY_URL, '_blank');
    } else {
      setSelectedTemplate(template.id);
    }
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.message.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const selectedTemplateData = ISSUE_TEMPLATES.find(
    (t) => t.id === selectedTemplate
  );

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <CircleDot size={20} className={styles.headerIcon} />
          <div className={styles.headerText}>
            <h1 className={styles.title}>Get in Touch</h1>
            <p className={styles.subtitle}>
              Have a project in mind? Let&apos;s talk!
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className={styles.issueCard}>
          {!selectedTemplate ? (
            <>
              {/* Issue Templates */}
              <div className={styles.templatesHeader}>
                <FileText size={16} />
                <span>Choose an issue template</span>
              </div>
              <div className={styles.templatesGrid}>
                {ISSUE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    className={styles.templateCard}
                    onClick={() => handleTemplateClick(template)}
                  >
                    <div className={styles.templateIcon}>{template.icon}</div>
                    <div className={styles.templateContent}>
                      <h3 className={styles.templateTitle}>{template.title}</h3>
                      <p className={styles.templateDescription}>
                        {template.description}
                      </p>
                    </div>
                    <span className={styles.templateAction}>Get started</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Issue Form */}
              <div className={styles.formHeader}>
                <button
                  className={styles.backButton}
                  onClick={() => setSelectedTemplate(null)}
                >
                  ← Back to templates
                </button>
                <div className={styles.formTemplateBadge}>
                  {selectedTemplateData?.icon}
                  {selectedTemplateData?.title}
                </div>
              </div>

              <form onSubmit={handleSubmit} className={styles.issueForm}>
                {/* Title (Name + Email) */}
                <div className={styles.titleSection}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="contact-name" className={styles.inputLabel}>
                      Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      className={styles.input}
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="contact-email" className={styles.inputLabel}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      className={styles.input}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Message with Write/Preview tabs */}
                <div className={styles.messageSection}>
                  <div className={styles.messageTabs}>
                    <button
                      type="button"
                      className={`${styles.messageTab} ${activeTab === 'write' ? styles.messageTabActive : ''
                        }`}
                      onClick={() => setActiveTab('write')}
                    >
                      <FileText size={14} />
                      Write
                    </button>
                    <button
                      type="button"
                      className={`${styles.messageTab} ${activeTab === 'preview' ? styles.messageTabActive : ''
                        }`}
                      onClick={() => setActiveTab('preview')}
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                  </div>

                  {activeTab === 'write' ? (
                    <textarea
                      id="contact-message"
                      name="message"
                      className={styles.textarea}
                      placeholder="Leave a comment..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <div className={styles.preview}>
                      {formData.message ? (
                        <p>{formData.message}</p>
                      ) : (
                        <p className={styles.previewEmpty}>
                          Nothing to preview
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className={styles.formFooter}>
                  <p className={styles.footerHint}>
                    Your message will be sent directly to my inbox
                  </p>
                  <button
                    type="submit"
                    className={`${styles.submitButton} ${submitStatus === 'success' ? styles.submitSuccess : ''
                      } ${submitStatus === 'error' ? styles.submitError : ''}`}
                    disabled={!isFormValid || submitStatus === 'loading'}
                  >
                    {getButtonContent()}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
