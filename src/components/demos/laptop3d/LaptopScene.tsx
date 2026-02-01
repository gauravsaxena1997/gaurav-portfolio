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
}

export function LaptopScene({
  screenContent,
  showClickText = true,
  enableMagneticEffect = true,
  transparent = false  // Default to false for backwards compatibility
}: LaptopSceneProps) {
  const [open, setOpen] = useState(false);
  const [hinge, setHinge] = useState(1.575);
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
      onUpdate: function() {
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
          <group rotation={[0, Math.PI, 0]} onClick={() => setOpen(!open)}>
            <LaptopModel
              open={open}
              hinge={hinge}
              screenContent={screenContent}
              enableMagneticEffect={enableMagneticEffect}
            />
          </group>
          <Environment preset="city" />
        </Suspense>
        <ContactShadows
          position={[0, -4.5, 0]}
          opacity={0.4}
          scale={20}
          blur={1.75}
          far={4.5}
        />
      </Canvas>
    </main>
  );
}
