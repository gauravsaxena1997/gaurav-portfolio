'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  FolderKanban,
  ShoppingBag,
  Tag,
  BookOpen,
  MessageCircle,
  BookUser,
  X,
  FileCode,
  ArrowRight,
  Star,
  Rocket,
  Linkedin,
  Mail,
  Github,
  Calendar,
  Palette,
} from 'lucide-react';
import { NAV_ITEMS, CASE_STUDIES, FEATURED_PROJECTS } from '@/data';
import { useTheme } from '@/hooks';
import type { SectionId } from '@/data';
import { ThemeInfoModal } from '@/components/shared/ThemeInfoModal';
import styles from './GitHubHeader.module.css';

// Map nav items to GitHub-like icons
const NAV_ICONS: Record<string, React.ReactNode> = {
  home: <BookUser size={16} />,
  projects: <FolderKanban size={16} />,
  services: <ShoppingBag size={16} />,
  skills: <Tag size={16} />,
  blog: <BookOpen size={16} />,
  contact: <MessageCircle size={16} />,
};

interface GitHubHeaderProps {
  activeSection?: SectionId;
  onNavigate?: (sectionId: SectionId) => void;
  isProjectPage?: boolean;
  projectName?: string;
  categoryLabel?: string;
  categoryType?: 'client' | 'venture' | 'case-study';
  currentTheme?: 'creative' | 'github';
  onThemeChange?: (theme: 'creative' | 'github') => void;
}

// Search suggestion item types
interface SearchSuggestion {
  id: string;
  label: string;
  type: 'page' | 'project';
  icon: React.ReactNode;
  sectionId?: SectionId;
  slug?: string;
}

// Build search suggestions from nav items and case studies
const buildSearchSuggestions = (): SearchSuggestion[] => {
  const pageSuggestions: SearchSuggestion[] = NAV_ITEMS.map((item) => ({
    id: `page-${item.id}`,
    label: item.label,
    type: 'page',
    icon: NAV_ICONS[item.id] || <FileCode size={16} />,
    sectionId: item.id as SectionId,
  }));

  const projectSuggestions: SearchSuggestion[] = CASE_STUDIES.map((project) => ({
    id: `project-${project.id}`,
    label: project.title,
    type: 'project',
    icon: <FileCode size={16} />,
    slug: project.slug,
  }));

  return [...pageSuggestions, ...projectSuggestions];
};

export function GitHubHeader({
  activeSection,
  onNavigate,
  isProjectPage = false,
  projectName,
  categoryLabel,
  categoryType,
  currentTheme = 'github',
  onThemeChange,
}: GitHubHeaderProps) {
  const { isDarkTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const allSuggestions = buildSearchSuggestions();
  const filteredSuggestions = searchQuery.trim()
    ? allSuggestions.filter((s) =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSuggestions;

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with /
      if (e.key === '/' && !searchOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Close search with Escape
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Handle click outside to close search and notification
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
        setSearchQuery('');
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };

    if (searchOpen || notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen, notificationOpen]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter' && filteredSuggestions[selectedIndex]) {
      e.preventDefault();
      handleSuggestionClick(filteredSuggestions[selectedIndex]);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'page' && suggestion.sectionId && onNavigate) {
      onNavigate(suggestion.sectionId);
    } else if (suggestion.type === 'project' && suggestion.slug) {
      window.location.href = `/projects/${suggestion.slug}`;
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  const getBadgeClass = () => {
    switch (categoryType) {
      case 'venture':
        return styles.ventureBadge;
      case 'case-study':
        return styles.caseStudyBadge;
      default:
        return styles.clientBadge;
    }
  };

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    if (onNavigate && !isProjectPage) {
      e.preventDefault();
      onNavigate(sectionId as SectionId);
    }
  };

  return (
    <header className={styles.header}>
      {/* Main GitHub-style header bar */}
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          {/* Mobile menu button */}
          <button
            className={styles.menuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          {/* Profile photo as logo */}
          <Link href="/" className={styles.logoLink} onClick={(e) => handleNavClick(e, 'home')}>
            <Image
              src="/profile.jpg"
              alt="Gaurav Saxena"
              width={32}
              height={32}
              className={styles.profilePhoto}
              priority
              sizes="32px"
            />
          </Link>

          {/* Name / Project breadcrumb */}
          <div className={styles.breadcrumb}>
            <Link
              href="/"
              className={styles.username}
              onClick={(e) => handleNavClick(e, 'home')}
            >
              gauravsaxena
            </Link>
            {isProjectPage && projectName && (
              <>
                <span className={styles.separator}>/</span>
                <span className={styles.repoName}>{projectName}</span>
                {categoryLabel && (
                  <span className={`${styles.categoryBadge} ${getBadgeClass()}`}>
                    {categoryLabel}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div
          className={`${styles.searchContainer} ${searchOpen ? styles.searchOpen : ''}`}
          ref={searchContainerRef}
        >
          {!searchOpen ? (
            <button
              className={styles.searchBox}
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={16} className={styles.searchIcon} />
              <span className={styles.searchPlaceholder}>Type / to search</span>
              <span className={styles.searchShortcut}>/</span>
            </button>
          ) : (
            <div className={styles.searchExpanded}>
              <div className={styles.searchInputWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  ref={searchInputRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search pages or projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <button
                  className={styles.searchClose}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  aria-label="Close search"
                >
                  <X size={14} />
                </button>
              </div>
              <div className={styles.searchDropdown}>
                {!searchQuery && (
                  <>
                    <div className={styles.searchSectionLabel}>
                      <Star size={12} />
                      Featured Projects
                    </div>
                    {FEATURED_PROJECTS.map((project) => (
                      <button
                        key={project.id}
                        className={styles.searchSuggestion}
                        onClick={() => {
                          window.location.href = `/projects/${project.slug}`;
                          setSearchOpen(false);
                        }}
                      >
                        <span className={styles.suggestionIcon}>
                          <FolderKanban size={16} />
                        </span>
                        <span className={styles.suggestionLabel}>{project.title}</span>
                        <span className={styles.suggestionType}>Project</span>
                        <ArrowRight size={14} className={styles.suggestionArrow} />
                      </button>
                    ))}
                    <div className={styles.searchDivider} />
                  </>
                )}
                {filteredSuggestions.length > 0 ? (
                  <>
                    <div className={styles.searchSectionLabel}>
                      {searchQuery ? 'Results' : 'Quick Navigation'}
                    </div>
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        className={`${styles.searchSuggestion} ${
                          index === selectedIndex ? styles.searchSuggestionActive : ''
                        }`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <span className={styles.suggestionIcon}>{suggestion.icon}</span>
                        <span className={styles.suggestionLabel}>{suggestion.label}</span>
                        <span className={styles.suggestionType}>
                          {suggestion.type === 'page' ? 'Page' : 'Project'}
                        </span>
                        <ArrowRight size={14} className={styles.suggestionArrow} />
                      </button>
                    ))}
                  </>
                ) : (
                  <div className={styles.searchNoResults}>
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right side icons - theme toggles and notifications */}
        <div className={styles.headerRight}>
          {/* Mode Toggle (Dark/Light) */}
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Theme Switcher (Creative/GitHub) */}
          {onThemeChange && (
            <button
              className={styles.themeToggle}
              onClick={() => setIsThemeModalOpen(true)}
              aria-label="View theme options"
            >
              <Palette size={18} />
            </button>
          )}

          <div className={styles.notificationWrapper} ref={notificationRef}>
            <button
              className={styles.iconButton}
              onClick={() => setNotificationOpen(!notificationOpen)}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className={styles.notificationBadge} />
            </button>
            {notificationOpen && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <Bell size={16} />
                  <span>What&apos;s New</span>
                </div>
                <div className={styles.notificationContent}>
                  <div className={styles.notificationItem}>
                    <div className={styles.notificationIcon}>
                      <Rocket size={18} />
                    </div>
                    <div className={styles.notificationText}>
                      <h4>Latest Project</h4>
                      <p>Check out Lumore - AI E-commerce Demo</p>
                      <Link
                        href="/projects/lumore"
                        className={styles.notificationLink}
                        onClick={() => setNotificationOpen(false)}
                      >
                        View Project <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                  <div className={styles.notificationDivider} />
                  <div className={styles.notificationItem}>
                    <div className={styles.notificationIcon}>
                      <span className={styles.waveEmoji}>👋</span>
                    </div>
                    <div className={styles.notificationText}>
                      <h4>Let&apos;s Connect!</h4>
                      <p>I don&apos;t bite (usually)</p>
                      <div className={styles.socialLinks}>
                        <a
                          href="https://www.linkedin.com/in/gauravsaxena/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialLink}
                        >
                          <Linkedin size={14} />
                        </a>
                        <a
                          href="mailto:helloxgaurav@gmail.com"
                          className={styles.socialLink}
                        >
                          <Mail size={14} />
                        </a>
                        <a
                          href="https://github.com/hellogaurav"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialLink}
                        >
                          <Github size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className={styles.notificationDivider} />
                  <div className={styles.notificationItem}>
                    <div className={styles.notificationIcon}>
                      <span className={styles.briefcaseEmoji}>💼</span>
                    </div>
                    <div className={styles.notificationText}>
                      <h4>Available for Hire</h4>
                      <p>Got a project? Let&apos;s talk!</p>
                      <a
                        href="https://calendly.com/gauravsaxena/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.notificationLink}
                      >
                        <Calendar size={12} /> Book a Call
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation tabs - GitHub style */}
      <nav className={styles.navTabs}>
        <div className={styles.navTabsInner}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={isProjectPage ? `/#${item.id}` : '#'}
              className={`${styles.navTab} ${
                activeSection === item.id ? styles.navTabActive : ''
              }`}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              {NAV_ICONS[item.id]}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <button
              className={styles.mobileMenuClose}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={isProjectPage ? `/#${item.id}` : '#'}
                className={`${styles.mobileNavItem} ${
                  activeSection === item.id ? styles.mobileNavItemActive : ''
                }`}
                onClick={(e) => {
                  handleNavClick(e, item.id);
                  setMobileMenuOpen(false);
                }}
              >
                {NAV_ICONS[item.id]}
                <span>{item.label}</span>
              </Link>
            ))}
            <div className={styles.mobileMenuDivider} />
            <button
              className={styles.mobileThemeToggle}
              onClick={toggleTheme}
            >
              {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
              <span>{isDarkTheme ? 'Light mode' : 'Dark mode'}</span>
            </button>
            {onThemeChange && (
              <button
                className={styles.mobileThemeToggle}
                onClick={() => {
                  setIsThemeModalOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Palette size={18} />
                <span>View theme options</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Theme Info Modal */}
      {onThemeChange && (
        <ThemeInfoModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
          currentTheme={currentTheme}
          onThemeSwitch={onThemeChange}
        />
      )}
    </header>
  );
}
