/**
 * Compiles all portfolio data into a single knowledge base string
 * for the AI chatbot's system prompt context.
 * Cached at module level — computed once per server cold start.
 */

import { PROFILE, EDUCATION } from '@/data/profile';
import { CASE_STUDIES } from '@/data/caseStudies';
import { SERVICES } from '@/data/services';
import { SKILL_CATEGORIES } from '@/data/skills';
import { FAQ_ITEMS } from '@/config/faq';
import { CONTACT_INFO, HERO_CONTENT } from '@/config';
import { TESTIMONIALS } from '@/config/testimonials';
import { STATS_DATA } from '@/config/stats';
import { BLOG_POSTS } from '@/data/blog';

function buildProfileContext(): string {
  return `## Profile
- Name: ${PROFILE.name}
- Title: ${PROFILE.title}
- Tagline: ${PROFILE.tagline}
- Experience: ${PROFILE.experience}
- Location: ${PROFILE.location}
- Email: ${PROFILE.email}
- LinkedIn: ${PROFILE.linkedin}
- GitHub: ${PROFILE.github || 'N/A'}
- Current Focus: ${PROFILE.currentFocus}
- Hero Tagline: ${HERO_CONTENT.tagline}
- Hero Subtitle: ${HERO_CONTENT.subtitle}
${PROFILE.domains ? `- Industry Domains: ${PROFILE.domains.join(', ')}` : ''}

## Education
${EDUCATION.map((e) => `- ${e.title}${e.branch ? ` (${e.branch})` : ''}, ${e.institution}, ${e.passOutYear}`).join('\n')}`;
}

function buildServicesContext(): string {
  return `## Services
${SERVICES.map(
    (s) =>
      `- **${s.title}**: ${s.description}. Benefit: ${s.benefit || 'N/A'}. Features: ${s.features.join(', ')}`
  ).join('\n')}`;
}

function buildProjectsContext(): string {
  return `## Projects & Case Studies
${CASE_STUDIES.map((cs) => {
    let d = `- **${cs.title}** (${cs.category}): ${cs.shortDescription}. Tech: ${cs.techStack.join(', ')}`;
    if (cs.liveUrl) d += `. URL: ${cs.liveUrl}`;
    if (cs.highlights) d += `. Highlights: ${cs.highlights.join(', ')}`;
    if (cs.freelanceContent) {
      d += `\n  Brief: ${cs.freelanceContent.brief.join('; ')}`;
      d += `\n  Scope: ${cs.freelanceContent.scope.join('; ')}`;
      if (cs.freelanceContent.impact) d += `\n  Impact: ${cs.freelanceContent.impact.join('; ')}`;
    }
    if (cs.ventureContent) {
      d += `\n  Story: ${cs.ventureContent.story.join('; ')}`;
      d += `\n  What It Does: ${cs.ventureContent.whatItDoes.join('; ')}`;
    }
    if (cs.caseStudyContent) {
      d += `\n  Concept: ${cs.caseStudyContent.concept.join('; ')}`;
      d += `\n  Approach: ${cs.caseStudyContent.approach.join('; ')}`;
    }
    return d;
  }).join('\n\n')}`;
}

function buildSkillsContext(): string {
  return `## Technical Skills (Grouped by Category)
${SKILL_CATEGORIES.map((c) => `### ${c.label}\n${c.skills.map((s) => `- ${s.name}`).join('\n')}`).join('\n\n')}`;
}

function buildFAQContext(): string {
  return `## Frequently Asked Questions
${FAQ_ITEMS.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}`;
}

function buildTestimonialsContext(): string {
  if (TESTIMONIALS.length === 0) return '';
  return `## Client Testimonials
${TESTIMONIALS.map((t) => `- "${t.quote}" — ${t.name}, ${t.designation}`).join('\n')}`;
}

function buildStatsContext(): string {
  return `## Key Differentiators
${STATS_DATA.map((s) => `- ${s.title}: ${s.description}`).join('\n')}`;
}

function buildBlogContext(): string {
  if (BLOG_POSTS.length === 0) return '';
  return `## Blog
${BLOG_POSTS.map(
    (b) =>
      `- "${b.title}" (${b.publishedAt}) — ${b.excerpt}${b.externalUrl ? ` [Read](${b.externalUrl})` : ''}`
  ).join('\n')}`;
}

function buildContactContext(): string {
  return `## Contact & Hiring
- Email: ${CONTACT_INFO.email}
- Location: ${CONTACT_INFO.location}
- Availability: ${CONTACT_INFO.availability}
- Schedule a Call: ${CONTACT_INFO.schedulingUrl}
- GitHub: ${CONTACT_INFO.github}
- LinkedIn: ${CONTACT_INFO.linkedin}`;
}

export const PORTFOLIO_KNOWLEDGE_BASE: string = [
  buildProfileContext(),
  buildServicesContext(),
  buildProjectsContext(),
  buildSkillsContext(),
  buildFAQContext(),
  buildTestimonialsContext(),
  buildStatsContext(),
  buildBlogContext(),
  buildContactContext(),
]
  .filter(Boolean)
  .join('\n\n---\n\n');
