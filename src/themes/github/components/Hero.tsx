'use client';

import { useState, useEffect } from 'react';
import { Linkedin, Mail, MessageSquare, MapPin, Briefcase, Building2, Rocket, Users, Zap, FileText, Github } from 'lucide-react';
import { PROFILE } from '@/data';
import type { SectionId } from '@/data';
import styles from './Hero.module.css';

// Month labels for contribution map
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Static contribution map with "HELLO WORLD!" centered with random commits on both sides
const CONTRIBUTION_MAP: number[][] = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,1,0,3,0,3,0,3,3,3,0,3,0,0,0,3,0,0,0,3,3,3,0,0,3,0,0,0,3,0,3,3,3,0,3,3,0,0,3,0,0,0,3,3,0,0,3,0,1,0,2,0],
  [0,1,0,0,3,0,3,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,3,0,0,3,0,0,0,3,0,3,0,3,0,3,0,3,0,3,0,0,0,3,0,3,0,3,0,0,2,0,1],
  [1,0,2,0,3,3,3,0,3,3,0,0,3,0,0,0,3,0,0,0,3,0,3,0,0,3,0,3,0,3,0,3,0,3,0,3,3,0,0,3,0,0,0,3,0,3,0,3,0,2,0,0,0],
  [0,2,0,0,3,0,3,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,3,0,0,3,3,0,3,3,0,3,0,3,0,3,0,3,0,3,0,0,0,3,0,3,0,0,0,0,1,0,2],
  [0,1,1,0,3,0,3,0,3,3,3,0,3,3,3,0,3,3,3,0,3,3,3,0,0,3,0,0,0,3,0,3,3,3,0,3,0,3,0,3,3,3,0,3,3,0,0,3,0,1,0,0,3],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const ANIMATED_CELLS: { col: number; row: number; delay: number }[] = [];
let delayIdx = 0;

for (let row = 0; row < 7; row++) {
  if (CONTRIBUTION_MAP[row][47] > 0) {
    ANIMATED_CELLS.push({ col: 47, row, delay: delayIdx * 150 });
    delayIdx++;
  }
}

const exclamationDelay = delayIdx * 150 + 500;
let commitIdx = 0;
for (let col = 49; col < 53; col++) {
  for (let row = 0; row < 7; row++) {
    if (CONTRIBUTION_MAP[row][col] > 0) {
      ANIMATED_CELLS.push({ col, row, delay: exclamationDelay + commitIdx * 400 });
      commitIdx++;
    }
  }
}

function ContributionMap() {
  const [visibleCells, setVisibleCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    ANIMATED_CELLS.forEach(({ col, row, delay }) => {
      const timer = setTimeout(() => {
        setVisibleCells(prev => new Set(prev).add(`${col}-${row}`));
      }, 1000 + delay);
      timers.push(timer);
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const isAnimatedCell = (col: number, row: number) => {
    return (col === 47 || col >= 49) && CONTRIBUTION_MAP[row][col] > 0;
  };

  const getCellLevel = (col: number, row: number) => {
    if (isAnimatedCell(col, row)) {
      return visibleCells.has(`${col}-${row}`) ? CONTRIBUTION_MAP[row][col] : 0;
    }
    return CONTRIBUTION_MAP[row][col];
  };

  return (
    <div className={styles.contributionWrapper}>
      <div className={styles.contributionMap}>
        <div className={styles.monthLabels}>
          <div className={styles.dayLabelSpacer}></div>
          {MONTHS.map((month, idx) => (
            <span key={idx} className={styles.monthLabel}>{month}</span>
          ))}
        </div>

        <div className={styles.gridWithDays}>
          <div className={styles.dayLabels}>
            {DAYS.map((day, idx) => (
              <span key={idx} className={styles.dayLabel}>{day}</span>
            ))}
          </div>

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

interface HeroProps {
  onNavigate?: (sectionId: SectionId) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const handleContactClick = (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('contact');
    }
  };

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
              <p className={styles.username}>@gauravsaxena</p>
            </div>

            <p className={styles.bio}>{PROFILE.title}</p>

            <a href="#contact" className={styles.ctaButton} onClick={handleContactClick}>
              <MessageSquare size={16} />
              Let&apos;s Talk
            </a>

            <div className={styles.userMeta}>
              <div className={styles.metaItem}>
                <Briefcase size={16} />
                <span>Available for hire</span>
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
                <Github size={16} />
                <a href="https://github.com/gauravsaxena1997" target="_blank" rel="noopener noreferrer">
                  GitHub
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
            {/* README Box */}
            <div className={styles.readmeBox}>
              <div className={styles.readmeHeader}>
                <FileText size={16} />
                <span>README.md</span>
              </div>
              <div className={styles.readmeContent}>
                <h2 className={styles.readmeTitle}>Hi there! 👋</h2>
                <p className={styles.readmeText}>
                  <Rocket size={16} className={styles.readmeIcon} />
                  I&apos;m Gaurav, a freelance full-stack developer with 6+ years of experience
                  helping startups and businesses bring their ideas to life. Whether you need a custom
                  web application, an e-commerce platform, or a complex business tool — I&apos;ve got you covered.
                </p>
                <p className={styles.readmeText}>
                  <Building2 size={16} className={styles.readmeIcon} />
                  With 5+ years at both service-based and product-based companies, I&apos;ve built
                  scalable systems serving thousands of users. Now with 1+ year of freelancing, I bring
                  that enterprise expertise directly to you.
                </p>
                <p className={styles.readmeHighlight}>
                  <Zap size={16} className={styles.readmeIcon} />
                  My secret sauce? An AI-enhanced workflow that delivers projects 30-40% faster
                  without compromising on quality. You get results quicker, and the code stays clean.
                </p>
                <p className={styles.readmeText}>
                  <Users size={16} className={styles.readmeIcon} />
                  <em>Let&apos;s build something great together.</em>
                </p>
              </div>
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
