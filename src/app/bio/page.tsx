'use client';

import { useState, useEffect } from 'react';
import { bioConfig } from '@/config/bioPage';
import { BioContactForm } from './components/BioContactForm';
import { BioToast } from './components/BioToast';
import { Award, Rocket, Target, Sparkles, ShieldCheck, Trophy } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiWhatsapp, SiCalendly } from 'react-icons/si';

const iconMap = {
  Award,
  Rocket,
  Target,
  Sparkles,
  ShieldCheck,
  Trophy,
  Linkedin: FaLinkedin,
  Github: FaGithub,
  MessageCircle: SiWhatsapp,
  CalendarClock: SiCalendly,
  Whatsapp: SiWhatsapp,
  Calendly: SiCalendly,
};

export default function BioPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 5200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const { hero, stats, momentumLine, contactForm, milestones, badges, links, callout } = bioConfig;

  const handleBadgeClick = () => {
    setToastMessage('Starting Instagram from scratch, documenting daily builds, learnings, and proof. Want to collaborate? Drop a note above.');
  };

  return (
    <main className="bio-page">
      {/* ── Hero ── */}
      <section className="bio-hero">
        <div className="bio-hero__avatar-ring">
          <img
            src={hero.avatarUrl}
            alt={hero.name}
            className="bio-hero__avatar"
            width={94}
            height={94}
            loading="eager"
          />
        </div>
        <div className="bio-hero__info">
          <h1 className="bio-hero__name">{hero.name}</h1>
          <span className="bio-hero__handle">{hero.handle}</span>
        </div>
        <p className="bio-hero__bio">{hero.bio}</p>
      </section>

      {/* ── Stats ── */}
      <section className="bio-stats">
        <div className="bio-stats__row">
          {stats.map((stat) => (
            <div key={stat.label} className="bio-stats__item">
              <span className="bio-stats__value">{stat.value}</span>
              {(() => {
                const words = stat.label.split(' ');
                const first = words.shift() || '';
                const rest = words.join(' ');
                return (
                  <span className="bio-stats__label">
                    {first}
                    <br />
                    {rest}
                  </span>
                );
              })()}
            </div>
          ))}
        </div>
        <p className="bio-momentum">{momentumLine}</p>
      </section>

      {/* ── Lead Capture ── */}
      <div className="bio-contact-shell">
        <div className="bio-contact__header">
          <h2 className="bio-contact__heading">{contactForm.heading}</h2>
          <p className="bio-contact__subheading">{contactForm.subheading}</p>
          <hr className="bio-separator bio-separator--spaced" />
        </div>
        <BioContactForm config={contactForm} showHeader={false} />
      </div>

      {/* ── Milestones ── */}
      <section className="bio-milestones">
        <h2 className="bio-section-title">Milestones</h2>
        <hr className="bio-separator" />
        <div className="bio-milestones__list">
          {milestones.map((m) => {
            const iconFor = m.title.toLowerCase().includes('client')
              ? Target
              : m.title.toLowerCase().includes('consistently')
              ? Sparkles
              : m.title.toLowerCase().includes('case')
              ? Award
              : ShieldCheck;
            const Icon = iconFor;
            return (
              <div key={m.title} className="bio-milestones__card">
                <div className="bio-milestones__icon">
                  <Icon size={18} />
                </div>
                <span className="bio-milestones__title">{m.title}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Badges ── */}
      <section className="bio-badges">
        <h2 className="bio-section-title">My Achievements</h2>
        <hr className="bio-separator" />
        <div className="bio-badges__card">
          <div className="bio-badges__grid">
            {badges.map((badge) => (
              <div
                key={badge.title}
                className="bio-badges__item"
                role="button"
                tabIndex={0}
                onClick={handleBadgeClick}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleBadgeClick()}
              >
                {(() => {
                  const Icon = badge.iconName ? iconMap[badge.iconName] : undefined;
                  return (
                    <div className="bio-badges__circle">
                      {Icon ? <Icon size={28} /> : badge.icon || badge.title.charAt(0)}
                    </div>
                  );
                })()}
                <span className="bio-badges__title">{badge.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Useful Links (icon grid) ── */}
      <section className="bio-links-grid">
        <h2 className="bio-section-title">Useful Links</h2>
        <hr className="bio-separator" />
        <div className="bio-links-grid__wrap">
          {links
            .filter((l) => l.kind !== 'portfolio')
            .map((link) => {
              const Icon = link.iconName ? iconMap[link.iconName] : undefined;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bio-links-grid__item bio-links-grid__item--${link.iconName ?? 'default'}`}
                >
                  <div className="bio-links-grid__icon">{Icon ? <Icon size={32} /> : link.label.charAt(0)}</div>
                  <span className="bio-links-grid__label">{link.label}</span>
                </a>
              );
            })}
        </div>
      </section>

      {/* ── Callout Footer ── */}
      <footer className="bio-callout">
        <p className="bio-callout__text">{callout.text}</p>
        <a
          href={callout.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="bio-callout__cta"
        >
          {callout.ctaLabel} <span className="bio-callout__arrow">→</span>
        </a>
      </footer>

      <BioToast message={toastMessage ?? ''} visible={!!toastMessage} />
    </main>
  );
}
