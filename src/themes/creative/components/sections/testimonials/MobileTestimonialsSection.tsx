'use client';

import { TESTIMONIALS } from '@/config/testimonials';
import { TestimonialCard } from './TestimonialCard';
import styles from './MobileTestimonials.module.css'; // Dedicated mobile styles needed for snap layout
import { AccentSeparator } from '@/themes/creative/components/ui';

export function MobileTestimonialsSection() {
    return (
        <section className={styles.mobileSection}>
            <div className={styles.header}>
                <h2 className={styles.title}>Client Stories</h2>
                <AccentSeparator />
            </div>

            <div className={styles.carouselContainer}>
                <div className={styles.carouselTrack}>
                    {TESTIMONIALS.map((item) => (
                        <div key={item.id} className={styles.cardSnapWrapper}>
                            <TestimonialCard
                                data={item}
                                className={styles.mobileCard}
                            />
                        </div>
                    ))}
                    {/* Add a spacer at only the end to allow scrolling past last item if needed, 
                        but usually CSS padding on track handles this. */}
                </div>
            </div>

            <div className={styles.scrollHint}>
                Swipe for more →
            </div>
        </section>
    );
}
