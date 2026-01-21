'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, FolderKanban, Clock, Filter, Pin } from 'lucide-react';
import { CASE_STUDIES, CATEGORY_LABELS, FEATURED_PROJECTS } from '@/data';
import type { ICaseStudy } from '@/data';
import styles from './CaseStudies.module.css';

// Helper function to get initials from project title
function getInitials(title: string): string {
  return title.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
}

// Featured card with image fallback
function FeaturedCardImage({ project }: { project: ICaseStudy }) {
  const [imageError, setImageError] = useState(false);

  if (!project.thumbnail || imageError) {
    return (
      <span className={styles.featuredInitials}>
        {getInitials(project.title)}
      </span>
    );
  }

  return (
    <Image
      src={project.thumbnail}
      alt={project.title}
      width={120}
      height={90}
      className={styles.featuredHeroImage}
      onError={() => setImageError(true)}
    />
  );
}

interface ProjectCardProps {
  project: ICaseStudy;
}

function ProjectCard({ project }: ProjectCardProps) {
  const categoryLabel =
    project.categoryLabel || CATEGORY_LABELS[project.category];

  return (
    <div className={styles.projectCard}>
      <div className={styles.cardContent}>
        {/* Repo Name and Description */}
        <div className={styles.projectInfo}>
          <div className={styles.projectHeader}>
            <FolderKanban size={16} className={styles.repoIcon} />
            <Link href={`/projects/${project.slug}`} className={styles.projectTitle}>
              {project.title}
            </Link>
            <span className={styles.visibilityBadge}>{categoryLabel}</span>
          </div>
          <p className={styles.projectDescription}>{project.shortDescription}</p>
          <div className={styles.projectMeta}>
            {project.techStack?.slice(0, 4).map((tech, index) => (
              <span key={tech} className={styles.techBadge}>
                <span className={styles.techDot} style={{ backgroundColor: ['#3178c6', '#f1e05a', '#38bdf8', '#a855f7'][index % 4] }}></span>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type FilterType = 'all' | 'client' | 'venture' | 'case-study';
type SortType = 'recent' | 'name' | 'stars';

export function CaseStudies() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredCaseStudies = CASE_STUDIES.filter((cs) => cs.featured);

  // Apply filters
  let filteredProjects =
    activeFilter === 'all'
      ? featuredCaseStudies
      : featuredCaseStudies.filter((p) => p.category === activeFilter);

  // Apply search
  if (searchQuery) {
    filteredProjects = filteredProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sort
  filteredProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }
    // Default: keep original order (recent)
    return 0;
  });

  return (
    <section id="projects" className={styles.caseStudiesSection}>
      <div className={styles.container}>
        <div className={styles.layoutGrid}>
          {/* Featured Projects Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <Pin size={14} />
              <span>Featured</span>
            </div>
            <div className={styles.featuredList}>
              {FEATURED_PROJECTS.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className={styles.featuredCard}
                >
                  <div className={styles.featuredImageWrapper}>
                    <FeaturedCardImage project={project} />
                  </div>
                  <div className={styles.featuredCardBody}>
                    <div className={styles.featuredCardContent}>
                      <FolderKanban size={14} className={styles.featuredIcon} />
                      <span className={styles.featuredTitle}>{project.title}</span>
                    </div>
                    <p className={styles.featuredDesc}>{project.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Header with search, filters, and count */}
            <div className={styles.header}>
              <div className={styles.searchBar}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Find a project..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.filterDropdown}>
                  <button className={styles.filterButton}>
                    <Filter size={14} />
                    Type
                  </button>
                  <div className={styles.dropdownMenu}>
                    <button
                      className={`${styles.dropdownItem} ${activeFilter === 'all' ? styles.active : ''}`}
                      onClick={() => setActiveFilter('all')}
                    >
                      All
                    </button>
                    <button
                      className={`${styles.dropdownItem} ${activeFilter === 'client' ? styles.active : ''}`}
                      onClick={() => setActiveFilter('client')}
                    >
                      Freelancing
                    </button>
                    <button
                      className={`${styles.dropdownItem} ${activeFilter === 'venture' ? styles.active : ''}`}
                      onClick={() => setActiveFilter('venture')}
                    >
                      Personal
                    </button>
                    <button
                      className={`${styles.dropdownItem} ${activeFilter === 'case-study' ? styles.active : ''}`}
                      onClick={() => setActiveFilter('case-study')}
                    >
                      Case Study
                    </button>
                  </div>
                </div>

                <div className={styles.filterDropdown}>
                  <button className={styles.filterButton}>
                    <Clock size={14} />
                    Sort
                  </button>
                  <div className={styles.dropdownMenu}>
                    <button
                      className={`${styles.dropdownItem} ${sortBy === 'recent' ? styles.active : ''}`}
                      onClick={() => setSortBy('recent')}
                    >
                      Recently updated
                    </button>
                    <button
                      className={`${styles.dropdownItem} ${sortBy === 'name' ? styles.active : ''}`}
                      onClick={() => setSortBy('name')}
                    >
                      Name
                    </button>
                  </div>
                </div>

                <span className={styles.resultsCount}>
                  {filteredProjects.length}/{featuredCaseStudies.length}
                </span>
              </div>
            </div>

            {/* Filter tabs */}
            <div className={styles.filterTabs}>
              <button
                className={`${styles.filterTab} ${activeFilter === 'all' ? styles.activeTab : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All <span className={styles.tabCount}>{featuredCaseStudies.length}</span>
              </button>
              <button
                className={`${styles.filterTab} ${activeFilter === 'client' ? styles.activeTab : ''}`}
                onClick={() => setActiveFilter('client')}
              >
                Freelancing <span className={styles.tabCount}>{featuredCaseStudies.filter(p => p.category === 'client').length}</span>
              </button>
              <button
                className={`${styles.filterTab} ${activeFilter === 'venture' ? styles.activeTab : ''}`}
                onClick={() => setActiveFilter('venture')}
              >
                Personal <span className={styles.tabCount}>{featuredCaseStudies.filter(p => p.category === 'venture').length}</span>
              </button>
              <button
                className={`${styles.filterTab} ${activeFilter === 'case-study' ? styles.activeTab : ''}`}
                onClick={() => setActiveFilter('case-study')}
              >
                Case Study <span className={styles.tabCount}>{featuredCaseStudies.filter(p => p.category === 'case-study').length}</span>
              </button>
            </div>

            {/* Projects list */}
            <div className={styles.projectsList}>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <FolderKanban size={48} className={styles.emptyIcon} />
                  <p>No projects match your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
