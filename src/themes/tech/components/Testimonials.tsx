'use client';

import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/data';
import { useSectionAnimation } from '../hooks';
import { useTheme } from '@/hooks';
import type { ITestimonial } from '@/data';
import styles from './Testimonials.module.css';

interface TestimonialCardProps {
  testimonial: ITestimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.matrixEffect}></div>
      <div className={styles.cardContent}>
        <Quote className={styles.quoteIcon} size={32} />
        <blockquote className={styles.quote}>{testimonial.quote}</blockquote>
        <div className={styles.author}>
          {testimonial.image && (
            <img
              src={testimonial.image}
              alt={testimonial.author}
              className={styles.authorImage}
            />
          )}
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{testimonial.author}</span>
            <span className={styles.authorRole}>
              {testimonial.role}
              {testimonial.company && `, ${testimonial.company}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const { isDarkTheme } = useTheme();
  const sectionTitleRef = useSectionAnimation('testimonials');

  // Don't render if no testimonials
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className={styles.testimonialsSection}>
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
            <div className="terminal-title">testimonials.json</div>
          </div>
          <div className="terminal-body">
            <div className={styles.testimonialsGrid}>
              {TESTIMONIALS.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
