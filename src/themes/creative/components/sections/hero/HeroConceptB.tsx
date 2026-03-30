'use client';
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Image from 'next/image';
import { HeroContent } from './HeroContent';
import styles from './HeroSection.module.css';

function useThemeColors() {
  // Initial values match the Warm Editorial theme to prevent dark flash
  const [colors, setColors] = useState({ 
    bg: '#FFFBF7', 
    primary: '#D97757', 
    accent: '#ED8B6B' 
  });

  useEffect(() => {
    const updateColors = () => {
      const el = document.querySelector('.creative-theme') as HTMLElement;
      if (!el) return;
      const style = window.getComputedStyle(el);
      setColors({
        bg: style.getPropertyValue('--creative-bg-primary').trim() || '#09090B',
        primary: style.getPropertyValue('--brand-primary').trim() || '#4F46E5',
        accent: style.getPropertyValue('--brand-accent').trim() || '#6366F1'
      });
    };

    updateColors();
    // Observe class changes on creative-theme wrapper
    const observer = new MutationObserver(updateColors);
    const container = document.querySelector('.creative-theme');
    if (container) observer.observe(container, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return colors;
}

function CyberGrid({ colors }: { colors: { bg: string, primary: string, accent: string } }) {
  const gridRef = useRef<any>(null);
  const cursorRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // Gentle mouse parallax
    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = (state.pointer.y * Math.PI) / 8;
    
    state.camera.position.x += (targetX - state.camera.position.x) * 0.05;
    // Y position stays above the grid, tilt based on mouse Y
    state.camera.position.y += ((targetY * 2 + 3) - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);

    // Slowly move the grid to simulate forward movement
    if (gridRef.current) {
      // The grid sectionSize is 2, so modulo 2 creates a perfectly seamless loop
      // Moving positive Z means moving towards the camera.
      // Slower animation speed (0.5 instead of 1.5)
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <group>
      <Grid 
        ref={gridRef}
        args={[100, 100]} 
        position={[0, -2, 0]} 
        cellColor={colors.accent}
        sectionColor={colors.primary}
        sectionThickness={1.2}
        cellThickness={0.6}
        sectionSize={2} 
        cellSize={0.5}
        fadeDistance={30} 
        fadeStrength={1}
      />
      
      {/* Invisible plane to catch mouse interactions */}
      <mesh 
        position={[0, -2, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        visible={false}
        onPointerMove={(e) => {
          if (cursorRef.current && gridRef.current) {
            cursorRef.current.visible = true;
            
            // Calculate snapping to the grid which is moving
            const offsetZ = gridRef.current.position.z;
            
            const localX = Math.round(e.point.x / 0.5) * 0.5;
            const localZ = Math.round((e.point.z - offsetZ) / 0.5) * 0.5 + offsetZ;
            
            cursorRef.current.position.set(localX, -1.95, localZ);
          }
        }}
        onPointerOut={() => {
          if (cursorRef.current) {
            cursorRef.current.visible = false;
          }
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>

      {/* Interactive Highlight Cursor tracking the grid elements */}
      <mesh ref={cursorRef} visible={false}>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={0.85} />
      </mesh>

      {/* Cyberpunk ambient floating data particles */}
      <Sparkles 
        count={50} 
        scale={20} 
        size={2} 
        speed={0.4} 
        opacity={0.8} 
        color={colors.accent} 
        position={[0, 2, 0]}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}

export function HeroGridSection() {
  const colors = useThemeColors();

  return (
    <div className={styles.heroContainer} style={{ background: colors.bg }}>
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0" style={{ background: colors.bg }}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={60} />
          <CyberGrid colors={colors} />
          <fog attach="fog" args={[colors.bg, 5, 30]} />
        </Canvas>
      </div>
      
      {/* Content Layer: pointer-events-none so mouse events reach the 3D canvas beneath */}
      <div className={`absolute inset-0 z-10 flex items-center`} style={{ pointerEvents: 'none' }}>
        <div className={styles.heroTwoCol}>
          {/* Text Content — left column, re-enable pointer events */}
          <div className={styles.heroTextCol}>
            <HeroContent animate={true} />
          </div>

          {/* Profile image — right column on desktop, top on mobile */}
          <div className={styles.heroProfileWrapper}>
            <div className={styles.heroProfileRing}>
              <Image
                src="/profile.webp"
                alt="Gaurav Saxena"
                width={340}
                height={340}
                className={styles.heroProfileImage}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
