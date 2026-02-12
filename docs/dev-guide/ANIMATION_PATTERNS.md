# ANIMATION PATTERNS LIBRARY

> **PURPOSE:** Ready-to-use animation patterns using GSAP, Framer Motion, and Lenis. Copy-paste these into your projects.

---

## TABLE OF CONTENTS

1. [Framer Motion Patterns](#framer-motion-patterns)
2. [GSAP Patterns](#gsap-patterns)
3. [Lenis Smooth Scroll](#lenis-smooth-scroll)
4. [Combined Patterns](#combined-patterns)
5. [Performance Tips](#performance-tips)

---

## FRAMER MOTION PATTERNS

### 1. Fade In on Scroll

```typescript
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const FadeInOnScroll = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

### 2. Stagger Children Animation

```typescript
const StaggerContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

const StaggerItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// Usage:
<StaggerContainer>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</StaggerContainer>
```

### 3. Scale on Hover (Button Effect)

```typescript
const ScaleButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg"
    >
      {children}
    </motion.button>
  )
}
```

### 4. Magnetic Cursor Effect

```typescript
'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

const MagneticButton = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY

      const maxDistance = 50 // Max pull distance
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

      if (distance < 100) {
        x.set(distanceX * 0.3)
        y.set(distanceY * 0.3)
      } else {
        x.set(0)
        y.set(0)
      }
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    window.addEventListener('mousemove', handleMouseMove)
    ref.current?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      ref.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      className="inline-block"
    >
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
        {children}
      </button>
    </motion.div>
  )
}
```

### 5. Page Transition

```typescript
// app/template.tsx (Next.js App Router)
'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

### 6. Number Counter Animation

```typescript
import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const AnimatedNumber = ({ value }: { value: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useSpring(0, { duration: 2000 })
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
    </span>
  )
}

// Usage:
<AnimatedNumber value={10000} />
```

---

## GSAP PATTERNS

### 1. Scroll-Triggered Parallax

```typescript
'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const ParallaxSection = () => {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true, // Smooth scrubbing
      },
      y: '-30%',
      ease: 'none',
    })
  }, [])

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden">
      <div ref={imageRef} className="absolute inset-0 scale-110">
        <img src="/parallax-bg.jpg" alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 p-8">
        <h2>Content over parallax background</h2>
      </div>
    </div>
  )
}
```

### 2. Horizontal Scroll Sections

```typescript
useEffect(() => {
  const sections = gsap.utils.toArray('.panel')

  gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: '.container',
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => '+=' + document.querySelector('.container')!.offsetWidth,
    },
  })
}, [])

// HTML:
<div className="container flex">
  <div className="panel w-screen h-screen flex-shrink-0 bg-blue-500">Panel 1</div>
  <div className="panel w-screen h-screen flex-shrink-0 bg-green-500">Panel 2</div>
  <div className="panel w-screen h-screen flex-shrink-0 bg-red-500">Panel 3</div>
</div>
```

### 3. Text Split Animation (Line by Line)

```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText' // Requires GSAP premium

gsap.registerPlugin(ScrollTrigger, SplitText)

const AnimatedText = ({ children }: { children: string }) => {
  const textRef = useRef(null)

  useEffect(() => {
    const split = new SplitText(textRef.current, { type: 'lines' })

    gsap.from(split.lines, {
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    })
  }, [])

  return <div ref={textRef}>{children}</div>
}
```

### 4. Reveal on Scroll (Clip Path)

```typescript
useEffect(() => {
  gsap.from('.reveal', {
    scrollTrigger: {
      trigger: '.reveal',
      start: 'top 80%',
    },
    clipPath: 'inset(0 100% 0 0)',
    duration: 1.2,
    ease: 'power3.inOut',
  })
}, [])

// HTML:
<div className="reveal">
  <img src="/image.jpg" alt="Revealed on scroll" />
</div>
```

### 5. Pin Element While Scrolling

```typescript
useEffect(() => {
  ScrollTrigger.create({
    trigger: '.pin-section',
    start: 'top top',
    end: '+=2000', // Pin for 2000px of scroll
    pin: true,
    pinSpacing: false,
  })
}, [])
```

### 6. SVG Path Drawing Animation

```typescript
useEffect(() => {
  const path = document.querySelector('.svg-path')
  const length = path.getTotalLength()

  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  })

  gsap.to(path, {
    scrollTrigger: {
      trigger: '.svg-container',
      start: 'top center',
      end: 'bottom center',
      scrub: true,
    },
    strokeDashoffset: 0,
  })
}, [])
```

---

## LENIS SMOOTH SCROLL

### Basic Setup

```typescript
// components/SmoothScroll.tsx
'use client'

import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false, // Disable on touch devices (important for mobile)
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Sync with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

// Usage in app/layout.tsx:
<SmoothScroll>
  {children}
</SmoothScroll>
```

### Programmatic Scroll (Scroll to Section)

```typescript
const ScrollToButton = () => {
  const handleScroll = () => {
    const lenis = window.lenis // Attach Lenis to window for global access

    lenis.scrollTo('#target-section', {
      duration: 2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      offset: -100, // Offset from top
    })
  }

  return <button onClick={handleScroll}>Scroll to Section</button>
}
```

---

## COMBINED PATTERNS

### GSAP + Lenis Scroll-Triggered Timeline

```typescript
'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

const ScrollTimeline = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Sync with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=3000',
        scrub: 1,
        pin: true,
      },
    })

    tl.from('.item-1', { opacity: 0, y: 100, duration: 1 })
      .from('.item-2', { opacity: 0, x: -100, duration: 1 }, '-=0.5')
      .from('.item-3', { opacity: 0, scale: 0.5, duration: 1 }, '-=0.5')

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div ref={containerRef} className="h-screen">
      <div className="item-1">Item 1</div>
      <div className="item-2">Item 2</div>
      <div className="item-3">Item 3</div>
    </div>
  )
}
```

### Framer Motion + GSAP Hybrid

```typescript
// Use Framer Motion for simple UI animations
// Use GSAP for complex scroll-triggered animations

const HybridComponent = () => {
  const ref = useRef(null)

  // Framer Motion for entrance
  const controls = useAnimation()

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 })

    // GSAP for scroll behavior
    gsap.to(ref.current, {
      scrollTrigger: {
        trigger: ref.current,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
      },
      rotation: 360,
    })
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.8 }}
    >
      Content
    </motion.div>
  )
}
```

---

## PERFORMANCE TIPS

### 1. Use `will-change` Sparingly

```css
/* ✅ GOOD: Apply only during animation */
.animating {
  will-change: transform;
}

/* ❌ BAD: Always on */
.element {
  will-change: transform;
}
```

### 2. Prefer `transform` and `opacity`

```typescript
// ✅ GPU-accelerated
gsap.to('.element', { x: 100, opacity: 0.5 })

// ❌ Forces reflow/repaint
gsap.to('.element', { left: '100px', width: '50%' })
```

### 3. Debounce Scroll Events

```typescript
import { debounce } from 'lodash'

const handleScroll = debounce(() => {
  // Expensive operation
}, 100)

window.addEventListener('scroll', handleScroll)
```

### 4. Respect `prefers-reduced-motion`

```typescript
const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (shouldReduceMotion) {
  // Disable or simplify animations
  gsap.set('.element', { duration: 0 })
}
```

### 5. Clean Up Animations on Unmount

```typescript
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to('.element', { x: 100 })
  })

  return () => ctx.revert() // Clean up
}, [])
```

---

## ANIMATION DECISION TREE

**Use Framer Motion when:**
- Simple enter/exit animations
- Layout animations
- Gesture-based interactions
- React component animations
- You want declarative API

**Use GSAP when:**
- Complex timelines
- Scroll-triggered animations (ScrollTrigger)
- SVG animations
- High-performance requirements
- Precise control needed

**Use Lenis when:**
- You want smooth scrolling foundation
- Pairing with GSAP ScrollTrigger
- Creating scroll-based experiences

**Use CSS animations when:**
- Simple hover effects
- Loading spinners
- Smallest bundle size matters

---

**Last Updated:** February 9, 2026
