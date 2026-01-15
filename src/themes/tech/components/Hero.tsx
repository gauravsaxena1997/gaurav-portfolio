'use client';

import { Linkedin, Mail, MessageSquare, MapPin, Briefcase } from 'lucide-react';
import { PROFILE } from '@/data';
import styles from './Hero.module.css';

// Month labels for contribution map
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Static contribution map with "HELLO!" spelled out clearly
// 7 rows (days) x 53 columns (weeks)
// Grid renders column-by-column (left to right), each column top-to-bottom
// Letter positions: H(9-12), E(15-18), L(21-24), L(27-30), O(33-36), !(39)
// 0 = empty, 1 = light green, 2 = medium green, 3 = dark green
const CONTRIBUTION_MAP: number[][] = [
  // Row 0 (Sun) - top padding with sparse activity
  //       padding   H         E         L         L         O         !    padding
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0],
  // Row 1 (Mon) - top of letters: H sides, E top bar, L top, L top, O top curve, ! top
  [0,1,0,0,0,0,0,0,0,3,0,0,3,0,0,3,3,3,3,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,3,0,0,2,0,0,0,0,0,1,0,0,0,0],
  // Row 2 (Tue) - H sides, E left, L left, L left, O sides, ! body
  [0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,3,0,0,3,0,0,0,0,1,0,0,0,0,2,0,0,0],
  // Row 3 (Wed) - H crossbar, E middle bar, L left, L left, O sides, ! body
  [0,0,0,0,0,1,0,0,0,3,3,3,3,0,0,3,3,3,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,3,0,0,3,0,0,0,1,0,0,2,0,0,0,0,1,0],
  // Row 4 (Thu) - H sides, E left, L left, L left, O sides, ! gap
  [0,0,1,0,0,0,0,0,0,3,0,0,3,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2],
  // Row 5 (Fri) - H sides, E bottom bar, L bottom bar, L bottom bar, O bottom curve, ! dot
  [0,0,0,0,1,0,0,0,0,3,0,0,3,0,0,3,3,3,3,0,0,3,3,3,3,0,0,3,3,3,3,0,0,0,3,3,0,0,0,3,0,2,0,0,0,1,0,0,0,0,0,0,0],
  // Row 6 (Sat) - bottom padding with sparse activity
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
];

function ContributionMap() {
  return (
    <div className={styles.contributionWrapper}>
      <div className={styles.contributionMap}>
        {/* Month labels */}
        <div className={styles.monthLabels}>
          <div className={styles.dayLabelSpacer}></div>
          {MONTHS.map((month, idx) => (
            <span key={idx} className={styles.monthLabel}>{month}</span>
          ))}
        </div>

        <div className={styles.gridWithDays}>
          {/* Day labels */}
          <div className={styles.dayLabels}>
            {DAYS.map((day, idx) => (
              <span key={idx} className={styles.dayLabel}>{day}</span>
            ))}
          </div>

          {/* Contribution grid */}
          <div className={styles.contributionGrid}>
            {Array.from({ length: 53 }).map((_, colIdx) => (
              <div key={colIdx} className={styles.contributionCol}>
                {CONTRIBUTION_MAP.map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className={`${styles.contributionCell} ${styles[`level${row[colIdx]}`]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.contributionLegend}>
          <span className={styles.legendLabel}>Less</span>
          <div className={`${styles.contributionCell} ${styles.level0}`} />
          <div className={`${styles.contributionCell} ${styles.level1}`} />
          <div className={`${styles.contributionCell} ${styles.level2}`} />
          <div className={`${styles.contributionCell} ${styles.level3}`} />
          <span className={styles.legendLabel}>More</span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.profileLayout}>
          {/* Left Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.avatarWrapper}>
              <img
                src="/profile.jpg"
                alt={PROFILE.name}
                className={styles.avatar}
              />
              <div className={styles.statusBadge}>
                <span className={styles.statusDot}></span>
              </div>
            </div>

            <div className={styles.userInfo}>
              <h1 className={styles.displayName}>{PROFILE.name}</h1>
            </div>

            <a href="#contact" className={styles.ctaButton}>
              <MessageSquare size={16} />
              Let&apos;s Talk
            </a>

            <div className={styles.userMeta}>
              <div className={styles.metaItem}>
                <Briefcase size={16} />
                <span>{PROFILE.title}</span>
              </div>
              <div className={styles.metaItem}>
                <MapPin size={16} />
                <span>{PROFILE.location}</span>
              </div>
              <div className={styles.metaItem}>
                <Linkedin size={16} />
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
              <div className={styles.metaItem}>
                <Mail size={16} />
                <a href={`mailto:${PROFILE.email}`}>Email</a>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className={styles.mainContent}>
            {/* About Section */}
            <div className={styles.aboutBox}>
              <p className={styles.aboutText}>
                Hi there! I&apos;m Gaurav, a freelance full-stack developer with 6+ years of experience
                helping startups and businesses bring their ideas to life. Whether you need a custom
                web application, an e-commerce platform, or a complex business tool &mdash; I&apos;ve got you covered.
              </p>
              <p className={styles.aboutText}>
                Previously at <strong>Zetwerk</strong> and <strong>Ongraph</strong>, I&apos;ve built
                scalable systems serving thousands of users. Now I bring that expertise directly to you.
              </p>
              <p className={styles.aboutTextHighlight}>
                My secret sauce? An AI-enhanced workflow that delivers projects 30-40% faster
                without compromising on quality. You get results quicker, and the code stays clean.
              </p>
              <p className={styles.aboutText}>
                <em>Let&apos;s build something great together.</em>
              </p>
            </div>

            {/* Contribution Map */}
            <ContributionMap />
          </div>
        </div>
      </div>
    </section>
  );
}
