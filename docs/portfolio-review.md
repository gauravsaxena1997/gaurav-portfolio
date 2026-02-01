# Portfolio Infrastructure & UI Review
**Date:** 2026-01-27  
**Scope:** Codebase review + user-provided screenshots (no live UI access)  
**Primary focus:** GSAP/scroll behavior, theming/blend modes, spacing/background control, overall complexity

---

## Executive Summary
The most critical blockers are **theme system conflicts** and a **fragile scroll orchestration layer**. These two issues cascade into unpredictable color behavior, scroll-driven animations failing to sync with scroll, and difficulty changing backgrounds/spacing.

**Top priorities (short list):**
1. **Unify theme state + background control** (data-theme vs class, competing localStorage keys, hard-coded body background).  
2. **Rebuild ScrollTrigger orchestration to be resize- and content-safe** (recalculate widths, invalidate on refresh, minimize manual scroll listeners).  
3. **Make spotlight/text color changes deterministic** (isolate blending or avoid blend modes in favor of explicit color layers/masks).  
4. **Relax hard-coded 100vh grids** so spacing/background changes can actually show.

---

## Screenshot Observations (what stands out)
1. **Stats panels**: gold blocks appear **static** and not clearly scroll-driven; the reveal looks like a fixed overlay rather than reacting to scroll. The text alignment appears tight and constrained (likely due to 100vh grids).  
2. **Hero**: the beam introduces **unpredictable color shifts** on text, especially on gold. This matches blend-mode behavior.  
3. **Projects**: spacing is large and very rigid; it feels locked to a strict grid, making “simple spacing changes” hard to notice.

---

## Key Findings & Root Causes

### 1) Scroll animations not responding in real time
**Symptoms:** Scroll-based animations feel like one-time entrances or “stuck” overlays.

**Root causes in code:**
- Horizontal scroll distances are computed **once** and not recalculated on refresh (`heroStatsWidth`, `scrollWidth`). `ScrollTrigger.refresh()` runs, but it won’t recompute those constants.  
  - Ref: @/src/themes/creative/components/scroll/ScrollOrchestrator.tsx#51-83, @/src/themes/creative/components/scroll/ScrollOrchestrator.tsx#211-214
- The stats reveal overlay relies on a container animation and `height` animation. The height target is **constant** (`40vh` / `42vh`) and does not react to content size or current scroll, which makes the effect feel static even when it is running.  
  - Ref: @/src/themes/creative/components/scroll/ScrollOrchestrator.tsx#84-129, @/src/themes/creative/components/sections/stats/StatPanel.module.css#42-99
- Multiple scroll systems compete: ScrollTrigger + manual scroll listeners + ScrollContext updates. This introduces unpredictability when syncing progress.  
  - Ref: @/src/themes/creative/context/ScrollContext.tsx#67-103, @/src/themes/creative/components/sections/projects/ProjectSection.tsx#39-70

**Result:** You can change GSAP code, but it won’t reliably map to scroll position because the underlying scroll/pin lengths are stale and state is fragmented.

---

### 2) Theming + background changes don’t behave consistently
**Symptoms:** Background/spacing changes appear to “not take,” and light mode can feel wrong.

**Root causes in code:**
- **Three different theme stores**: `portfolio-theme`, `theme`, and `creative-theme` across different files.  
  - Ref: @/src/app/page.tsx#7-23, @/src/hooks/useTheme.ts#24-41, @/src/themes/creative/CreativeTheme.tsx#37-52
- **Global body background is hard-coded** and doesn’t respect `data-theme` for creative theme.  
  - Ref: @/src/app/globals.css#18-34

**Result:** Theme toggles can diverge; body background can override the creative palette, and layout colors feel inconsistent.

---

### 3) Unpredictable text color when using blend modes
**Symptoms:** Color inversion/multiply produces unexpected blue or unintended hues.

**Root causes in code:**
- The spotlight overlay uses `mix-blend-mode: hard-light` with a strong gradient. This interacts with **every color beneath it**, so changing text or background colors can produce unpredictable results.  
  - Ref: @/src/themes/creative/components/sections/hero/HeroSection.module.css#39-57
- There is **no isolation layer**, so blending can propagate to other elements. (No `isolation: isolate` on a container.)

**Result:** You can’t reliably target color changes on text using blend modes unless the blending is isolated or replaced by explicit layers.

---

### 4) Hard-coded 100vh grids block spacing flexibility
**Symptoms:** spacing/background changes “don’t show up,” especially in stats sections.

**Root causes in code:**
- `StatPanel` and `statContent` lock to full viewport height with fixed grid rows.  
  - Ref: @/src/themes/creative/components/sections/stats/StatPanel.module.css#3-25
- The section orchestration itself pins full-viewport sections and transitions.  
  - Ref: @/src/themes/creative/components/scroll/ScrollOrchestrator.module.css#9-88

**Result:** Even small spacing changes are masked because the layout is rigid by design.

---

## Recommendations (Prioritized)

### Priority 0 — **Stabilize Theme & Backgrounds**
1. **Use a single source of truth** for theme (`data-theme` and one localStorage key). Remove competing theme modes.  
2. **Move body background into theme tokens** (use CSS variables and apply them on `html[data-theme]`). Remove hard-coded `body` background in `globals.css`.  
   - Ref: @/src/themes/creative/styles/theme.css#4-84, @/src/app/globals.css#18-34

### Priority 1 — **Rebuild ScrollTrigger orchestration**
1. **Recreate triggers on refresh**: compute widths inside the GSAP setup function and call `ScrollTrigger.refresh()` after layout changes. Use `invalidateOnRefresh: true`.  
2. **Avoid competing scroll state**: consolidate into ScrollTrigger-driven updates; remove manual scroll listeners where possible (e.g., in `ProjectSection`).  
   - Ref: @/src/themes/creative/components/scroll/ScrollOrchestrator.tsx#51-209, @/src/themes/creative/components/sections/projects/ProjectSection.tsx#39-70

### Priority 2 — **Make stats reveal truly scroll-reactive**
1. Derive reveal height **from actual text container size** rather than a constant `40-42vh`.  
2. Drive reveal **directly by scroll progress** (e.g., `ScrollTrigger` on the panel or use `containerAnimation` with real measurements).  
   - Ref: @/src/themes/creative/components/scroll/ScrollOrchestrator.tsx#84-129, @/src/themes/creative/components/sections/stats/StatPanel.module.css#42-99

### Priority 3 — **Fix blend-mode unpredictability**
1. Add `isolation: isolate` on the hero container to contain blend effects.  
2. If you want deterministic color changes, replace blend modes with **explicit overlay text layers** masked by the beam (clip-path / mask-image).  
   - Ref: @/src/themes/creative/components/sections/hero/HeroSection.module.css#39-57

### Priority 4 — **Relax layout rigidity**
1. Replace `height: 100vh` with `min-height` where possible so spacing changes are visible.  
2. Remove or minimize the strict 2-row grid in stats panels if you want flexible spacing.  
   - Ref: @/src/themes/creative/components/sections/stats/StatPanel.module.css#13-25

---

## Suggested Action Plan

**Phase 1 (Stabilize):**
- Consolidate theme state (1 key + `data-theme`).
- Remove global hard-coded backgrounds and rely on theme tokens.

**Phase 2 (Scroll system):**
- Rebuild ScrollTriggers in a single orchestration hook with width recalculation and `invalidateOnRefresh`.
- Convert manual scroll listeners to `ScrollTrigger` or `IntersectionObserver` where possible.

**Phase 3 (Visual polish):**
- Replace blend-mode text effects with deterministic overlay/mask technique.
- Relax 100vh grids to allow spacing and background adjustments.

---

## Open Questions (to clarify before refactor)
1. Should the **creative theme** be the single primary experience, with GitHub theme as optional? If so, we can simplify global theme handling.
2. For the stats reveal: do you want **full-height panels** or a **more editorial layout** that can breathe and respond to spacing?
3. For the spotlight: do you prefer **exact color control** (explicit overlays) or **dynamic color play** (blend modes)?

---

## Appendix: Most relevant files
- Scroll orchestration: @/src/themes/creative/components/scroll/ScrollOrchestrator.tsx
- Stats layout: @/src/themes/creative/components/sections/stats/StatPanel.tsx + StatPanel.module.css
- Hero spotlight: @/src/themes/creative/components/sections/hero/HeroSection.module.css
- Theme system: @/src/app/page.tsx, @/src/hooks/useTheme.ts, @/src/themes/creative/CreativeTheme.tsx
- Global styles: @/src/app/globals.css
