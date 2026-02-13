'use client';
import { Suspense, useState, useEffect, useRef, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import gsap from 'gsap';
import { LaptopModel } from './LaptopModel';
import styles from './LaptopScene.module.css';

interface LaptopSceneProps {
  screenContent?: ReactNode;
  showClickText?: boolean;
  enableMagneticEffect?: boolean;
  transparent?: boolean;  // Allow transparent background
  defaultOpen?: boolean;  // Start in open state
  disableClick?: boolean;  // Prevent click interaction
  magneticStrength?: number;  // Strength of magnetic effect (0-1)
}

export function LaptopScene({
  screenContent,
  showClickText = true,
  enableMagneticEffect = true,
  transparent = false,  // Default to false for backwards compatibility
  defaultOpen = false,  // Default to closed
  disableClick = false,  // Allow clicks by default
  magneticStrength = 1.0  // Full strength by default
}: LaptopSceneProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [hinge, setHinge] = useState(defaultOpen ? -0.425 : 1.575);
  const [lightColor, setLightColor] = useState('#f0f0f0');
  const containerRef = useRef<HTMLElement>(null);
  const clickTextRef = useRef<HTMLHeadingElement>(null);

  // Animate background color, hinge, and light color with GSAP
  useEffect(() => {
    const targetHinge = open ? -0.425 : 1.575;
    const targetColor = open ? '#d25578' : '#f0f0f0';

    // Animate hinge
    gsap.to({ value: hinge }, {
      value: targetHinge,
      duration: 0.6,
      ease: 'power2.inOut',
      onUpdate: function () {
        setHinge(this.targets()[0].value);
      }
    });

    // Animate background color (if not transparent)
    if (!transparent && containerRef.current) {
      gsap.to(containerRef.current, {
        backgroundColor: targetColor,
        duration: 0.6,
        ease: 'power2.inOut'
      });
    }

    // Animate light color
    setLightColor(targetColor);

    // Animate click text
    if (showClickText && clickTextRef.current) {
      gsap.to(clickTextRef.current, {
        opacity: open ? 0 : 1,
        y: open ? -50 : -100,
        duration: 0.6,
        ease: 'power2.inOut'
      });
    }
  }, [open, transparent, showClickText, hinge]);

  // Theme detection for shadow styling
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme !== 'light'); // Default to dark if null
    };

    // Check initial
    checkTheme();

    // Observe changes
    const Observer = window.MutationObserver || (window as any).WebKitMutationObserver;
    if (Observer) {
      const observer = new Observer(checkTheme);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      return () => observer.disconnect();
    }
  }, []);

  return (
    <main
      ref={containerRef}
      className={styles.container}
      style={{
        background: transparent ? 'transparent' : '#f0f0f0'
      }}
    >
      {showClickText && (
        <h1
          ref={clickTextRef}
          className={styles.clickText}
          style={{
            opacity: 1,
            transform: 'translate3d(-50%, -100px, 0)'
          }}
        >
          click
        </h1>
      )}

      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, -25], fov: 35 }}>
        <pointLight
          position={[10, 10, 10]}
          intensity={1.5}
          color={lightColor}
        />
        <Suspense fallback={null}>
          <group rotation={[0, Math.PI, 0]} onClick={disableClick ? undefined : () => setOpen(!open)}>
            <LaptopModel
              open={open}
              hinge={hinge}
              screenContent={screenContent}
              enableMagneticEffect={enableMagneticEffect}
              magneticStrength={magneticStrength}
            />
          </group>
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
        </Suspense>
        <ContactShadows
          position={[0, -4.5, 0]}
          opacity={isDarkMode ? 0.2 : 0.4}
          scale={20}
          blur={1.75}
          far={4.5}
          color={isDarkMode ? '#ffffff' : '#000000'}
        />
      </Canvas>
    </main>
  );
}
