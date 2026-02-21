# Bio Link Page Technical Design Document

This document defines the technical design for the `/bio` Instagram-link-style landing page with dark theme + IG gradient accents, config-driven content, env-driven stats, and a shared contact form.

## 1. Executive Summary
- Create a mobile-first `/bio` page that consolidates hero info, quick stats, milestones, badges, lead capture, and outbound links.
- Business value: better IG bio conversion to leads/portfolio; fast updates via env vars and config without code changes.
- Key improvements: dedicated route with clear CTA, env-configurable stats, reusable contact form, structured config for future CMS.

## 2. Current State Analysis
- **Frontend Implementation**: Portfolio uses Next.js/React; contact form lives at `src/themes/creative/components/sections/contact/ContactForm.tsx`; config constants under `src/config`; no dedicated link-in-bio page exists.
- **Backend API Structure**: Contact form posts to `/api/contact`; other link-bio data will be static/config-driven (no new API initially).
- **Current Limitations**: No lightweight IG landing page; stats require code edits; milestones/badges not modeled; no dedicated route.

## 3. User Flow Analysis
- **Happy Path Scenarios**:
  1. Visitor opens `/bio` from Instagram.
  2. Sees hero (avatar, handle, short bio) and quick stats.
  3. Views milestones (3 title-only cards) and badge(s) (circular medals).
  4. Submits lead form (ContactForm) successfully.
  5. Taps outbound links (portfolio, LinkedIn, GitHub, WhatsApp prefilled, case studies).
- **Edge Cases & Error Handling**: Contact form validation errors surfaced inline via existing component; network/API failure shows error message; missing env values fall back to safe defaults ("0" or empty).
- **Performance Considerations**: Keep page static/server-rendered; minimal client JS beyond ContactForm; optimize images (avatar) via Next/Image if available; defer heavy assets.

## 4. High-Level Architecture Design
- **Component Architecture (conceptual)**:
  - `/bio` page (server component) imports config and renders sections.
  - HeroSection (uses config.hero)
  - StatsStrip (uses config.stats, env-resolved values)
  - MilestonesList (title-only cards)
  - BadgesGrid (circular badge cards)
  - LinksList (buttons)
  - ContactBlock (wraps existing ContactForm)
  - CalloutFooter
- **API Architecture**: No new APIs; reuse `/api/contact`.
- **Data Flow**: Env vars read in config resolver -> page receives resolved data -> passed to section components; form posts to `/api/contact`.

## 5. Low-Level Design Specifications
- **Frontend Components**:
  - `app/bio/page.tsx` (server): imports config resolver and renders sections.
  - `src/config/linkPage.ts`: exports typed data + resolver reading `process.env.NEXT_PUBLIC_*`.
  - `components/bio/Hero.tsx`: props { handle, name?, bio, avatarUrl } (avatar served from `public/bio/profile.webp`).
  - `components/bio/StatsStrip.tsx`: props { stats: { label: string; value: string; }[] }.
  - `components/bio/Milestones.tsx`: props { items: { title: string; }[] } (title-only cards).
  - `components/bio/Badges.tsx`: props { items: { title: string; icon?: string; }[] } (circular badge motif, 3-up responsive).
  - `components/bio/Links.tsx`: props { links: { label: string; href: string; kind: 'primary' | 'secondary' | 'whatsapp' | 'portfolio' | 'social'; }[] }.
  - `components/bio/Callout.tsx`: props { text: string; ctaLabel: string; ctaHref: string }.
  - `components/bio/ContactBlock.tsx`: thin wrapper around existing `ContactForm` with narrower container.
- **Backend Implementation**: None new; rely on existing `/api/contact`.
- **Configuration Management**:
  - `src/config/linkPage.ts` structure:
    ```ts
    export interface BioHero { handle: string; bio: string; avatarUrl: string; subtitle?: string; }
    export interface BioStat { label: string; value: string; }
    export interface BioMilestone { title: string; }
    export interface BioBadge { title: string; icon?: string; }
    export interface BioLink { label: string; href: string; kind: 'primary' | 'secondary' | 'whatsapp' | 'portfolio' | 'social'; prefill?: string; }
    export interface BioCallout { text: string; ctaLabel: string; ctaHref: string; }
    export interface BioPageConfig { hero: BioHero; stats: BioStat[]; milestones: BioMilestone[]; badges: BioBadge[]; links: BioLink[]; callout: BioCallout; }
    export const bioConfig: BioPageConfig = { /* uses env fallbacks */ };
    ```
  - Env resolution helper inside config file for stats and WhatsApp prefill.
  - Profile image: use `public/bio/profile.webp` (converted from `public/ProfilePhoto (1).jpg`) as the hero avatar; keep optimized webp in `public/bio/` and reference via `avatarUrl` in config.

## 6. Implementation Plan
#### Phase 1: Config + Route Scaffold
- **Tasks**: Create `src/config/linkPage.ts` with types and env resolution; add `/app/bio/page.tsx` skeleton wiring sections; set defaults for env-backed stats.
- **Deliverables**: ✅ `src/config/linkPage.ts`; ✅ `/app/bio/page.tsx` rendering placeholders; ✅ Env var references documented.
- **Testing Instructions**: Load `/bio` locally; verify renders with defaults; no console errors.
- **AI Implementation Prompt**: "You are a senior full-stack developer. Scaffold `/bio` page using config-driven data from `src/config/linkPage.ts`, include sections for hero, stats, milestones, badges, links, callout, and wrap ContactForm. Use env fallbacks for stats and WhatsApp prefill. Keep styling hooks/classes ready."

#### Phase 2: UI Components + Styling
- **Tasks**: Build Hero, StatsStrip, Milestones (title-only cards), Badges (circular motif), Links buttons, Callout; apply dark + IG-gradient accents.
- **Deliverables**: ✅ Components under `components/bio/`; ✅ CSS/Module/Tailwind styles for layouts; ✅ Responsive 3-up badges grid; ✅ Title-only milestone cards.
- **Testing Instructions**: Check mobile viewport; verify tap targets; ensure gradients and badges render; no layout overflow.
- **AI Implementation Prompt**: "You are a senior frontend developer. Implement bio page section components with dark base and IG-gradient accents. Milestones are title-only cards; badges use circular gradient ring with minimal icon/monogram; badges grid is responsive 3-up. Ensure full-width link buttons and ContactForm wrapper fits ~440px width."

#### Phase 3: Integration + Content Pass
- **Tasks**: Connect config data into sections; wire WhatsApp link with prefilled message; ensure links use correct kinds; refine typography spacing.
- **Deliverables**: ✅ Integrated `/bio` page with live config; ✅ WhatsApp prefill link; ✅ Final copy placeholders.
- **Testing Instructions**: Click all links; verify WhatsApp opens with prefill; sanity-check hero/avatar loading.
- **AI Implementation Prompt**: "You are a senior frontend integrator. Bind `bioConfig` into `/bio` page sections, wire WhatsApp prefilled message, and confirm layout/spacing for mobile-first."

#### Phase 4: QA + Polish
- **Tasks**: Accessibility sweep (aria labels, alt text), perf check (image sizes), cross-browser sanity, update docs with env vars.
- **Deliverables**: ✅ A11y adjustments; ✅ Env var notes in docs; ✅ Final visual polish.
- **Testing Instructions**: Keyboard nav through buttons/form; lighthouse pass for mobile; verify env fallbacks render without .env.
- **AI Implementation Prompt**: "You are a senior QA-focused engineer. Audit the `/bio` page for accessibility, performance, and env fallback behavior; adjust labels and sizes; ensure no console errors."

## 7. Technical Considerations
- **Performance Optimization**: Minimal JS; server render where possible; use optimized avatar; avoid heavy fonts; prune unused props.
- **Security Considerations**: Contact form already validates; sanitize URLs in links; ensure env vars are `NEXT_PUBLIC_*` only.
- **Scalability Considerations**: Config-driven with typed schema; ready to swap to CMS later; reusable section components.
- **Monitoring and Analytics**: Optionally reuse existing AnalyticsService hooks on CTA clicks/form submissions.

## 8. Risk Assessment and Mitigation
| Risk | Probability | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| Env vars missing | Medium | Low | Provide defaults and surface warnings in logs during build |
| WhatsApp prefill malformed | Low | Medium | URL-encode prefill; keep copy short |
| Badge/milestone layout breaks on small screens | Medium | Medium | Test mobile widths; enforce grid/gaps; clamp text |
| Contact form API failure | Medium | Medium | Rely on existing error handling; show inline error |

## 9. Success Metrics
- **Technical Metrics**: Page loads <1.5s on 4G; no runtime errors; lighthouse a11y >90.
- **User Experience Metrics**: Form completion rate; link click-throughs; WhatsApp tap rate.
- **Business Metrics**: Lead submissions from `/bio`; portfolio visits from CTA.

## 10. Feature Estimation
| Phase | Scope | AI-Optimized Hours | Deliverables |
| --- | --- | --- | --- |
| Phase 1 | Config + route scaffold | 2 | Config file, `/bio` page skeleton |
| Phase 2 | Components + styling | 4 | Section components + styles |
| Phase 3 | Integration + content | 2 | Wired data + prefilled WhatsApp |
| Phase 4 | QA + polish | 2 | A11y/perf pass, docs updates |

## 11. Current Progress
| Phase | Key Deliverables | Status | AI Prompt Used | Notes |
| --- | --- | --- | --- | --- |
| Phase 1 | Config scaffold, `/bio` skeleton | ❌ | Pending | |
| Phase 2 | Section components styled | ❌ | Pending | |
| Phase 3 | Integration wired | ❌ | Pending | |
| Phase 4 | QA + docs | ❌ | Pending | |

## 12. General Guidelines for AI Execution
- **Pre-Execution Checklist**: Read this doc; review existing contact form component; verify env vars.
- **Development Guidelines**: Use config + types; keep layout mobile-first; apply dark base + IG gradient accents; reuse ContactForm.
- **Build Quality Assurance**: Run `npm run build` or `npm run lint` as applicable; fix TS errors/warnings; ensure no console errors on `/bio`.
- **Quality Standards**: Performance, accessibility (aria labels, focus states), error handling (form), responsive layout.
- **Phase Completion Criteria**: All deliverables checked and tested per phase table.

## 13. Conclusion
- The `/bio` page will provide a focused, mobile-first link hub with fast-editable stats and lead capture.
- Config + env-driven data reduce deployment friction; reusable components ease future CMS integration.
- Success depends on clean UX (dark + IG accents), reliable contact form, and clear outbound paths.
- Estimated effort: ~10 AI-optimized hours across four phases.
