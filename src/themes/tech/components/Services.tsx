'use client';

import { Package, Star } from 'lucide-react';
import { SERVICES } from '@/data';
import { useSectionAnimation } from '../hooks';
import styles from './Services.module.css';

// Fake metrics for visual appeal
const SERVICE_METRICS: Record<string, { version: string; downloads: string; rating: number }> = {
  'web-development': { version: '2.0.0', downloads: '1.2k', rating: 5 },
  'ai-enhanced-development': { version: '1.5.0', downloads: '980', rating: 5 },
  'backend-development': { version: '3.1.0', downloads: '1.5k', rating: 5 },
  'consulting': { version: '1.0.0', downloads: '650', rating: 5 },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? styles.starFilled : styles.starEmpty}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export function Services() {
  const sectionTitleRef = useSectionAnimation('services');

  return (
    <section id="services" className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} code-font`}>
          <span ref={sectionTitleRef} className="section-title"></span>
        </h2>

        <div className={styles.packagesGrid}>
          {SERVICES.map((service) => {
            const metrics = SERVICE_METRICS[service.id] || {
              version: '1.0.0',
              downloads: '500',
              rating: 5,
            };

            return (
              <div key={service.id} className={styles.packageCard}>
                <div className={styles.packageHeader}>
                  <Package size={20} className={styles.packageIcon} />
                  <span className={styles.packageName}>
                    @gs/{service.id.replace(/-/g, '-')}
                  </span>
                </div>

                <div className={styles.packageMeta}>
                  <span className={styles.version}>v{metrics.version}</span>
                  <StarRating rating={metrics.rating} />
                </div>

                <p className={styles.packageDescription}>{service.description}</p>

                <div className={styles.keywords}>
                  <span className={styles.keywordsLabel}>Keywords:</span>
                  <div className={styles.keywordTags}>
                    {service.features.slice(0, 3).map((feature) => (
                      <span key={feature} className={styles.keywordTag}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
