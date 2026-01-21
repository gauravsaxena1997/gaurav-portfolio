'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ExternalLink,
  Github,
  Youtube,
  Star,
  Eye,
  GitFork,
  GitBranch,
  Tag,
  Book,
  ChevronRight,
  Lightbulb,
  Wrench,
  Zap,
  Target,
  CheckCircle2,
  ZoomIn,
} from 'lucide-react';
import { CATEGORY_LABELS } from '@/data';
import { useTheme } from '@/hooks';
import type { ICaseStudy } from '@/data';
import { ImageViewer, VideoPlayer } from '@/components/shared';
import { GitHubHeader } from './GitHubHeader';
import { ProjectExplorer, ProjectExplorerToggle } from './ProjectExplorer';
import '@/themes/github/styles/theme.css';
import styles from './ProjectDetailPage.module.css';

interface ProjectDetailPageProps {
  project: ICaseStudy;
  prevProject: ICaseStudy | null;
  nextProject: ICaseStudy | null;
}

// Reusable bullet list component with icon
function BulletList({
  items,
  icon: Icon = ChevronRight,
}: {
  items: string[];
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <ul className={styles.bulletList}>
      {items.map((item, index) => (
        <li key={index} className={styles.bulletItem}>
          <Icon size={14} className={styles.bulletIcon} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ============================================
// README CONTENT RENDERERS BY CATEGORY
// ============================================

function FreelanceReadme({ project }: { project: ICaseStudy }) {
  const content = project.freelanceContent;
  if (!content) return null;

  return (
    <div className={styles.readme}>
      <div className={styles.readmeHeader}>
        <Book size={16} />
        <span>README</span>
      </div>
      <div className={styles.readmeContent}>
        <h1 className={styles.readmeTitle}>{project.title}</h1>
        <p className={styles.readmeDescription}>{project.shortDescription}</p>

        <h2 className={styles.readmeH2}>The Brief</h2>
        <BulletList items={content.brief} icon={Target} />

        <h2 className={styles.readmeH2}>What I Built</h2>
        <BulletList items={content.scope} icon={Wrench} />

        {content.impact && content.impact.length > 0 && (
          <>
            <h2 className={styles.readmeH2}>Impact</h2>
            <BulletList items={content.impact} icon={Zap} />
          </>
        )}

        {project.features.length > 0 && (
          <>
            <h2 className={styles.readmeH2}>Key Features</h2>
            <BulletList items={project.features} icon={CheckCircle2} />
          </>
        )}

        <h2 className={styles.readmeH2}>Tech Stack</h2>
        <div className={styles.techBadges}>
          {project.techStack.map((tech) => (
            <span key={tech} className={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function VentureReadme({ project }: { project: ICaseStudy }) {
  const content = project.ventureContent;
  if (!content) return null;

  return (
    <div className={styles.readme}>
      <div className={styles.readmeHeader}>
        <Book size={16} />
        <span>README</span>
      </div>
      <div className={styles.readmeContent}>
        <h1 className={styles.readmeTitle}>{project.title}</h1>
        <p className={styles.readmeDescription}>{project.shortDescription}</p>

        <h2 className={styles.readmeH2}>The Story</h2>
        <BulletList items={content.story} icon={Lightbulb} />

        <h2 className={styles.readmeH2}>What It Does</h2>
        <BulletList items={content.whatItDoes} icon={Zap} />

        <h2 className={styles.readmeH2}>Why Use It</h2>
        <BulletList items={content.whyUseIt} icon={CheckCircle2} />

        {project.features.length > 0 && (
          <>
            <h2 className={styles.readmeH2}>Features</h2>
            <BulletList items={project.features} icon={ChevronRight} />
          </>
        )}

        <h2 className={styles.readmeH2}>Tech Stack</h2>
        <div className={styles.techBadges}>
          {project.techStack.map((tech) => (
            <span key={tech} className={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CaseStudyReadme({ project }: { project: ICaseStudy }) {
  const content = project.caseStudyContent;
  if (!content) return null;

  return (
    <div className={styles.readme}>
      <div className={styles.readmeHeader}>
        <Book size={16} />
        <span>README</span>
      </div>
      <div className={styles.readmeContent}>
        <h1 className={styles.readmeTitle}>{project.title}</h1>
        <p className={styles.readmeDescription}>{project.shortDescription}</p>

        <h2 className={styles.readmeH2}>The Concept</h2>
        <BulletList items={content.concept} icon={Lightbulb} />

        <h2 className={styles.readmeH2}>The Approach</h2>
        <BulletList items={content.approach} icon={ChevronRight} />

        {content.toolsUsed && content.toolsUsed.length > 0 && (
          <>
            <h2 className={styles.readmeH2}>Tools & Technology</h2>
            <BulletList items={content.toolsUsed} icon={Wrench} />
          </>
        )}

        {content.learnings && content.learnings.length > 0 && (
          <>
            <h2 className={styles.readmeH2}>Key Takeaways</h2>
            <BulletList items={content.learnings} icon={Zap} />
          </>
        )}

        <h2 className={styles.readmeH2}>Tech Stack</h2>
        <div className={styles.techBadges}>
          {project.techStack.map((tech) => (
            <span key={tech} className={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ProjectDetailPage({
  project,
  prevProject,
  nextProject,
}: ProjectDetailPageProps) {
  const { isDarkTheme } = useTheme();
  const categoryLabel =
    project.categoryLabel || CATEGORY_LABELS[project.category];

  // Image viewer state
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Get all images for the viewer (include hero image when video is present)
  const allImages = project.images || [];

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  return (
    <div className={`tech-theme ${!isDarkTheme ? 'light-theme' : ''}`}>
      {/* GitHub-style Header with category badge */}
      <GitHubHeader
        isProjectPage
        projectName={project.slug}
        categoryLabel={categoryLabel}
        categoryType={project.category}
      />

      {/* Project Explorer Sidebar */}
      <ProjectExplorer
        currentSlug={project.slug}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className={styles.pageContainer}>
        {/* Action Bar */}
        <div className={styles.actionBar}>
          <div className={styles.actionBarLeft}>
            {/* Mobile Explorer Toggle */}
            <ProjectExplorerToggle
              onClick={() => setIsMobileSidebarOpen(true)}
              className={styles.explorerToggle}
            />
            <div className={styles.branchSelector}>
              <GitBranch size={14} />
              <span>main</span>
            </div>
            <span className={styles.branchStat}>
              <GitBranch size={14} />
              1 Branch
            </span>
            <span className={styles.branchStat}>
              <Tag size={14} />
              0 Tags
            </span>
          </div>
          <div className={styles.actionBarRight}>
            <div className={styles.repoStats}>
              <span className={styles.repoStat}>
                <Eye size={14} />
                Watch
              </span>
              <span className={styles.repoStat}>
                <GitFork size={14} />
                Fork
              </span>
              <span className={styles.repoStat}>
                <Star size={14} />
                Star
              </span>
            </div>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.codeButton}
              >
                <ExternalLink size={16} />
                Visit Site
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.codeButton}
              >
                <Github size={16} />
                Code
              </a>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className={styles.twoColumnLayout}>
          {/* Main Content Column */}
          <main className={styles.mainColumn}>
            {/* Video/Image Preview with Frame */}
            <div className={styles.previewSection}>
              <div className={styles.previewFrame}>
                {project.heroVideo ? (
                  <VideoPlayer
                    src={project.heroVideo}
                    autoPlay
                    loop
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                ) : project.images && project.images[0] ? (
                  <div
                    className={styles.previewImageClickable}
                    onClick={() => openViewer(0)}
                  >
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className={styles.previewImage}
                      priority
                      quality={100}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
                    />
                    <div className={styles.zoomOverlay}>
                      <ZoomIn size={32} />
                    </div>
                  </div>
                ) : (
                  <div className={styles.previewPlaceholder}>
                    <span>{project.title.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* README Section */}
            {project.category === 'client' && (
              <FreelanceReadme project={project} />
            )}
            {project.category === 'venture' && (
              <VentureReadme project={project} />
            )}
            {project.category === 'case-study' && (
              <CaseStudyReadme project={project} />
            )}

            {/* Screenshots */}
            {allImages.length > 0 && (
              <div className={styles.screenshotsSection}>
                <h3 className={styles.screenshotsTitle}>Screenshots</h3>
                <div className={styles.screenshotsGrid}>
                  {allImages.map((image, index) => (
                    <div
                      key={image}
                      className={styles.screenshotItem}
                      onClick={() => openViewer(index)}
                    >
                      <Image
                        src={image}
                        alt={`${project.title} screenshot ${index + 1}`}
                        fill
                        className={styles.screenshotImage}
                        quality={100}
                        sizes="(max-width: 600px) 100vw, 50vw"
                      />
                      <div className={styles.screenshotOverlay}>
                        <ZoomIn size={24} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Viewer Modal */}
            <ImageViewer
              images={allImages}
              initialIndex={viewerIndex}
              isOpen={isViewerOpen}
              onClose={() => setIsViewerOpen(false)}
              alt={project.title}
            />

          </main>

          {/* Sidebar Column */}
          <aside className={styles.sidebar}>
            {/* About Section */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>About</h3>
              <p className={styles.sidebarDescription}>
                {project.shortDescription}
              </p>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sidebarLink}
                >
                  <ExternalLink size={14} />
                  {new URL(project.liveUrl).hostname}
                </a>
              )}
            </div>

            {/* Highlights / Stats */}
            {project.highlights && project.highlights.length > 0 && (
              <div className={styles.sidebarSection}>
                <h3 className={styles.sidebarTitle}>Highlights</h3>
                <ul className={styles.statsList}>
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className={styles.statItem}>
                      <Star size={14} className={styles.statIcon} />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages / Tech Stack */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Languages</h3>
              <div className={styles.languageBar}>
                {project.techStack.slice(0, 4).map((tech, i) => (
                  <div
                    key={tech}
                    className={styles.languageSegment}
                    style={{
                      width: `${100 / Math.min(project.techStack.length, 4)}%`,
                      backgroundColor: ['#f1e05a', '#3178c6', '#38bdf8', '#a855f7'][i % 4],
                    }}
                  />
                ))}
              </div>
              <ul className={styles.languageList}>
                {project.techStack.map((tech, i) => (
                  <li key={tech} className={styles.languageItem}>
                    <span
                      className={styles.languageDot}
                      style={{
                        backgroundColor: ['#f1e05a', '#3178c6', '#38bdf8', '#a855f7'][i % 4],
                      }}
                    />
                    <span className={styles.languageName}>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Links</h3>
              <ul className={styles.linksList}>
                {project.liveUrl && (
                  <li>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sidebarLink}
                    >
                      <ExternalLink size={14} />
                      Live Site
                    </a>
                  </li>
                )}
                {project.githubUrl && (
                  <li>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sidebarLink}
                    >
                      <Github size={14} />
                      Source Code
                    </a>
                  </li>
                )}
                {project.youtubeUrl && (
                  <li>
                    <a
                      href={project.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sidebarLink}
                    >
                      <Youtube size={14} />
                      YouTube
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
