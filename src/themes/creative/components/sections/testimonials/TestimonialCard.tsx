'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Testimonial } from '@/config/testimonials';
import styles from './Testimonials.module.css';

interface TestimonialCardProps {
    data: Testimonial;
    className?: string; // Allow custom classes (desktop vs mobile sizing)
}

export function TestimonialCard({ data, className = '' }: TestimonialCardProps) {
    // Generate initials for fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`${styles.card} ${className}`}>
            {/* Quote Section */}
            <div className={styles.quoteContainer}>
                <span className={styles.quoteIcon}>❝</span>
                <p className={styles.quoteText}>{data.quote}</p>
            </div>

            {/* Author Meta */}
            <div className={styles.authorMeta}>
                <div className={styles.avatarWrapper}>
                    {data.avatar ? (
                        <Image
                            src={data.avatar}
                            alt={data.name}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div className={styles.initialsFallback}>
                            {getInitials(data.name)}
                        </div>
                    )}
                </div>

                <div className={styles.infoColumn}>
                    <h3 className={styles.authorName}>{data.name}</h3>
                    <span className={styles.designation}>{data.designation}</span>
                </div>

                {data.projectUrl && (
                    <div className={styles.projectWrapper}>
                        <a
                            href={data.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.projectLink}
                            aria-label={`View project for ${data.name}`}
                        >
                            View Project <ExternalLink size={14} />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
