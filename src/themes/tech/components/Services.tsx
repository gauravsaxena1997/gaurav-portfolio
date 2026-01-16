'use client';

import { Code, Zap, Plug, Palette, Lightbulb, ShieldCheck, type LucideIcon } from 'lucide-react';
import { SERVICES } from '@/data';
import { useSectionAnimation } from '../hooks';
import styles from './Services.module.css';

const ICON_MAP: Record<string, LucideIcon> = {
  code: Code,
  zap: Zap,
  plug: Plug,
  palette: Palette,
  lightbulb: Lightbulb,
  'shield-check': ShieldCheck,
};

export function Services() {
  const sectionTitleRef = useSectionAnimation('services');

  return (
    <section id="services" className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} code-font`}>
          <span ref={sectionTitleRef} className="section-title"></span>
        </h2>

        <div className={styles.servicesGrid}>
          {SERVICES.map((service) => {
            const Icon = ICON_MAP[service.icon] || Code;

            return (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.serviceHeader}>
                  <div className={styles.iconWrapper}>
                    <Icon size={24} className={styles.serviceIcon} />
                  </div>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                </div>

                <p className={styles.serviceDescription}>{service.description}</p>

                <ul className={styles.featuresList}>
                  {service.features.map((feature) => (
                    <li key={feature} className={styles.featureItem}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
