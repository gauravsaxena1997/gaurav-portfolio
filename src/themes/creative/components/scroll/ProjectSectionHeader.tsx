'use client';

import { useEffect, useRef } from 'react';
import { useScrollContext } from '../../context/ScrollContext';
import styles from './ProjectSectionHeader.module.css';

const PROJECTS = [
  { name: 'PROJECT ALPHA', index: 0 },
  { name: 'PROJECT BETA', index: 1 },
  { name: 'PROJECT GAMMA', index: 2 },
];

export function ProjectSectionHeader() {
  const { currentProjectIndex, isInProjectsSection } = useScrollContext();
  const headerRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const prevIndexRef = useRef(0);

  // Handle flip animation and update content via DOM manipulation
  useEffect(() => {
    if (currentProjectIndex !== prevIndexRef.current) {
      const numberEl = numberRef.current;
      const nameEl = nameRef.current;

      if (numberEl && nameEl) {
        // Add flipping class
        numberEl.classList.add(styles.flipping);
        nameEl.classList.add(styles.flipping);

        // After 150ms, update content and remove flipping class
        const timer = setTimeout(() => {
          const project = PROJECTS[currentProjectIndex] || PROJECTS[0];
          numberEl.textContent = String(project.index + 1).padStart(2, '0');
          nameEl.textContent = project.name;

          numberEl.classList.remove(styles.flipping);
          nameEl.classList.remove(styles.flipping);
        }, 150);

        prevIndexRef.current = currentProjectIndex;

        return () => clearTimeout(timer);
      }
    }
  }, [currentProjectIndex]);

  const initialProject = PROJECTS[0];
  const initialNumber = String(initialProject.index + 1).padStart(2, '0');

  return (
    <header
      ref={headerRef}
      className={`${styles.projectHeader} ${isInProjectsSection ? styles.visible : ''}`}
    >
      <div ref={numberRef} className={styles.projectNumber}>
        {initialNumber}
      </div>
      <span className={styles.divider}>|</span>
      <h2 ref={nameRef} className={styles.projectName}>
        {initialProject.name}
      </h2>
    </header>
  );
}
