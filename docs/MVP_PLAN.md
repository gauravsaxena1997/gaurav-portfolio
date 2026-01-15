# Gaurav Portfolio - MVP Plan

## Project Overview

A Next.js portfolio application designed with **multi-theme architecture** from the ground up. The MVP will ship with the migrated "Tech/Developer" theme from the existing Angular portfolio, with infrastructure supporting seamless theme switching (to be enabled when 3-4 themes are ready).

### Tech Stack
- **Framework:** Next.js 16.1.2 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** MDX for blog posts and project documentation
- **Database:** Supabase (for comments, likes, and dynamic data)
- **Deployment:** Vercel (planned)

---

## Priority Order

### PRIORITY 1: Migrate Existing Angular Portfolio (IMMEDIATE)
> **Goal:** Deploy updated portfolio to new domain ASAP

The existing Angular portfolio ("Tech/Developer" theme) will be migrated to Next.js as the **default theme**. This ensures:
- Quick deployment to new domain
- Familiar design while new themes are developed
- Data extraction and centralization happens during migration
- Scalable foundation for future themes

**See:** `docs/01_TECH_THEME_MIGRATION.md` for detailed migration plan

### PRIORITY 2: Data Centralization
Extract all hardcoded data from Angular components into centralized, theme-agnostic data files that all future themes will consume.

### PRIORITY 3: Content Updates
- Add freelancing projects
- Update bio for freelancer positioning
- Refresh skills and experience

### PRIORITY 4: New Features (Blog, etc.)
- Blog system with MDX
- Supabase integration
- Comments, likes, views

### PRIORITY 5: Additional Themes
- Design and build 2-3 more themes
- Enable theme switcher UI

---

## Core Architecture Principles

### 1. Centralized Data Layer
All portfolio content lives in a shared data layer, completely decoupled from UI:

```
src/
├── data/
│   ├── profile.ts          # Personal info, bio, links
│   ├── experience.ts       # Work history
│   ├── projects.ts         # IT + Freelance projects
│   ├── skills.ts           # Technical skills
│   ├── achievements.ts     # Awards, certifications
│   └── passions.ts         # Hobbies, interests
```

### 2. Theme-Agnostic Component Structure
Each theme will have its own component implementations that consume the same data:

```
src/
├── themes/
│   ├── tech/               # DEFAULT - Migrated from Angular
│   │   ├── components/
│   │   ├── layouts/
│   │   └── styles/
│   ├── brutalist/          # Future theme
│   ├── minimalist/         # Future theme
│   └── retro/              # Future theme
├── components/
│   └── shared/             # Theme-agnostic components
```

### 3. Theme Context System (Hidden for MVP)
```typescript
// Theme switcher will be implemented but hidden
// Enable when 3-4 themes are ready
```

---

## MVP Scope (Tech Theme Migration)

### What Gets Migrated (1:1 from Angular)

1. **Home Section**
   - Hero with TypeScript class snippet (`developer.ts` terminal window)
   - Typed.js animation for name
   - Navigation bar with section links

2. **About Section**
   - JSON snippet display (`about.json` terminal window)
   - Personal info, education, current focus

3. **Skills Section**
   - 7 skill categories in card grid
   - Frontend, Backend, Database, Testing, CI/CD, Message Queues, Tools

4. **Experience Section**
   - Circuit board themed timeline
   - Company chips with LED indicators
   - Work history (Zetwerk, Ongraph)

5. **Projects Section**
   - Matrix-style project cards
   - Tech stack chips
   - 5 IT projects

6. **Achievements Section**
   - Trophy cards
   - 3 awards (Superhero, Zackathon, ZetStar)

7. **Passions Section**
   - Art & Sketching card
   - Books card

8. **Contact Section**
   - Terminal-style form
   - HTTP status button states
   - EmailJS integration

9. **Global Features**
   - Dark/Light theme toggle
   - Smooth scroll navigation
   - Intersection Observer animations
   - Responsive design

---

## Post-Migration Features

### Phase 2: Content Updates
- [ ] Add freelancing projects
- [ ] Update personal bio
- [ ] Add new skills
- [ ] Update work experience

### Phase 3: Blog System
- [ ] MDX setup and configuration
- [ ] Blog dashboard page
- [ ] Blog post page template
- [ ] Supabase integration
- [ ] Comments system
- [ ] Likes/reactions system

### Phase 4: Polish & Deploy
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Responsive design refinement
- [ ] Deployment to Vercel

### Phase 5: Multi-Theme (Post-MVP)
- [ ] Theme context implementation
- [ ] Theme switcher UI
- [ ] Second theme development
- [ ] Third theme development
- [ ] Enable theme switching

---

## Folder Structure

```
gaurav-portfolio/
├── docs/
│   ├── MVP_PLAN.md                    # This file
│   ├── 01_TECH_THEME_MIGRATION.md     # Migration plan
│   └── RND/                           # Research notes
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # Single-page app (like Angular)
│   │   ├── blog/                      # Future
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── projects/                  # Future - detailed pages
│   │       └── [slug]/page.tsx
│   ├── components/
│   │   └── shared/                    # Theme-agnostic utilities
│   ├── themes/
│   │   └── tech/                      # DEFAULT THEME
│   │       ├── components/
│   │       │   ├── Navbar.tsx
│   │       │   ├── Hero.tsx
│   │       │   ├── About.tsx
│   │       │   ├── Skills.tsx
│   │       │   ├── Experience.tsx
│   │       │   ├── Projects.tsx
│   │       │   ├── Achievements.tsx
│   │       │   ├── Passions.tsx
│   │       │   ├── Contact.tsx
│   │       │   └── Footer.tsx
│   │       ├── layouts/
│   │       │   └── MainLayout.tsx
│   │       └── styles/
│   │           ├── theme.css          # CSS variables, global styles
│   │           └── components/        # Component-specific styles
│   ├── data/                          # CENTRALIZED DATA
│   │   ├── profile.ts
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── achievements.ts
│   │   └── passions.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── supabase.ts               # Future
│   ├── hooks/
│   │   ├── useTheme.ts               # Dark/Light toggle
│   │   ├── useScrollSpy.ts           # Active section detection
│   │   └── useTypedAnimation.ts      # Typed.js wrapper
│   └── types/
│       └── index.ts
├── public/
│   ├── images/
│   └── assets/
└── package.json
```

---

## Database Schema (Supabase) - Future

```sql
-- Blog interactions
blog_likes (
  id, post_slug, user_identifier, created_at
)

blog_comments (
  id, post_slug, author_name, author_email,
  content, created_at, is_approved
)

blog_views (
  id, post_slug, view_count, last_viewed
)

-- Contact form submissions
contact_submissions (
  id, name, email, message, created_at, is_read
)

-- Future: Theme preferences per visitor
user_preferences (
  id, visitor_id, selected_theme, created_at
)
```

---

## Documentation Index

| Document | Description |
|----------|-------------|
| `PROJECT_OVERVIEW.md` | **Master reference** - Vision, standards, guidelines, AI prompts |
| `MVP_PLAN.md` | This file - overall project plan |
| `01_TECH_THEME_MIGRATION.md` | Detailed migration plan for Angular → Next.js |
| `THEME_ARCHITECTURE.md` | Future - multi-theme system design |

---

## Notes

- **First Deploy:** Migrated tech theme to new domain
- Theme switching architecturally ready but **hidden** until 3-4 themes exist
- All data centralized and theme-agnostic from day one
- Supabase handles dynamic data (no custom API needed)
- MDX for rich content (blog, project details)
