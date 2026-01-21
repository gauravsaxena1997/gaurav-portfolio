'use client';

import { Heart, Star, MessageSquare, FolderKanban } from 'lucide-react';
import { TESTIMONIALS } from '@/data';
import type { ITestimonial } from '@/data';
import styles from './Testimonials.module.css';

interface TestimonialCardProps {
  testimonial: ITestimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.cardHeader}>
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt={testimonial.author}
            className={styles.authorImage}
          />
        ) : (
          <div className={styles.authorPlaceholder}>
            {testimonial.author.charAt(0)}
          </div>
        )}
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{testimonial.author}</span>
          <span className={styles.authorRole}>
            {testimonial.role}
            {testimonial.company && ` @ ${testimonial.company}`}
          </span>
        </div>
      </div>
      <blockquote className={styles.quote}>
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className={styles.cardFooter}>
        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={styles.starIcon} fill="currentColor" />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <MessageSquare size={48} />
      </div>
      <h3 className={styles.emptyTitle}>Testimonials coming soon!</h3>
      <p className={styles.emptyText}>
        I&apos;ve been busy building awesome projects for my clients,
        <br />
        but haven&apos;t gotten around to collecting testimonials yet.
        <br />
        <br />
        In the meantime, check out my work – it speaks for itself!
      </p>
      <a href="#projects" className={styles.emptyButton}>
        <FolderKanban size={16} />
        View My Projects
      </a>
    </div>
  );
}

export function Testimonials() {
  const hasTestimonials = TESTIMONIALS.length > 0;

  return (
    <section id="testimonials" className={styles.testimonialsSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Heart size={20} className={styles.headerIcon} />
          <div className={styles.headerText}>
            <h1 className={styles.title}>Testimonials</h1>
            <p className={styles.subtitle}>
              {hasTestimonials
                ? 'What clients say about working with me'
                : 'Your review could be the first one here!'}
            </p>
          </div>
        </div>

        {hasTestimonials ? (
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
