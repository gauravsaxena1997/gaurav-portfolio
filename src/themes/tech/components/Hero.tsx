'use client';

import { useState, useEffect } from 'react';
import { Linkedin, Mail, MessageSquare, MapPin, Briefcase, Building2, Rocket, Users, Zap } from 'lucide-react';
import { PROFILE } from '@/data';
import styles from './Hero.module.css';

// Month labels for contribution map
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Static contribution map with "HELLO WORLD!" centered with random commits on both sides
// 7 rows (days) x 53 columns (weeks)
// Layout: random(0-2) empty(3) H(4-6) E(8-10) L(12-14) L(16-18) O(20-22) [space23-24] W(25-29) O(31-33) R(35-37) L(39-41) D(43-45) !(47) empty(48) random(49-52)
// 0 = empty, 1 = light green, 2 = medium green, 3 = dark green
// Only animate non-zero cells in columns 49-52 (the random commits on the right)
const ANIMATION_START_COL = 49;

const CONTRIBUTION_MAP: number[][] = [
  // Row 0 (Sun) - clean padding row
  //rand   em H       E       L       L       O      sp  W           O       R       L       D      ! em rand
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  // Row 1 (Mon) - top of letters + exclamation mark top
  [2,0,1,0,3,0,3,0,3,3,3,0,3,0,0,0,3,0,0,0,3,3,3,0,0,3,0,0,0,3,0,3,3,3,0,3,3,0,0,3,0,0,0,3,3,0,0,3,0,1,0,2,0],
  // Row 2 (Tue) + exclamation mark body
  [0,1,0,0,3,0,3,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,3,0,0,3,0,0,0,3,0,3,0,3,0,3,0,3,0,3,0,0,0,3,0,3,0,3,0,0,2,0,1],
  // Row 3 (Wed) - middle of letters + exclamation mark body
  [1,0,2,0,3,3,3,0,3,3,0,0,3,0,0,0,3,0,0,0,3,0,3,0,0,3,0,3,0,3,0,3,0,3,0,3,3,0,0,3,0,0,0,3,0,3,0,3,0,2,0,0,0],
  // Row 4 (Thu) + exclamation mark gap
  [0,2,0,0,3,0,3,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,3,0,0,3,3,0,3,3,0,3,0,3,0,3,0,3,0,3,0,0,0,3,0,3,0,0,0,0,1,0,2],
  // Row 5 (Fri) - bottom of letters + exclamation mark dot
  [0,1,1,0,3,0,3,0,3,3,3,0,3,3,3,0,3,3,3,0,3,3,3,0,0,3,0,0,0,3,0,3,3,3,0,3,0,3,0,3,3,3,0,3,3,0,0,3,0,1,0,0,3],
  // Row 6 (Sat) - clean padding row
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Pre-calculate which cells should animate (non-zero values in cols 47+ including exclamation mark)
// Exclamation mark is at column 47, random commits at 49-52
const ANIMATED_CELLS: { col: number; row: number; delay: number }[] = [];
let delayIdx = 0;

// First animate exclamation mark (column 47)
for (let row = 0; row < 7; row++) {
  if (CONTRIBUTION_MAP[row][47] > 0) {
    ANIMATED_CELLS.push({ col: 47, row, delay: delayIdx * 150 }); // Quick for exclamation
    delayIdx++;
  }
}

// Then animate random commits (columns 49-52) with slower timing
const exclamationDelay = delayIdx * 150 + 500; // Add gap after exclamation
let commitIdx = 0;
for (let col = 49; col < 53; col++) {
  for (let row = 0; row < 7; row++) {
    if (CONTRIBUTION_MAP[row][col] > 0) {
      ANIMATED_CELLS.push({ col, row, delay: exclamationDelay + commitIdx * 400 }); // Slower for commits
      commitIdx++;
    }
  }
}

function ContributionMap() {
  const [visibleCells, setVisibleCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Schedule each cell to become visible at its delay time
    const timers: NodeJS.Timeout[] = [];

    ANIMATED_CELLS.forEach(({ col, row, delay }) => {
      const timer = setTimeout(() => {
        setVisibleCells(prev => new Set(prev).add(`${col}-${row}`));
      }, 1000 + delay); // 1 second initial delay
      timers.push(timer);
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // Check if this cell is an animated cell
  const isAnimatedCell = (col: number, row: number) => {
    return (col === 47 || col >= 49) && CONTRIBUTION_MAP[row][col] > 0;
  };

  // Get the level to display - level0 if not visible yet, actual level if visible
  const getCellLevel = (col: number, row: number) => {
    if (isAnimatedCell(col, row)) {
      return visibleCells.has(`${col}-${row}`) ? CONTRIBUTION_MAP[row][col] : 0;
    }
    return CONTRIBUTION_MAP[row][col];
  };

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
                {CONTRIBUTION_MAP.map((_, rowIdx) => {
                  const level = getCellLevel(colIdx, rowIdx);
                  return (
                    <div
                      key={rowIdx}
                      className={`${styles.contributionCell} ${styles[`level${level}`]}`}
                    />
                  );
                })}
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

function StatsRow() {
  const stats = [
    { value: '6+', label: 'Years Experience' },
    { value: '20+', label: 'Projects Delivered' },
    { value: '30-40%', label: 'Faster with AI' },
    { value: '100%', label: 'Client Satisfaction' },
  ];

  return (
    <div className={styles.statsRow}>
      {stats.map((stat, idx) => (
        <div key={idx} className={styles.statItem}>
          <span className={styles.statValue}>{stat.value}</span>
          <span className={styles.statLabel}>{stat.label}</span>
        </div>
      ))}
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
                <Rocket size={16} className={styles.aboutIcon} />
                Hi there! I&apos;m Gaurav, a freelance full-stack developer with 6+ years of experience
                helping startups and businesses bring their ideas to life. Whether you need a custom
                web application, an e-commerce platform, or a complex business tool &mdash; I&apos;ve got you covered.
              </p>
              <p className={styles.aboutText}>
                <Building2 size={16} className={styles.aboutIcon} />
                With 5+ years at both service-based and product-based companies, I&apos;ve built
                scalable systems serving thousands of users. Now with 1+ year of freelancing, I bring
                that enterprise expertise directly to you.
              </p>
              <p className={styles.aboutTextHighlight}>
                <Zap size={16} className={styles.aboutIcon} />
                My secret sauce? An AI-enhanced workflow that delivers projects 30-40% faster
                without compromising on quality. You get results quicker, and the code stays clean.
              </p>
              <p className={styles.aboutText}>
                <Users size={16} className={styles.aboutIcon} />
                <em>Let&apos;s build something great together.</em>
              </p>
            </div>

            {/* Stats Row */}
            <StatsRow />

            {/* Contribution Map */}
            <ContributionMap />
          </div>
        </div>
      </div>
    </section>
  );
}
