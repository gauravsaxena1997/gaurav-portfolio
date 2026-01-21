'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode,
  PanelLeft,
  X,
} from 'lucide-react';
import { CASE_STUDIES } from '@/data';
import type { ICaseStudy, CategoryType } from '@/data';
import styles from './ProjectExplorer.module.css';

interface ProjectExplorerProps {
  currentSlug: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Group projects by category
function groupProjectsByCategory(projects: ICaseStudy[]) {
  const groups: Record<CategoryType, ICaseStudy[]> = {
    'case-study': [],
    client: [],
    venture: [],
  };

  projects.forEach((project) => {
    groups[project.category].push(project);
  });

  return groups;
}

// Category folder component
function CategoryFolder({
  category,
  label,
  projects,
  currentSlug,
  defaultOpen = true, // All folders expanded by default
}: {
  category: CategoryType;
  label: string;
  projects: ICaseStudy[];
  currentSlug: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasActiveProject = projects.some((p) => p.slug === currentSlug);

  if (projects.length === 0) return null;

  return (
    <div className={styles.folder}>
      <button
        className={`${styles.folderHeader} ${hasActiveProject ? styles.folderActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.folderIcon}>
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>
        <span className={styles.folderIconType}>
          {isOpen ? <FolderOpen size={18} /> : <Folder size={18} />}
        </span>
        <span className={styles.folderName}>{label}</span>
        <span className={styles.folderCount}>{projects.length}</span>
      </button>

      {isOpen && (
        <div className={styles.folderContent}>
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className={`${styles.fileItem} ${
                project.slug === currentSlug ? styles.fileActive : ''
              }`}
            >
              <FileCode size={16} className={styles.fileIcon} />
              <span className={styles.fileName}>{project.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectExplorer({
  currentSlug,
  isMobileOpen = false,
  onMobileClose,
}: ProjectExplorerProps) {
  const groupedProjects = groupProjectsByCategory(CASE_STUDIES);

  const sidebarContent = (
    <>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>PROJECTS</span>
      </div>

      {/* Projects Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Folder size={14} />
          <span>PROJECTS</span>
        </div>

        <div className={styles.tree}>
          <CategoryFolder
            category="case-study"
            label="Case Studies"
            projects={groupedProjects['case-study']}
            currentSlug={currentSlug}
          />
          <CategoryFolder
            category="client"
            label="Freelancing Work"
            projects={groupedProjects.client}
            currentSlug={currentSlug}
          />
          <CategoryFolder
            category="venture"
            label="Personal Ventures"
            projects={groupedProjects.venture}
            currentSlug={currentSlug}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className={styles.mobileOverlay} onClick={onMobileClose}>
          <aside
            className={styles.mobileSidebar}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.mobileHeader}>
              <span className={styles.headerTitle}>EXPLORER</span>
              <button
                className={styles.mobileCloseButton}
                onClick={onMobileClose}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Projects Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Folder size={14} />
                <span>PROJECTS</span>
              </div>

              <div className={styles.tree}>
                <CategoryFolder
                  category="case-study"
                  label="Case Studies"
                  projects={groupedProjects['case-study']}
                  currentSlug={currentSlug}
                />
                <CategoryFolder
                  category="client"
                  label="Freelancing Work"
                  projects={groupedProjects.client}
                  currentSlug={currentSlug}
                />
                <CategoryFolder
                  category="venture"
                  label="Personal Ventures"
                  projects={groupedProjects.venture}
                  currentSlug={currentSlug}
                />
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

// Toggle button for mobile (to be placed in the header or page)
export function ProjectExplorerToggle({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={`${styles.mobileToggle} ${className || ''}`}
      onClick={onClick}
      aria-label="Open project explorer"
    >
      <PanelLeft size={20} />
    </button>
  );
}
