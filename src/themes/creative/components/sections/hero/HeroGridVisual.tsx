'use client';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Grid, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Image from 'next/image';
import { HeroContent } from './HeroContent';
import { useGestures } from '@/themes/creative/context/GestureContext';
import { useGyroscope } from '@/themes/creative/hooks/useGyroscope';
import styles from './HeroSection.module.css';

const TAP_HIGHLIGHT_DURATION_MS = 4000;
const TAP_FADE_DURATION = 0.4;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}

// --- CONFIGURABLE ANIMATION SPEEDS ---
const SPEED_CONFIG = {
  GRID_LOOP: 0.006,     // Speed of the infinite front-to-back movement
  CAMERA_TILT: 0.04,    // Smoothing factor for camera movement (lerp) — lower = smoother
  TILT_RANGE_X: 11,     // Division factor for X tilt (higher = subtler)
  TILT_RANGE_Y: 12,     // Division factor for Y tilt
  CAMERA_OFFSET: 2.65   // Amplitude multiplier on camera position (+20% from 2.2)
};

// Mobile gyro: raw readings are small (gamma/45 ≈ 0.1–0.4 for normal wrist tilt).
// Scale up so even subtle tilts produce a visible camera shift.
const MOBILE_GYRO_SCALE = 3.0;

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
      const next = {
        bg: style.getPropertyValue('--creative-bg-primary').trim() || '#09090B',
        primary: style.getPropertyValue('--brand-primary').trim() || '#4F46E5',
        accent: style.getPropertyValue('--brand-accent').trim() || '#6366F1'
      };
      setColors((prev) =>
        prev.bg === next.bg && prev.primary === next.primary && prev.accent === next.accent
          ? prev
          : next
      );
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
  // gridGroupRef wraps the Grid so React re-renders (e.g. color updates) can't reset
  // the animated position — we mutate the Group's position directly in useFrame.
  const gridGroupRef = useRef<THREE.Group>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const { isGesturesEnabled, isTrackingActive, handCoordinates, lastGesture } = useGestures();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseSnap = useMemo(() => new THREE.Vector2(), []);

  const isMobile = useIsMobile();
  const gyro = useGyroscope();

  // Mobile tap-to-highlight state
  const tapActiveRef = useRef(false);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetOpacityRef = useRef(0.85);
  const hasMoved = useRef(false); // tracks if pointer ever moved from initial (0,0)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, []);

  const handleTap = (e: ThreeEvent<PointerEvent>) => {
    if (!isMobile) return;
    if (!cursorRef.current) return;
    const point = e.point;
    const localX = Math.round(point.x / 0.5) * 0.5;
    const localZ = Math.round(point.z / 0.5) * 0.5;
    cursorRef.current.position.set(localX, -1.95, localZ);
    cursorRef.current.visible = true;
    tapActiveRef.current = true;
    targetOpacityRef.current = 0.85;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      targetOpacityRef.current = 0;
    }, TAP_HIGHLIGHT_DURATION_MS);
  };

  useFrame((state, delta) => {
    let pointerX = state.pointer.x;
    let pointerY = state.pointer.y;
    let showCursor = !isHoveringContent;

    // Mobile: use gyroscope for camera tilt.
    // Scale up so subtle wrist tilts (gamma ~10-15°) produce a clearly visible camera shift.
    if (isMobile && gyro.isActive) {
      pointerX = Math.max(-1, Math.min(1, gyro.readingRef.current.x * MOBILE_GYRO_SCALE));
      pointerY = Math.max(-1, Math.min(1, gyro.readingRef.current.y * MOBILE_GYRO_SCALE));
    }

    if (isGesturesEnabled && isTrackingActive && handCoordinates) {
      pointerX = (handCoordinates.x * 2) - 1;
      pointerY = -(handCoordinates.y * 2) + 1;
      if (lastGesture === 'Palm') showCursor = false;
      else if (lastGesture === 'Point') showCursor = true;
    }

    // --- INFINITE GRID LOOP ---
    // Animate the GROUP (not the Grid directly) so React re-renders can't reset position.
    // Use -= 2 (not = 0) to preserve float remainder and avoid a visible seam.
    if (gridGroupRef.current) {
      gridGroupRef.current.position.z += SPEED_CONFIG.GRID_LOOP;
      if (gridGroupRef.current.position.z >= 2) {
        gridGroupRef.current.position.z -= 2;
      }
    }

    // --- SMOOTH CAMERA TILT ---
    const targetX = (pointerX * Math.PI) / SPEED_CONFIG.TILT_RANGE_X;
    const targetY = (pointerY * Math.PI) / SPEED_CONFIG.TILT_RANGE_Y;

    state.camera.position.x += (targetX * SPEED_CONFIG.CAMERA_OFFSET - state.camera.position.x) * SPEED_CONFIG.CAMERA_TILT;
    state.camera.position.y += ((targetY * SPEED_CONFIG.CAMERA_OFFSET + 4) - state.camera.position.y) * SPEED_CONFIG.CAMERA_TILT;
    state.camera.lookAt(0, 0, 0);

    // --- GRID HIGHLIGHT ---
    if (cursorRef.current) {
      if (isMobile) {
        // Mobile: cursor only on tap + auto-fade
        if (tapActiveRef.current) {
          const mat = cursorRef.current.material as THREE.MeshBasicMaterial;
          const fadeStep = delta / TAP_FADE_DURATION;
          mat.opacity += (targetOpacityRef.current - mat.opacity) * Math.min(1, fadeStep * 3);
          if (targetOpacityRef.current === 0 && mat.opacity < 0.02) {
            cursorRef.current.visible = false;
            tapActiveRef.current = false;
            mat.opacity = 0.85;
          }
        }
      } else if (planeRef.current && showCursor) {
        mouseSnap.set(pointerX, pointerY);
        raycaster.setFromCamera(mouseSnap, state.camera);
        const intersects = raycaster.intersectObject(planeRef.current);
        if (intersects.length > 0) {
          const point = intersects[0].point;
          const localX = Math.round(point.x / 0.5) * 0.5;
          const localZ = Math.round(point.z / 0.5) * 0.5;
          // Only show once pointer has actually moved from center (avoid initial static block)
          if (pointerX !== 0 || pointerY !== 0) hasMoved.current = true;
          if (hasMoved.current) {
            cursorRef.current.visible = true;
            cursorRef.current.position.set(localX, -1.95, localZ);
          } else {
            cursorRef.current.visible = false;
          }
        } else {
          cursorRef.current.visible = false;
        }
      } else {
        cursorRef.current.visible = false;
      }
    }
  });

  // Memoize the Grid element — rebuild only when colors actually change.
  // Prevents re-creation from parent re-renders (pointer, isHoveringContent).
  const gridEl = useMemo(() => (
    <Grid
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
  ), [colors.accent, colors.primary]);

  return (
    <group>
      {/* Wrapper group — we animate this group's z so React grid re-renders don't flicker */}
      <group ref={gridGroupRef}>
        {gridEl}
      </group>

      {/* Hidden raycast plane for cursor highlight math — not drawn, no z-fighting. */}
      <mesh
        ref={planeRef}
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>

      {/* Mobile-only tap plane — offset above grid, no depth write, only mounted on mobile. */}
      {isMobile && (
        <mesh
          position={[0, -1.98, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerDown={handleTap}
          renderOrder={-1}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
        </mesh>
      )}

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
        <Canvas
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
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
