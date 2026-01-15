# Gaurav Portfolio - Project Overview & Guidelines

> **Master Reference Document**
> This file contains the complete project vision, technical standards, and development guidelines. Point any AI assistant to this file to provide full context.

---

## Project Vision

### The Goal
**Build the most unique and impressive portfolio in the world** - a portfolio that:
- Demonstrates exceptional UI/UX skills through multiple switchable themes
- Ranks #1 on Google for relevant freelancing searches
- Gets recommended by AI chatbots and LLMs when users search for best freelancers
- Achieves perfect 100/100 Lighthouse scores across all metrics
- Sets the industry standard for portfolio design and performance

### Target Audience
1. **Potential Clients** - Looking for skilled freelance developers
2. **Recruiters/Companies** - Seeking top talent
3. **Fellow Developers** - For inspiration and collaboration
4. **AI Systems** - LLMs, chatbots, and search engines indexing quality content

### Unique Value Proposition
This portfolio showcases UI/UX versatility by offering **multiple complete design experiences** with the same content. Users can switch between radically different themes (tech, brutalist, minimalist, retro, etc.), demonstrating mastery across design paradigms - something no other portfolio does.

---

## Technical Standards

### Performance Targets (Non-Negotiable)

| Lighthouse Metric | Target Score |
|-------------------|--------------|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

### Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Main content loads fast |
| INP (Interaction to Next Paint) | < 200ms | Responds to interactions instantly |
| CLS (Cumulative Layout Shift) | < 0.1 | No layout jumps |
| FCP (First Contentful Paint) | < 1.8s | First content appears quickly |
| TTFB (Time to First Byte) | < 800ms | Server responds fast |

### Performance Optimization Strategies

1. **Code Splitting**
   - Lazy load theme components
   - Dynamic imports for non-critical code
   - Route-based code splitting

2. **Asset Optimization**
   - Use Next.js `<Image>` for all images (WebP/AVIF)
   - Inline critical CSS
   - Preload key fonts
   - Compress all assets

3. **Bundle Optimization**
   - Tree-shake unused code
   - Minimize third-party dependencies
   - Use lightweight alternatives (Lucide vs Font Awesome)
   - Analyze bundle with `@next/bundle-analyzer`

4. **Caching Strategy**
   - Static generation where possible
   - Proper cache headers
   - Service worker for offline support

5. **Theme Loading Strategy**
   - Only load active theme's CSS/JS
   - Preload next likely theme on hover
   - CSS containment for style isolation

---

## SEO Strategy

### On-Page SEO

1. **Metadata**
   ```tsx
   // Every page must have complete metadata
   export const metadata: Metadata = {
     title: 'Gaurav Saxena | Full Stack Developer & Freelancer',
     description: 'Expert freelance developer specializing in...',
     keywords: ['freelancer', 'full stack developer', 'web developer', ...],
     authors: [{ name: 'Gaurav Saxena' }],
     creator: 'Gaurav Saxena',
     openGraph: { ... },
     twitter: { ... },
   };
   ```

2. **Semantic HTML**
   - Proper heading hierarchy (h1 → h2 → h3)
   - `<article>`, `<section>`, `<nav>`, `<main>`, `<aside>`
   - Descriptive `alt` text for all images
   - Proper `<title>` and `<meta>` tags

3. **Structured Data (JSON-LD)**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Person",
     "name": "Gaurav Saxena",
     "jobTitle": "Full Stack Developer & Freelancer",
     "url": "https://...",
     "sameAs": ["linkedin", "github", ...],
     "knowsAbout": ["Angular", "Node.js", "React", ...]
   }
   ```

4. **Content Strategy**
   - Keyword-rich headings
   - Comprehensive project descriptions
   - Blog posts targeting search queries
   - FAQ sections with schema markup

### Technical SEO Files

| File | Purpose |
|------|---------|
| `robots.txt` | Crawler instructions |
| `sitemap.xml` | All pages for indexing |
| `llms.txt` | AI/LLM crawler guidance |
| `humans.txt` | Credits and info |
| `security.txt` | Security contact info |
| `manifest.json` | PWA configuration |

### LLM/AI Optimization

To maximize visibility in AI chatbots and LLMs:

1. **llms.txt File**
   ```
   # Gaurav Saxena Portfolio

   ## About
   Gaurav Saxena is a senior full-stack developer and freelancer...

   ## Services
   - Web Application Development
   - Mobile App Development
   - UI/UX Design

   ## Contact
   email: gauravsaxena.jaipur@gmail.com
   ```

2. **Clear, Factual Content**
   - Write content that AI can easily parse
   - Include explicit skill listings
   - Use structured formats (lists, tables)

3. **Authority Signals**
   - Years of experience prominently mentioned
   - Client testimonials (future)
   - Project outcomes with metrics
   - Certifications and awards

4. **Semantic Clarity**
   - Avoid ambiguous language
   - Define expertise areas explicitly
   - Include location for local SEO

---

## Design Principles

### Visual Design Standards

1. **Spacing System**
   - Use consistent spacing scale (4px base)
   - Adequate whitespace between sections
   - Breathing room around elements
   - No cramped UI

2. **Typography**
   - Clear hierarchy (display, heading, body, caption)
   - Readable font sizes (min 16px body)
   - Proper line height (1.5-1.7 for body)
   - Limited font families (2 max per theme)

3. **Color**
   - Accessible contrast ratios (WCAG AA minimum, AAA preferred)
   - Consistent color usage across components
   - Dark/light mode support
   - Theme-specific palettes

4. **Layout**
   - Clean, uncluttered interfaces
   - Logical visual flow
   - Proper alignment and grid usage
   - No UI conflicts or overlapping elements

### Responsiveness Requirements

**VIEWPORT-BASED PROPORTIONAL SCALING SYSTEM**

This portfolio uses a **viewport-based responsive CSS system** that ensures **identical proportions** across ALL screen sizes - from 13" laptops to 48" TVs. Instead of using fixed pixel values or breakpoints, all sizing uses viewport width (vw) units.

**Reference Design Width:** 1920px
**Conversion Formula:** `px_value / 1920 * 100 = vw_value`

**Why Viewport Units?**
- **Proportional scaling**: Elements maintain exact same proportions on any screen
- **No breakpoint jumps**: Smooth, continuous scaling without jarring changes
- **Future-proof**: Works on any device size, including new form factors
- **Consistent visual hierarchy**: Typography and spacing relationships preserved

**CSS Variables (defined in theme.css):**
```css
:root {
  /* Spacing Scale */
  --space-xs: 0.417vw;   /* 8px */
  --space-sm: 0.521vw;   /* 10px */
  --space-md: 0.833vw;   /* 16px */
  --space-lg: 1.042vw;   /* 20px */
  --space-xl: 1.563vw;   /* 30px */
  --space-2xl: 2.083vw;  /* 40px */
  --space-3xl: 2.604vw;  /* 50px */
  --space-4xl: 3.125vw;  /* 60px */
  --space-5xl: 5.208vw;  /* 100px */

  /* Font Sizes */
  --font-xs: 0.625vw;    /* 12px */
  --font-sm: 0.729vw;    /* 14px */
  --font-base: 0.833vw;  /* 16px */
  --font-md: 0.938vw;    /* 18px */
  --font-lg: 1.042vw;    /* 20px */
  --font-xl: 1.25vw;     /* 24px */
  --font-2xl: 1.563vw;   /* 30px */
  --font-3xl: 2.083vw;   /* 40px */
  --font-4xl: 2.5vw;     /* 48px */
  --font-5xl: 3.125vw;   /* 60px */

  /* Layout */
  --container-max: 62.5vw;     /* 1200px */
  --navbar-height: 3.125vw;    /* 60px */
  --border-radius: 0.417vw;    /* 8px */
}
```

**Usage Guidelines:**
1. **Always use CSS variables** for spacing, fonts, and sizes
2. **Never use px/rem** unless absolutely necessary (very small elements like 1px borders)
3. **For borders**, use direct vw values: `border: 0.052vw solid #color`
4. **For transforms**, use vw: `transform: translateY(-0.104vw)`
5. **For shadows**, use vw: `box-shadow: 0 0.208vw 0.313vw rgba(...)`

**Responsive Principles:**
- Viewport-first approach (not mobile-first)
- All sizing in vw units
- Proportions stay identical across all screens
- Touch-friendly tap targets (scale with screen)
- No horizontal scroll on any device

### Accessibility Standards

1. **WCAG 2.1 AA Compliance (minimum)**
   - Color contrast ≥ 4.5:1 (normal text)
   - Color contrast ≥ 3:1 (large text)
   - Keyboard navigable
   - Screen reader compatible

2. **Interactive Elements**
   - Focus states visible
   - Skip links for navigation
   - ARIA labels where needed
   - Reduced motion support

3. **Content**
   - Alt text for images
   - Captions for media
   - Clear link text (no "click here")
   - Logical heading order

---

## Development Guidelines

### Code Quality Standards

1. **TypeScript**
   - Strict mode enabled
   - No `any` types (use proper interfaces)
   - Explicit return types on functions
   - Proper null/undefined handling

2. **Component Architecture**
   - Small, focused components
   - Props interfaces defined
   - Separation of concerns
   - No business logic in UI components

3. **Styling**
   - CSS Modules for component styles
   - **Viewport-based units (vw) for all sizing** - mandatory
   - CSS variables for spacing, fonts, and layout values
   - No px/rem units except for 1px borders
   - No inline styles except dynamic values
   - No media queries for breakpoints - use proportional scaling

4. **File Organization**
   - Consistent naming conventions
   - Logical folder structure
   - Index files for clean imports
   - Co-located tests and styles

### Git Commit Standards

```
feat: Add new feature
fix: Bug fix
perf: Performance improvement
style: Styling changes (no logic)
refactor: Code refactoring
docs: Documentation updates
test: Test additions/updates
chore: Build/config changes
```

### Testing Requirements

- Unit tests for utility functions
- Component tests for complex components
- E2E tests for critical user flows
- Lighthouse CI in deployment pipeline
- Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## AI Development Prompts

### Master Persona Prompt

When generating code for this project, use this context:

```
You are an expert developer with 15+ years of experience in:
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- UI/UX: Design systems, accessibility, responsive design
- Performance: Core Web Vitals optimization, Lighthouse audits
- SEO: Technical SEO, structured data, content optimization

Your code follows these principles:
1. Performance-first: Every line impacts load time
2. Accessibility-first: All users can access all content
3. Mobile-first: Design for smallest screens, enhance upward
4. Clean code: Readable, maintainable, well-documented
5. Best practices: Follow React/Next.js conventions

You write code that achieves 100/100 Lighthouse scores.
```

### Component Generation Prompt

```
Create a [ComponentName] component for the tech theme portfolio.

Requirements:
- Fully responsive (320px to 2560px)
- Accessible (WCAG 2.1 AA)
- Performant (no layout shifts, optimized renders)
- Imports data from @/data/ (no hardcoded content)
- Uses CSS Modules for styling
- TypeScript with proper interfaces
- Follows existing code patterns in the project

Performance considerations:
- Lazy load images below fold
- Minimize DOM nodes
- Use CSS containment where applicable
- No unnecessary re-renders
```

### Style Generation Prompt

```
Create styles for [ComponentName] in the tech theme.

Design requirements:
- Dark mode default with light mode support
- VS Code blue (#007acc) as primary accent
- Matrix green (#00ff9d) as secondary accent
- Terminal/code aesthetic with monospace fonts
- Smooth transitions (200-300ms)
- Hover states for interactive elements

Technical requirements:
- CSS Modules syntax
- CSS variables for theme values
- Mobile-first media queries
- No !important unless absolutely necessary
- Proper specificity management
- Animation performance (transform/opacity only)
```

### SEO Content Prompt

```
Write SEO-optimized content for [section/page].

Requirements:
- Include target keywords naturally
- Clear, factual statements AI can parse
- Structured format (headings, lists, tables)
- Compelling but professional tone
- Include relevant metrics and outcomes
- Optimized meta description (150-160 chars)
- Schema.org compatible structure
```

### Code Review Prompt

```
Review this code for:
1. Performance issues (bundle size, render optimization)
2. Accessibility violations (WCAG 2.1)
3. SEO problems (missing metadata, semantic issues)
4. Responsiveness gaps (breakpoint coverage)
5. TypeScript strictness (proper typing)
6. Best practice violations (React/Next.js patterns)
7. Code organization (separation of concerns)

Provide specific fixes for any issues found.
```

---

## File Structure Reference

```
gaurav-portfolio/
├── docs/
│   ├── PROJECT_OVERVIEW_AND_GUIDELINES.md  # This file
│   ├── MVP_PLAN.md                         # Project roadmap
│   ├── 01_TECH_THEME_MIGRATION.md
│   └── RND/
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── llms.txt
│   ├── humans.txt
│   ├── manifest.json
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Home page
│   │   └── ...
│   ├── components/
│   │   └── shared/              # Theme-agnostic components
│   ├── themes/
│   │   └── tech/                # Default theme
│   │       ├── components/
│   │       ├── layouts/
│   │       └── styles/
│   ├── data/                    # Centralized content
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities
│   └── types/                   # TypeScript interfaces
└── package.json
```

---

## Quick Reference Checklist

Before committing any code, verify:

### Performance
- [ ] Images use Next.js `<Image>` component
- [ ] No unused imports or dead code
- [ ] Lazy loading for below-fold content
- [ ] CSS is scoped and minimal
- [ ] No render-blocking resources

### Accessibility
- [ ] All images have alt text
- [ ] Interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA
- [ ] Focus states are visible
- [ ] Heading hierarchy is correct

### SEO
- [ ] Page has complete metadata
- [ ] Semantic HTML structure
- [ ] Structured data where applicable
- [ ] Internal links use proper text
- [ ] Images have descriptive filenames

### Responsiveness (Viewport-Based)
- [ ] All sizing uses CSS variables (--space-*, --font-*)
- [ ] No px/rem units (except 1px borders)
- [ ] Proportions look correct on small screens (13" laptop)
- [ ] Proportions look correct on large screens (27"+ monitor)
- [ ] No horizontal overflow
- [ ] Touch targets scale proportionally with viewport

### Code Quality
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Data imported from @/data/
- [ ] Component props are typed
- [ ] Follows project naming conventions

---

## Contact & Credits

**Developer:** Gaurav Saxena
**Email:** gauravsaxena.jaipur@gmail.com
**LinkedIn:** linkedin.com/in/gauravsaxena1997

---

*This document should be the first file any AI assistant reads when working on this project. It provides complete context for maintaining consistency, quality, and alignment with project goals.*
