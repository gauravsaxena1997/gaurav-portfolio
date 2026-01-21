'use client';

import { Code, Zap, Plug, Palette, Lightbulb, ShieldCheck, Check, ShoppingCart, Rocket, Cloud, type LucideIcon } from 'lucide-react';
import { SERVICES } from '@/data';
import styles from './Services.module.css';

const ICON_MAP: Record<string, LucideIcon> = {
  code: Code,
  zap: Zap,
  plug: Plug,
  palette: Palette,
  lightbulb: Lightbulb,
  'shield-check': ShieldCheck,
  'shopping-cart': ShoppingCart,
  rocket: Rocket,
  cloud: Cloud,
};

export function Services() {
  return (
    <section id="services" className={styles.servicesSection}>
      <div className={styles.container}>
        {/* Services Grid - GitHub style compact cards */}
        <div className={styles.servicesGrid}>
          {SERVICES.map((service) => {
            const Icon = ICON_MAP[service.icon] || Code;

            return (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <Icon size={20} className={styles.serviceIcon} />
                  </div>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                </div>

                <p className={styles.serviceDescription}>{service.description}</p>

                <div className={styles.featuresList}>
                  {service.features.slice(0, 3).map((feature) => (
                    <div key={feature} className={styles.featureItem}>
                      <Check size={14} className={styles.checkIcon} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a href="#contact" className={styles.setupButton}>
                  Get Started
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
