'use client';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Image from 'next/image';
import { HeroContent } from './HeroContent';
import { useGestures } from '@/themes/creative/context/GestureContext';
import styles from './HeroSection.module.css';

// --- CONFIGURABLE ANIMATION SPEEDS ---
const SPEED_CONFIG = {
  GRID_LOOP: 0.006,     // Speed of the infinite front-to-back movement
  CAMERA_TILT: 0.03,    // Smoothing factor for camera movement (lerp)
  TILT_RANGE_X: 5,      // Division factor for X tilt (lower = more tilt)
  TILT_RANGE_Y: 6       // Division factor for Y tilt
};

function useThemeColors() {
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
    const observer = new MutationObserver(updateColors);
    const container = document.querySelector('.creative-theme');
    if (container) observer.observe(container, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return colors;
}

interface HeroGridProps {
  colors: { bg: string, primary: string, accent: string };
  isHoveringContent: boolean;
}

function HeroGrid({ colors, isHoveringContent }: HeroGridProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gridRef = useRef<any>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const { isGesturesEnabled, isTrackingActive, handCoordinates, lastGesture } = useGestures();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseSnap = useMemo(() => new THREE.Vector2(), []);

  useFrame((state) => {
    let pointerX = state.pointer.x;
    let pointerY = state.pointer.y;
    let showCursor = !isHoveringContent;

    if (isGesturesEnabled && isTrackingActive && handCoordinates) {
      pointerX = (handCoordinates.x * 2) - 1;
      pointerY = -(handCoordinates.y * 2) + 1;
      if (lastGesture === 'Palm') showCursor = false;
      else if (lastGesture === 'Point') showCursor = true;
    }

    // --- INFINITE GRID LOOP ---
    if (gridRef.current) {
      gridRef.current.position.z += SPEED_CONFIG.GRID_LOOP;
      if (gridRef.current.position.z >= 2) {
        gridRef.current.position.z = 0;
      }
    }

    // --- SMOOTH CAMERA TILT ---
    const targetX = (pointerX * Math.PI) / SPEED_CONFIG.TILT_RANGE_X;
    const targetY = (pointerY * Math.PI) / SPEED_CONFIG.TILT_RANGE_Y;

    // Using state.camera directly from useFrame state to avoid immutability lint errors
    state.camera.position.x += (targetX * 5 - state.camera.position.x) * SPEED_CONFIG.CAMERA_TILT;
    state.camera.position.y += ((targetY * 5 + 4) - state.camera.position.y) * SPEED_CONFIG.CAMERA_TILT;
    state.camera.lookAt(0, 0, 0);

    // --- GRID HIGHLIGHT (BLOCK HOVER) ---
    if (cursorRef.current && planeRef.current && showCursor) {
      cursorRef.current.visible = true;
      mouseSnap.set(pointerX, pointerY);
      raycaster.setFromCamera(mouseSnap, state.camera);

      const intersects = raycaster.intersectObject(planeRef.current);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const localX = Math.round(point.x / 0.5) * 0.5;
        const localZ = Math.round(point.z / 0.5) * 0.5;
        cursorRef.current.position.set(localX, -1.95, localZ);
      } else {
        cursorRef.current.visible = false;
      }
    } else if (cursorRef.current) {
      cursorRef.current.visible = false;
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

      <mesh ref={planeRef} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>

      <mesh ref={cursorRef} visible={false}>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={0.85} />
      </mesh>

      <Sparkles count={50} scale={20} size={2} speed={0.4} opacity={0.8} color={colors.accent} position={[0, 2, 0]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}

interface HeroGridSectionProps {
  isHoveringContent: boolean;
  onHoverChange: (isHovering: boolean) => void;
}

export function HeroGridSection({ isHoveringContent, onHoverChange }: HeroGridSectionProps) {
  const colors = useThemeColors();

  return (
    <div className={styles.heroContainer} style={{ background: colors.bg }}>
      <div className="absolute inset-0 z-0" style={{ background: colors.bg }}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={60} />
          <HeroGrid colors={colors} isHoveringContent={isHoveringContent} />
          <fog attach="fog" args={[colors.bg, 5, 30]} />
        </Canvas>
      </div>

      <div className={`absolute inset-0 z-10 flex items-center`} style={{ pointerEvents: 'none' }}>
        <div className={styles.heroTwoCol}>
          {/* Text Content — left column */}
          <div className={styles.heroTextCol}>
            <HeroContent animate={true} onHoverChange={onHoverChange} />
          </div>

          {/* Profile image — right column on desktop, top on mobile */}
          <div className={styles.heroProfileWrapper}>
            <div
              className={styles.heroProfileRing}
              onMouseEnter={() => onHoverChange(true)}
              onMouseLeave={() => onHoverChange(false)}
              style={{ pointerEvents: 'auto' }}
            >
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
