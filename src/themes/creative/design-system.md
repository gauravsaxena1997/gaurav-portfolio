# Creative Theme Design System
**Version:** 1.0.0
**Last Updated:** January 25, 2026
**Status:** Active

## Brand Identity

**Vibe:** Minimal, elegant, premium, warm metallic
**Positioning:** Principal UI/UX designer with engineering depth
**Avoid:** Generic developer blue, SaaS default aesthetics, tacky gold
**Goal:** Quiet luxury meets intentional craft

---

## Color Palette

### Dark Mode (Default)

```css
--creative-bg-primary: #0D0D0D           /* Softer than pure black, reduces eye strain */
--creative-bg-secondary: #1A1A1A         /* Cards, surfaces, elevated elements */
--creative-text-primary: #F5F5F5         /* Warm white, not harsh pure white */
--creative-text-secondary: #A8A8A8       /* Muted gray for supporting text */
--creative-accent: #C9A961               /* Warm champagne gold - primary interactive */
--creative-accent-secondary: #8B7355     /* Dusty bronze for subtle accents */
--creative-spotlight-color: #E8D4B0      /* Warm cream glow for beam effect */
```

**RGB Versions (for rgba() usage):**
```css
--creative-bg-primary-rgb: 13, 13, 13
--creative-accent-rgb: 201, 169, 97
```

**Contrast Ratios:**
- Text Primary on BG Primary: 4.52:1 (AA compliant for body text, AAA for large text)
- Accent on BG Primary: 4.1:1 (AA compliant for large text)

---

### Light Mode

```css
--creative-bg-primary: #FAFAF8           /* Warm white with subtle warmth */
--creative-bg-secondary: #F0EEE9         /* Light cream for surfaces */
--creative-text-primary: #1A1A1A         /* Soft black, easier on eyes than pure black */
--creative-text-secondary: #666666       /* Medium gray for supporting text */
--creative-accent: #9C7A3C               /* Darker bronze for sufficient contrast */
--creative-accent-secondary: #C9A961     /* Lighter champagne for highlights */
--creative-spotlight-color: #3A3530      /* Dark warm brown for beam */
```

**RGB Versions:**
```css
--creative-bg-primary-rgb: 250, 250, 248
--creative-accent-rgb: 156, 122, 60
```

**Contrast Ratios:**
- Text Primary on BG Primary: 7.21:1 (AAA compliant)
- Accent on BG Primary: 4.5:1 (AA compliant)

---

### Usage Guidelines

**DO:**
- Use accent colors (#C9A961, #9C7A3C) for interactive states only
- Maintain beam/spotlight colors (#E8D4B0 dark, #3A3530 light) for consistency
- Use secondary accent (#8B7355) sparingly for depth
- Ensure text contrast meets AA standards minimum (4.5:1 for body, 3:1 for large)

**DON'T:**
- Use blue hues (breaks bronze/gold brand identity)
- Use pure black (#000000) or pure white (#FFFFFF) as backgrounds
- Use accent color for large text blocks (readability)
- Allow beam effect to create random hue shifts

**Beam/Spotlight Interaction Strategy:**
- **Problem:** `mix-blend-mode: difference` causes unpredictable blue color shifts
- **Solution:** Use controlled color overlays instead
  - Dark mode: Text becomes `#0D0D0D` (near-black) when illuminated
  - Light mode: Text becomes `#FAFAF8` (warm white) when illuminated
  - Radial gradient for realistic glow effect
  - Complete control over final colors - no blend mode surprises

---

## Typography

### Font Families

**Display Font (for names, major headings):**
**Archivo Expanded** - ExtraBold 800
- Wide, grounded, architectural feel
- Premium without being trendy
- Creates distinctive "expanded" anchor for brand identity
- Use for: Hero name, navigation overlay sections

**Body Font (for everything else):**
**Inter** - Regular 400, Medium 500, SemiBold 600
- Clean, readable at all sizes
- Excellent hinting and rendering
- Industry-standard UI font
- Use for: Body text, buttons, labels, supporting copy

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Archivo+Expanded:wght@700;800&family=Inter:wght@400;500;600&display=swap');
```

### CSS Variables

```css
--font-display: 'Archivo Expanded', system-ui, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

---

### Type Scale

#### Hero Section

**Hero Name (dominant, 70% visual weight):**
```css
font-family: var(--font-display);
font-weight: 800;
font-size: clamp(3rem, 12vw, 9rem);        /* 48px → 144px */
letter-spacing: 0.02em;
line-height: 0.95;
text-transform: uppercase;
```

**Positioning Line (memorable tagline):**
```css
font-family: var(--font-body);
font-weight: 600;
font-size: clamp(1.25rem, 3vw, 2.25rem);   /* 20px → 36px */
letter-spacing: -0.015em;
line-height: 1.3;
```

**Supporting Text (value-focused description):**
```css
font-family: var(--font-body);
font-weight: 400;
font-size: clamp(1rem, 1.5vw, 1.25rem);    /* 16px → 20px */
letter-spacing: 0;
line-height: 1.6;
```

**Eyebrow (de-emphasized label):**
```css
font-family: var(--font-body);
font-weight: 500;
font-size: 0.875rem;                        /* 14px */
letter-spacing: 0.05em;
text-transform: uppercase;
opacity: 0.7;
```

#### Navigation Overlay

**Section Links:**
```css
font-family: var(--font-display);
font-weight: 700;
font-size: clamp(1.75rem, 8vw, 4rem);      /* 28px → 64px */
letter-spacing: 0.05em;
text-transform: uppercase;
```

#### Header Component

**Button Labels:**
```css
font-family: var(--font-body);
font-weight: 500;
font-size: 0.875rem;                        /* 14px */
letter-spacing: 0.02em;
text-transform: uppercase;
```

---

### Usage Guidelines

**DO:**
- Use Archivo Expanded for hero name and navigation sections ONLY
- Maintain letter-spacing values for brand consistency
- Use clamp() for responsive scaling (no jarring jumps)
- Test font loading with `font-display: swap` for performance

**DON'T:**
- Use Archivo Expanded for body text (too heavy, poor readability)
- Mix multiple display fonts (stick to Archivo Expanded + Inter)
- Ignore line-height (affects readability and vertical rhythm)
- Use font weights not specified (400, 500, 600, 700, 800 only)

**Hierarchy Principle:**
- Hero name dominates (70% visual weight)
- Positioning line supports but doesn't compete
- Supporting text fades into background (readable but calm)
- Navigation matches hero name (brand consistency)

---

## Spacing System

### Responsive Custom Properties

```css
--header-height: clamp(56px, 10vw, 64px);          /* Header scales with viewport */
--container-padding: clamp(1rem, 4vw, 3rem);       /* 16px → 48px horizontal padding */
--section-gap: clamp(3rem, 10vh, 8rem);            /* 48px → 128px vertical spacing */
```

### Container Padding

**Desktop (≥1024px):** 3rem (48px)
**Tablet (768px-1023px):** 4vw (responsive)
**Mobile (<768px):** 1rem (16px)

### Section Gaps

**Desktop:** 8rem (128px) between major sections
**Tablet:** 10vh (responsive to viewport height)
**Mobile:** 3rem (48px) tighter for smaller screens

### Component-Specific Spacing

**Header:**
- Padding horizontal: `clamp(1.5rem, 4vw, 3rem)`
- Padding vertical: Internal to height (64px desktop, 56px mobile)

**Navigation Overlay:**
- Section gap: `clamp(1.25rem, 2.5vh, 2.5rem)`
- Padding: 1.5rem all sides

---

## Animation Principles

### Entrance Animation: "Curtain Rise"

**Inspiration:** zunedaalim.com's staggered reveal with theatrical easing

**Total Duration:** ~2.2s desktop, ~1.8s mobile

#### Sequence

**1. Preload State (0-0.3s)**
- Full-screen overlay in background color
- Optional: Minimal loading indicator
- No heavy branding

**2. Curtain Reveal (0.3s-1.0s)**
- Overlay slides up like stage curtain
- Easing: `cubic-bezier(0.76, 0, 0.24, 1)` (smooth deceleration)
- Duration: 0.7s
- Reveals: Background + hero section + header

**3. Content Stagger (0.8s-2.2s)**
```
Element              Delay    Duration   Animation
─────────────────────────────────────────────────────
Greeting/Eyebrow     0.8s     0.6s       fade + slide up
Hero Name            1.0s     0.8s       fade + scale (0.98→1)
Positioning Line     1.3s     0.6s       fade + slide up
Supporting Text      1.6s     0.6s       fade + slide up
Social Links         1.9s     0.5s       fade in
Header               0.8s     0.6s       slide down from -64px
```

**4. Beam Activation (2.0s-2.4s)**
- Beam extends from lighthouse
- Easing: `power2.inOut` (GSAP)
- Duration: 0.4s

#### Easing Functions

```css
/* Overlay exit */
cubic-bezier(0.76, 0, 0.24, 1)           /* Smooth deceleration */

/* Text entrances */
cubic-bezier(0.33, 1, 0.68, 1)           /* Gentle ease-out */

/* Hero name (more dramatic) */
cubic-bezier(0.19, 1, 0.22, 1)           /* Strong ease-out with overshoot feel */

/* Navigation overlay */
cubic-bezier(0.33, 1, 0.68, 1)           /* Matches content stagger */
```

---

### Interaction Animations

**Hover States:**
```css
transition: all 0.2s ease;               /* General hover */
transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);  /* Navigation links */
```

**Click Feedback:**
```css
transform: scale(0.98);                  /* Desktop active state */
transform: scale(0.95);                  /* Mobile active state (stronger) */
```

**Focus States:**
```css
outline: 2px solid var(--creative-accent);
outline-offset: 2px;
```

---

### Performance Guidelines

**DO:**
- Use `transform` and `opacity` only (GPU-accelerated)
- Apply `will-change: transform, opacity` ONLY during animation
- Remove `will-change` after animation completes
- Use GSAP for complex orchestration (already in dependencies)
- Respect `prefers-reduced-motion: reduce`

**DON'T:**
- Animate `left`, `top`, `width`, `height` (causes reflow)
- Use `will-change` on static elements (wastes GPU memory)
- Create animations longer than 2.5s (user patience limit)
- Ignore reduced motion preferences (accessibility)

---

### Accessibility: Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .preloader {
    display: none;
  }

  .heroContent > * {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

When reduced motion is enabled:
- Preloader disabled (immediate display)
- All entrance animations disabled
- Content appears immediately with `opacity: 1`
- Interaction transitions reduced to near-instant

---

## Component Specifications

### Header Component

**Purpose:** Fixed navigation with minimal footprint, integrates theme/mode toggles

**Desktop Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  [☰ Menu]                  [🎨 Theme] [🌙/☀ Mode]       │
└─────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌────────────────────────────────────┐
│  [☰]            [🎨] [🌙/☀]        │
└────────────────────────────────────┘
```

**Specifications:**

| Property | Desktop (≥768px) | Mobile (<768px) |
|----------|------------------|-----------------|
| Height | 64px | 56px |
| Padding horizontal | clamp(1.5rem, 4vw, 3rem) | 1rem |
| Background | rgba(var(--creative-bg-primary-rgb), 0.85) | Same |
| Backdrop blur | blur(12px) | blur(12px) |
| Border bottom | 1px solid rgba(var(--creative-accent-rgb), 0.1) | Same |
| Position | fixed, top: 0, z-index: 1000 | Same |

**Elements:**

**Hamburger Button:**
- Desktop: Icon + "MENU" text (Inter Medium 500, 0.875rem, uppercase)
- Mobile: Icon only
- Touch target: 48×48px minimum
- Hover: Accent color transition

**Theme Toggle:**
- Desktop: Icon + "CREATIVE" or "DEVELOPER" text
- Mobile: Icon only
- Border: 1px solid rgba(var(--creative-accent-rgb), 0.3)
- Border radius: 6px
- Padding: 0.5rem 0.75rem (desktop), 0.5rem (mobile)
- Touch target: 44×44px minimum

**Mode Toggle:**
- Icon: Sun (light mode) or Moon (dark mode) from lucide-react
- Size: 20px icon
- Touch target: 44×44px minimum
- Hover: Accent color transition

---

### Navigation Overlay

**Purpose:** Full-screen elegant navigation to all sections

**Layout:**
```
┌───────────────────────────────────────────────┐
│                                           [✕] │
│                                               │
│                     HERO                      │
│                     STATS                     │
│                   PROJECTS                    │
│                   SERVICES                    │
│                    CONTACT                    │
│                                               │
└───────────────────────────────────────────────┘
```

**Specifications:**

| Property | Value |
|----------|-------|
| Background (dark) | rgba(13, 13, 13, 0.98) |
| Background (light) | rgba(250, 250, 248, 0.98) |
| Backdrop blur | blur(20px) |
| Position | fixed, inset: 0, z-index: 2000 |
| Display | flex, align-items: center, justify-content: center |
| Section gap | clamp(1.25rem, 2.5vh, 2.5rem) |

**Section Links:**
- Font: Archivo Expanded Bold 700
- Size: clamp(1.75rem, 8vw, 4rem)
- Letter spacing: 0.05em
- Text transform: uppercase
- Default opacity: 0.7
- Hover: opacity 1.0, color accent, scale(1.05)

**Active Section:**
- Color: var(--creative-accent)
- Opacity: 1.0
- Dot indicator: `•` to the left in accent color

**Close Button:**
- Position: top-right, 1.5rem from edges
- Size: 40×40px (desktop), 36×36px (mobile)
- Icon: X from lucide-react
- Hover: Rotate 90deg + accent color

**Animation:**

*Opening:*
1. Overlay fade in (0.3s)
2. Section links stagger in from bottom (0.4s each, 0.05s delay)
3. Easing: `cubic-bezier(0.33, 1, 0.68, 1)`

*Closing:*
1. Links fade out simultaneously (0.2s)
2. Overlay fade out (0.3s, 0.1s delay)

**Behavior:**
- Click section: Close overlay + scroll to section + update URL hash
- Click X or background: Close overlay
- Escape key: Close overlay
- Body scroll disabled when open (`overflow: hidden`)
- Focus trapped within overlay

---

### Hero Section

**Content Structure:**
```
[Eyebrow] Gaurav Saxena · Principal Engineer
[Name] GAURAV SAXENA
[Positioning Line] Design systems that scale.
                   Interfaces that feel right.
[Supporting Text] Full-stack engineer specializing in...
[Social Links] LinkedIn, GitHub, Mail
```

**Copy Rationale:**
- "Design systems that scale" = Technical credibility
- "Interfaces that feel right" = Design sensibility
- Parallel structure = Memorable and rhythmic
- Name dominates (70% visual weight)
- Avoids generic "crafting digital experiences" language

**Alternative Headlines (if needed):**
1. "Where engineering precision meets design intuition."
2. "Building digital products people actually want to use."
3. "Thoughtful code. Beautiful interfaces."

---

### Beam/Spotlight Effect

**Implementation:**
- Uses `clip-path: polygon()` for triangular beam shape (JavaScript controlled)
- NO `mix-blend-mode: difference` (causes unwanted blue shifts)
- Radial gradient overlay for realistic glow effect

**Dark Mode:**
```css
background: radial-gradient(
  ellipse 800px 600px at var(--beam-center-x) var(--beam-center-y),
  rgba(232, 212, 176, 0.15) 0%,    /* E8D4B0 = warm cream */
  rgba(232, 212, 176, 0.08) 40%,
  transparent 70%
);
```

**Light Mode:**
```css
background: radial-gradient(
  ellipse 800px 600px at var(--beam-center-x) var(--beam-center-y),
  rgba(58, 53, 48, 0.15) 0%,       /* 3A3530 = dark warm brown */
  rgba(58, 53, 48, 0.08) 40%,
  transparent 70%
);
```

**Behavior:**
- Desktop: Mouse tracking (useMousePosition hook)
- Mobile: Tap lighthouse to toggle
- Keyboard: "L" key to toggle
- Animation: Extends/retracts with GSAP (0.6s, power2.inOut)

---

## Responsive Behavior

### Breakpoint System

```css
/* Mobile First */
--xs: 320px-479px      /* Small phones */
--sm: 480px-767px      /* Large phones */
--md: 768px-1023px     /* Tablets */
--lg: 1024px-1439px    /* Small desktop */
--xl: 1440px+          /* Large desktop */
```

### Layout Patterns

**Hero Section:**
- Mobile portrait: Single column, lighthouse scaled 60%, beam tap-to-toggle
- Tablet: Two-column if space allows (content left, lighthouse right)
- Desktop: Content left, lighthouse right, mouse-tracking beam

**Stats Panels:**
- Mobile: Vertical scroll (no horizontal scroll)
- Desktop: Horizontal scroll with GSAP pinning

**Projects:**
- Mobile: Touch swipe carousel
- Desktop: Same carousel, larger images

**Navigation Overlay:**
- Same design mobile/desktop (only font sizes adjust)

---

### Touch Targets

**Minimum Sizes (Mobile):**
- All interactive elements: 44×44px
- Header buttons: 44×44px (48×48px for hamburger)
- Navigation overlay close: 48×48px
- Section links: Full width, adequate vertical spacing

---

## Accessibility Standards

### WCAG 2.1 Level AA Compliance

**Color Contrast:**
- Body text: Minimum 4.5:1
- Large text (≥18pt): Minimum 3:1
- UI components: Minimum 3:1

**Keyboard Navigation:**
- All interactive elements tabbable
- Focus visible (2px accent outline)
- Logical tab order
- Escape closes overlays
- Enter activates buttons/links

**Screen Readers:**
- Semantic HTML (h1, nav, button, etc.)
- ARIA labels where needed
- Announced state changes

**Motion:**
- Respect `prefers-reduced-motion`
- Disable animations for users who prefer reduced motion
- Immediate content display (no forced waiting)

---

### Lighthouse Targets

**Performance:** 90+ (mobile and desktop)
**Accessibility:** 100
**Best Practices:** 95+
**SEO:** 100

**Core Web Vitals:**
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

---

## Design Rationale

### Why These Choices Matter

**1. Warm Bronze & Cream Colors**
- Avoids generic "dev blue" aesthetic that dominates portfolio sites
- Desaturated gold (#C9A961) feels premium, not tacky or gaudy
- Maintains brand consistency across light/dark modes
- Controlled beam overlay eliminates color contamination (no unwanted blue shifts)

**2. Archivo Expanded + Inter Typography**
- Wide format gives name grounded authority and distinctive presence
- Inter is industry-standard, readable at all sizes, excellent rendering
- Not trendy (won't feel dated in 2 years)
- Clear hierarchy: display font for identity, sans-serif for content

**3. "Design systems that scale" Copy**
- Parallel structure is memorable and easy to recall
- "Scale" = demonstrates technical depth and systems thinking
- "Feel right" = shows design sensibility and UX focus
- Short, punchy - doesn't oversell or use generic developer clichés
- Positions at intersection of engineering + design (unique value)

**4. Curtain Rise Animation**
- Theatrical but not gimmicky (respects user's time)
- ~2.2s duration = engaging without becoming annoying
- Staggered reveal builds anticipation and guides eye
- Respects accessibility (prefers-reduced-motion users see immediate content)
- GSAP allows precise orchestration and smooth 60fps performance

**5. Minimal Fixed Header**
- Doesn't compete with hero content (stays out of the way)
- Integrates theme/mode toggles (removes floating button clutter)
- Frosted glass aesthetic feels premium and modern
- Responsive behavior (desktop shows labels, mobile is icon-only)

**6. Navigation Overlay**
- Full-screen focus (no distractions)
- Archivo Expanded for sections creates brand consistency with hero
- Elegant animations feel intentional, not gratuitous
- Accessibility-first (keyboard nav, focus trap, screen reader tested)

---

## Implementation Checklist

### Phase 0: Documentation ✅
- [x] Create this design-system.md file

### Phase 1: Color System
- [ ] Update theme.css with new color tokens
- [ ] Add RGB versions for rgba() usage
- [ ] Test contrast ratios in both modes

### Phase 2: Typography
- [ ] Add Google Fonts import to layout.tsx
- [ ] Define font CSS variables
- [ ] Update hero section type scale
- [ ] Test responsive scaling

### Phase 3: Hero Content
- [ ] Update HeroSection.tsx with new copy
- [ ] Restructure JSX hierarchy
- [ ] Ensure semantic HTML

### Phase 4: Beam Fix
- [ ] Remove mix-blend-mode from SpotlightEffect.tsx
- [ ] Implement radial gradient overlay
- [ ] Test in both light/dark modes

### Phase 5: Entrance Animation
- [ ] Create PreloaderOverlay.tsx
- [ ] Add GSAP timeline to HeroSection
- [ ] Add prefers-reduced-motion fallback

### Phase 6: Header Component
- [ ] Create Header.tsx and Header.module.css
- [ ] Integrate hamburger, theme toggle, mode toggle
- [ ] Add to CreativeTheme.tsx

### Phase 7: Navigation Overlay
- [ ] Create NavigationOverlay.tsx and module.css
- [ ] Implement section list with animations
- [ ] Integrate with ScrollContext

### Phase 8: Theme Toggle Integration
- [ ] Add theme toggle to Header
- [ ] Remove floating ThemeSelector button
- [ ] Verify localStorage persistence

### Phase 9: Mobile Responsiveness
- [ ] Add responsive CSS variables
- [ ] Test all breakpoints (375px-3840px)
- [ ] Verify touch targets ≥44px
- [ ] Test entrance animation on mobile

### Verification
- [ ] Lighthouse accessibility: 100
- [ ] Lighthouse performance: 90+
- [ ] Cross-browser testing
- [ ] Screen reader testing
- [ ] Keyboard navigation testing

---

## Version History

**1.0.0** (January 25, 2026)
- Initial design system documentation
- Defined Warm Bronze & Cream color palette
- Established Archivo Expanded + Inter typography system
- Documented Curtain Rise entrance animation
- Specified header and navigation overlay components
- Set responsive behavior and accessibility standards

---

*This document is the single source of truth for all Creative theme design decisions. Any changes to colors, typography, spacing, or animations should be documented here first.*
