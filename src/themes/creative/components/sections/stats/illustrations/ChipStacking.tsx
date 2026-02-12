'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Matter from 'matter-js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { RotateCcw } from 'lucide-react';
import { measureChipWidth, getResponsiveWidth } from '@/utils/measureText';
import styles from './ChipStacking.module.css';

gsap.registerPlugin(ScrollTrigger);

interface ChipData {
  id: string;
  text: string;
  variant: 'gold' | 'secondary';
  baseWidth: number;
  width: number;
}

interface ChipStackingProps {
  className?: string;
  chips?: Omit<ChipData, 'baseWidth' | 'width'>[];
  enableAnimations?: boolean;
}

const RAW_CHIPS = [
  'MODERN WEB APPS',        // (Was Next.js 15)
  'SCALABLE SYSTEMS',       // (Retained - Good Hybrid)
  'INTERACTIVE 3D',         // (Was WebGL)
  'INSTANT LOAD SPEED',     // (Was 99 Performance)
  'AI ENGINEERING',         // (Retained - High Value)
  'GLOBAL REMOTE',          // (Retained)
  'SEO OPTIMIZED',          // (Added for Analyst signal)
];

const CHIP_HEIGHT = 58;

export function ChipStacking({
  className,
  // chips prop is now optional and we'll derive state from RAW_CHIPS by default
  chips: userChips,
  enableAnimations = true,
}: ChipStackingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const [chips, setChips] = useState<ChipData[]>([]);
  const [isPhysicsActive, setIsPhysicsActive] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const chipBodiesRef = useRef<Map<string, Matter.Body>>(new Map());

  // Check for reduced motion preference with lazy initialization
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Initialize and Sort Chips (Pyramid Logic)
  useEffect(() => {
    // 1. Measure all chips
    const measured = RAW_CHIPS.map((text) => {
      const baseWidth = measureChipWidth(text);
      const responsiveWidth = getResponsiveWidth(baseWidth);
      return {
        id: text.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        text,
        baseWidth,
        width: responsiveWidth,
        variant: 'secondary' as const, // Placeholder
      };
    });

    // 2. Sort by Width Descending (Widest First -> Bottom)
    measured.sort((a, b) => b.width - a.width);

    // 3. Assign Alternating Variants
    // Index 0 (Widest/Bottom) = Gold
    // Index 1 = Secondary
    const processed: ChipData[] = measured.map((chip, index) => ({
      ...chip,
      variant: index % 2 === 0 ? 'gold' : 'secondary',
    }));

    setChips(processed);
  }, []); // Run once on mount

  // Initialize physics engine
  useEffect(() => {
    if (!containerRef.current || chips.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create engine with optimized settings
    const engine = Matter.Engine.create({
      enableSleeping: true,
      positionIterations: 10,      // INCREASED from 8 (more accurate)
      velocityIterations: 10,      // INCREASED from 8 (more stable)
      constraintIterations: 3,     // NEW - improves constraint stability
    });

    // Set gravity
    engine.gravity.y = 1.5;        // INCREASED from 0.8 (Faster drop)
    engine.gravity.scale = 0.001; // INCREASED from 0.0008 (Faster simulation)

    const world = engine.world;
    engineRef.current = engine;
    worldRef.current = world;

    // Create ground at the bottom of container
    const ground = Matter.Bodies.rectangle(
      width / 2,
      height - 10,
      width,
      20,
      {
        isStatic: true,
        friction: 1,
        restitution: 0,
        label: 'ground',
      }
    );

    // Create taller walls (4x height instead of 2x)
    const wallHeight = height * 4;
    const leftWall = Matter.Bodies.rectangle(-10, height / 2, 20, wallHeight, {
      isStatic: true,
      label: 'leftWall',
    });

    const rightWall = Matter.Bodies.rectangle(width + 10, height / 2, 20, wallHeight, {
      isStatic: true,
      label: 'rightWall',
    });

    // Add ceiling to prevent upward escape (Moved much higher to allow falling entry)
    const ceiling = Matter.Bodies.rectangle(
      width / 2,
      -2000,
      width,
      20,
      { isStatic: true, label: 'ceiling' }
    );

    Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
      if (worldRef.current) {
        Matter.World.clear(worldRef.current, false);
      }
      chipBodiesRef.current.clear();
    };
  }, [chips]);

  // Create chip physics bodies
  const createChipBody = useCallback(
    (chip: ChipData, x: number, y: number, angle: number = 0) => {
      if (!worldRef.current) return null;

      const body = Matter.Bodies.rectangle(
        x + chip.width / 2,
        y + CHIP_HEIGHT / 2,
        chip.width,
        CHIP_HEIGHT,
        {
          restitution: 0.1,
          friction: 0.8,
          frictionStatic: 1,
          frictionAir: 0.02,
          density: 0.002,
          angle: angle,
          label: chip.id,
        }
      );

      // Set damping properties after creation (not in TypeScript interface but valid at runtime)
      (body as any).angularDamping = 0.25;  // INCREASED from 0.05 (reduces spinning)
      (body as any).damping = 0.25;         // INCREASED from 0.1 (reduces bouncing)

      Matter.World.add(worldRef.current, body);
      chipBodiesRef.current.set(chip.id, body);
      return body;
    },
    []
  );

  // Physics render loop
  const updatePhysics = useCallback(() => {
    if (!engineRef.current || !worldRef.current || !isPhysicsActive) return;

    // Update physics
    Matter.Engine.update(engineRef.current, 1000 / 60);

    // Sync DOM with physics
    chips.forEach((chip) => {
      const body = chipBodiesRef.current.get(chip.id);
      const element = document.getElementById(`chip-${chip.id}`);

      if (body && element) {
        // Clamp positions to prevent escape
        const containerWidth = containerRef.current!.clientWidth;
        const containerHeight = containerRef.current!.clientHeight;

        // Prevent falling below ground
        if (body.position.y > containerHeight - CHIP_HEIGHT / 2 - 10) {
          Matter.Body.setPosition(body, {
            x: body.position.x,
            y: containerHeight - CHIP_HEIGHT / 2 - 10
          });
          Matter.Body.setVelocity(body, { x: 0, y: 0 });
        }

        // Prevent escaping horizontally
        const minX = chip.width / 2 + 10;
        const maxX = containerWidth - chip.width / 2 - 10;
        if (body.position.x < minX || body.position.x > maxX) {
          Matter.Body.setPosition(body, {
            x: Math.max(minX, Math.min(maxX, body.position.x)),
            y: body.position.y
          });
        }

        const x = body.position.x - chip.width / 2;
        const y = body.position.y - CHIP_HEIGHT / 2;
        const angle = body.angle;

        element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad)`;

        // Update z-index based on y position
        if (!element.classList.contains(styles.dragging)) {
          element.style.zIndex = String(Math.floor(1000 + body.position.y));
        }
      }
    });

    animationFrameRef.current = requestAnimationFrame(updatePhysics);
  }, [chips, isPhysicsActive]);

  // Start physics loop
  useEffect(() => {
    if (isPhysicsActive) {
      updatePhysics();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPhysicsActive, updatePhysics]);

  // Entry animation with GSAP + ScrollTrigger
  useEffect(() => {
    if (!containerRef.current || chips.length === 0 || !engineRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth || 300;

    // 1. Prepare Physics Bodies (Static initially)
    chips.forEach((chip, index) => {
      const centerX = containerWidth / 2;
      let startX = centerX - chip.width / 2;
      startX = Math.max(20, Math.min(containerWidth - chip.width - 20, startX));

      const startY = (index + 1) * -150; // Higher start for dramatic drop
      const startRotation = (Math.random() - 0.5) * 0.2; // Slight random rotation

      // Create body but it won't move until engine updates
      createChipBody(chip, startX, startY, startRotation);

      // Set initial DOM state
      const element = document.getElementById(`chip-${chip.id}`);
      if (element) {
        element.style.opacity = '0'; // Hidden initially
        element.style.transform = `translate3d(${startX}px, ${startY}px, 0) rotate(${startRotation}rad)`;
      }
    });

    // 2. Trigger Drop on Scroll
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 70%', // Trigger earlier (when top hits 70% of viewport)
      once: true, // Play once
      onEnter: () => {
        // Activate Physics -> Gravity takes over
        setIsPhysicsActive(true);

        // Fade in chips as they fall - FAST to show movement
        chips.forEach((chip, index) => {
          const element = document.getElementById(`chip-${chip.id}`);
          if (element) {
            gsap.to(element, {
              opacity: 1,
              duration: 0.2, // Fast fade
              delay: index * 0.05, // Very slight stagger
              ease: 'power1.in',
            });
          }
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, [chips, createChipBody]);

  // Mouse/touch interaction
  useEffect(() => {
    if (!engineRef.current || !containerRef.current || !isPhysicsActive) return;

    const mouse = Matter.Mouse.create(containerRef.current);
    // Disable mouse wheel to allow page scrolling
    (mouse as any).element.removeEventListener('mousewheel', (mouse as any).mousewheel);
    (mouse as any).element.removeEventListener('DOMMouseScroll', (mouse as any).mousewheel);
    (mouse as any).element.removeEventListener('wheel', (mouse as any).mousewheel);

    const mouseConstraint = Matter.MouseConstraint.create(engineRef.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.6,        // REDUCED from 0.95 (prevents aggressive pulling)
        render: { visible: false },
      } as any,  // Use 'as any' to allow runtime properties not in TypeScript definitions
    });

    // Set additional constraint properties after creation
    if (mouseConstraint.constraint) {
      (mouseConstraint.constraint as any).damping = 0.8;          // NEW - absorbs oscillations
      (mouseConstraint.constraint as any).angularStiffness = 0;   // NEW - prevents unwanted rotation during drag
    }

    Matter.World.add(worldRef.current!, mouseConstraint);
    mouseConstraintRef.current = mouseConstraint;

    // Drag start
    Matter.Events.on(mouseConstraint, 'startdrag', (event: any) => {
      const body = event.body as Matter.Body;
      const element = document.getElementById(`chip-${body.label}`);

      if (element) {
        element.style.zIndex = '9999';
        element.classList.add(styles.dragging);
      }

      // Mark that chips have been moved
      setHasMoved(true);

      // ONLY wake the dragged body, not all bodies (prevents cascade flickering)
      Matter.Sleeping.set(body, false);
    });

    // Drag end
    Matter.Events.on(mouseConstraint, 'enddrag', (event: any) => {
      const body = event.body as Matter.Body;
      const element = document.getElementById(`chip-${body.label}`);

      if (element) {
        element.style.zIndex = String(Math.floor(1000 + body.position.y));
        element.classList.remove(styles.dragging);
      }
    });

    return () => {
      Matter.World.remove(worldRef.current!, mouseConstraint);
      Matter.Events.off(mouseConstraint, 'startdrag');
      Matter.Events.off(mouseConstraint, 'enddrag');
      mouseConstraintRef.current = null;
    };
  }, [isPhysicsActive]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, chipId: string) => {
      const body = chipBodiesRef.current.get(chipId);
      if (!body) return;

      const FORCE = 0.002;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          Matter.Body.applyForce(body, body.position, { x: 0, y: -FORCE });
          Matter.Sleeping.set(body, false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          Matter.Body.applyForce(body, body.position, { x: 0, y: FORCE });
          Matter.Sleeping.set(body, false);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          Matter.Body.applyForce(body, body.position, { x: -FORCE, y: 0 });
          Matter.Sleeping.set(body, false);
          break;
        case 'ArrowRight':
          event.preventDefault();
          Matter.Body.applyForce(body, body.position, { x: FORCE, y: 0 });
          Matter.Sleeping.set(body, false);
          break;
      }
    },
    []
  );

  // Reset chips to stacked formation
  const resetChips = useCallback(() => {
    if (!containerRef.current || chips.length === 0) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Calculate stacked positions (pyramid from bottom)
    chips.forEach((chip, index) => {
      const body = chipBodiesRef.current.get(chip.id);
      const element = document.getElementById(`chip-${chip.id}`);

      if (body && element) {
        // Position chips centered, stacked from bottom
        const centerX = containerWidth / 2;
        const stackY = containerHeight - 30 - (chips.length - 1 - index) * (CHIP_HEIGHT + 8);

        // Animate to stacked position
        Matter.Body.setPosition(body, {
          x: centerX,
          y: stackY,
        });
        Matter.Body.setAngle(body, 0);
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(body, 0);
        Matter.Sleeping.set(body, false);
      }
    });

    // Hide reset button after resetting
    setHasMoved(false);
  }, [chips]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className || ''}`}
      role="application"
      aria-label="Interactive chip stacking with physics"
    >
      {/* Reset Button - Icon Only */}
      <button
        className={`${styles.resetButton} ${hasMoved ? styles.visible : ''}`}
        onClick={resetChips}
        aria-label="Reset chip positions"
        title="Reset chips"
      >
        <RotateCcw />
      </button>

      {chips.map((chip) => (
        <div
          key={chip.id}
          id={`chip-${chip.id}`}
          className={`${styles.chip} ${styles[chip.variant]}`}
          style={
            {
              width: `${chip.width}px`,
              height: `${CHIP_HEIGHT}px`,
              opacity: 0, // Start invisible, will fade in
              position: 'absolute',
              top: 0,
              left: 0,
            } as React.CSSProperties
          }
          tabIndex={0}
          role="button"
          aria-label={`Chip: ${chip.text}. Draggable.`}
          onKeyDown={(e) => handleKeyDown(e, chip.id)}
        >
          <div className={styles.chipContent}>{chip.text}</div>
        </div>
      ))}
    </div>
  );
}
