'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Matter from 'matter-js';
import Link from 'next/link';
import '@/themes/creative/styles/theme.css';
import styles from './NotFound404Physics.module.css';

const DIGITS = ['4', '0', '4'] as const;

/**
 * Responsive digit sizing based on viewport width
 * Adjusted for mobile to prevent jamming
 */
function getDigitSize(vw: number) {
    if (vw < 480) return { width: 55, height: 70, fontSize: 42 };
    if (vw < 768) return { width: 90, height: 110, fontSize: 72 };
    if (vw < 1024) return { width: 120, height: 140, fontSize: 90 };
    return { width: 150, height: 170, fontSize: 110 };
}

/**
 * 404 Page - Matter.js Physics with Centered Half-Platform
 * features Force Dark Theme, Gravity/Bounce Controls
 */
export default function NotFound404Physics() {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const bodiesRef = useRef<Matter.Body[]>([]);
    const digitElementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const rafRef = useRef<number>(0);
    const platformRef = useRef<HTMLDivElement>(null);
    const catchFloorRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [digitSize, setDigitSize] = useState({ width: 150, height: 170, fontSize: 110 });
    const [gravity, setGravity] = useState(100);

    // Check for reduced motion
    const prefersReducedMotion = useRef(false);

    // ── Mark as 404 page ──
    useEffect(() => {
        document.body.setAttribute('data-page-type', '404');
        return () => {
            document.body.removeAttribute('data-page-type');
        };
    }, []);

    useEffect(() => {
        prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        requestAnimationFrame(() => {
            setDigitSize(getDigitSize(window.innerWidth));
        });
    }, []);

    // ── Controls ──
    const updateGravity = useCallback((value: number) => {
        setGravity(value);
        if (engineRef.current) {
            engineRef.current.gravity.y = value / 100;
            // Wake up bodies on gravity change
            Matter.Composite.allBodies(engineRef.current.world).forEach(body => {
                if (!body.isStatic) Matter.Sleeping.set(body, false);
            });
        }
    }, []);

    const resetGravity = useCallback(() => {
        updateGravity(100);
    }, [updateGravity]);

    // ── Engine Setup ──
    useEffect(() => {
        if (!containerRef.current || prefersReducedMotion.current) {
            requestAnimationFrame(() => {
                setIsReady(true);
            });
            return;
        }

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width === 0 || height === 0) {
            requestAnimationFrame(() => {
                setIsReady(true);
            });
            return;
        }

        const ds = getDigitSize(width);
        setDigitSize(ds);

        // Engine
        const engine = Matter.Engine.create({ enableSleeping: true });
        engine.gravity.y = 1; // Default 100%
        engine.gravity.scale = 0.001;
        engineRef.current = engine;

        // Platform: centered, ~60% of viewport
        const platformWidthRatio = 0.60;
        const platformWidth = width * platformWidthRatio;
        const platformThickness = 15;
        const platformVisualY = height * 0.42;
        const platformX = width / 2;

        const catchFloorVisualY = height * 0.85;
        const catchFloorThickness = 60;

        // Static Bodies
        const platform = Matter.Bodies.rectangle(
            platformX, platformVisualY + platformThickness / 2,
            platformWidth, platformThickness,
            { isStatic: true, label: 'platform', restitution: 0.3, friction: 0.9, frictionStatic: 1.0 }
        );

        const catchFloor = Matter.Bodies.rectangle(
            width / 2, catchFloorVisualY + catchFloorThickness / 2,
            width + 200, catchFloorThickness,
            { isStatic: true, label: 'catchFloor', restitution: 0.3, friction: 0.8 }
        );

        const bottomWall = Matter.Bodies.rectangle(width / 2, height + 100, width + 400, 200, { isStatic: true });
        const topWall = Matter.Bodies.rectangle(width / 2, -500, width + 400, 200, { isStatic: true });

        const wallThickness = 60;
        const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 3, { isStatic: true, restitution: 0.2 });
        const rightWall = Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 3, { isStatic: true, restitution: 0.2 });

        // Digit drop positions
        const platformLeft = platformX - platformWidth / 2;
        const platformRight = platformX + platformWidth / 2;

        const dropPositions = [
            { x: platformLeft + platformWidth * 0.20 },
            { x: platformLeft + platformWidth * 0.65 },
            { x: platformRight + ds.width * 0.15 },
        ];

        const digitBodies = DIGITS.map((_, i) => Matter.Bodies.rectangle(
            dropPositions[i].x,
            -200 - i * 300,
            ds.width, ds.height,
            { label: `digit-${i}`, restitution: 0.25, friction: 0.6, frictionAir: 0.01, density: 0.003 }
        ));
        bodiesRef.current = digitBodies;

        // Divider between 4 and 0
        const dividerX = platformLeft + platformWidth * 0.42;
        const dividerHeight = ds.height * 1.5;
        const divider = Matter.Bodies.rectangle(
            dividerX, platformVisualY - dividerHeight / 2,
            4, dividerHeight,
            { isStatic: true, label: 'divider', restitution: 0.2 }
        );

        // Add bodies
        Matter.World.add(engine.world, [platform, catchFloor, leftWall, rightWall, bottomWall, divider, ...digitBodies]);

        // Delayed top wall
        const topWallTimer = setTimeout(() => { Matter.World.add(engine.world, topWall); }, 5000);

        // Mouse interaction
        const mouse = Matter.Mouse.create(container);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.05, damping: 0.15, render: { visible: false } } as Matter.IConstraintDefinition
        });
        // Prevent scroll hijack
        const mouseWithWheel = mouseConstraint.mouse as Matter.Mouse & { mousewheel: (event: WheelEvent) => void };
        mouseWithWheel.element.removeEventListener('mousewheel', mouseWithWheel.mousewheel as unknown as EventListener);
        mouseWithWheel.element.removeEventListener('DOMMouseScroll', mouseWithWheel.mousewheel as unknown as EventListener);
        Matter.World.add(engine.world, mouseConstraint);

        // Position platform & catch floor visually
        if (platformRef.current) {
            platformRef.current.style.top = `${platformVisualY}px`;
            platformRef.current.style.left = `${(width - platformWidth) / 2}px`;
            platformRef.current.style.width = `${platformWidth}px`;
        }
        if (catchFloorRef.current) {
            catchFloorRef.current.style.top = `${catchFloorVisualY}px`;
        }

        setIsReady(true);

        const runner = Matter.Runner.create();
        runnerRef.current = runner;
        Matter.Runner.run(runner, engine);

        // Render loop: sync Matter bodies → DOM
        const renderFrame = () => {
            if (!engineRef.current) return;
            
            digitBodies.forEach((body, i) => {
                const el = digitElementsRef.current[i];
                if (el) {
                    const { x, y } = body.position;
                    if (y > height + 800 || y < -1000) {
                        Matter.Body.setPosition(body, { x: width / 2, y: -200 });
                        Matter.Body.setVelocity(body, { x: 0, y: 0 });
                        Matter.Body.setAngle(body, 0);
                    }
                    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${body.angle}rad)`;
                }
            });
            rafRef.current = requestAnimationFrame(renderFrame);
        };
        rafRef.current = requestAnimationFrame(renderFrame);

        // Resize → full reload (physics worlds don't resize gracefully)
        let resizeTimer: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                window.location.reload();
            }, 500);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
            clearTimeout(topWallTimer);
            if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
            if (engineRef.current) {
                Matter.World.clear(engineRef.current.world, false);
                Matter.Engine.clear(engineRef.current);
            }
            engineRef.current = null;
        };
    }, []); // Mount only — engine setup should not re-run

    return (
        <div className={`${styles.container} creative-theme theme-light-warm`}>
            <div className={styles.gridOverlay} />
            
            <div ref={containerRef} className={styles.physicsArea}>
                <div ref={platformRef} className={styles.platform}>
                    <div className={styles.platformEdgeLeft} />
                    <div className={styles.platformEdgeRight} />
                </div>
                <div ref={catchFloorRef} className={styles.catchFloor} />
                
                {isReady && DIGITS.map((digit, i) => (
                    <div
                        key={i}
                        ref={(el) => { digitElementsRef.current[i] = el; }}
                        className={styles.digit}
                        style={{ 
                            width: digitSize.width, 
                            height: digitSize.height, 
                            fontSize: digitSize.fontSize,
                            visibility: 'visible' 
                        }}
                    >
                        {digit}
                    </div>
                ))}
            </div>

            <div className={styles.content}>
                <p className={styles.eyebrow}>Error 404</p>
                <p className={styles.message}>
                    This page seems to have fallen off the edge - let&apos;s get you back to solid ground.
                </p>
                <Link href="/" className={styles.cta}>
                    Back to Home
                </Link>
            </div>

            <div className={styles.controlBar}>
                <div className={styles.controlGroup}>
                    <label className={styles.controlLabel} htmlFor="gravity-slider">Gravity</label>
                    <div className={styles.sliderWrapper}>
                        <input
                            id="gravity-slider"
                            type="range"
                            min="-100" max="300" step="10"
                            value={gravity}
                            onChange={(e) => updateGravity(Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>
                    <span className={styles.controlValue}>{gravity}%</span>
                    <button
                        className={`${styles.resetButton} ${gravity === 100 ? styles.hidden : ''}`}
                        onClick={resetGravity}
                        aria-label="Reset Gravity"
                        title="Reset"
                        tabIndex={gravity === 100 ? -1 : 0}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

