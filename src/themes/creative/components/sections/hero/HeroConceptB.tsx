'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { HeroContent } from './HeroContent';
import styles from './HeroSection.module.css';

function CyberGrid() {
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
        cellColor="#6366F1" /* brand-accent */
        sectionColor="#4F46E5" /* brand-primary */
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
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshBasicMaterial color="#a5b4fc" transparent opacity={0.6} />
      </mesh>

      {/* Cyberpunk ambient floating data particles */}
      <Sparkles 
        count={50} 
        scale={20} 
        size={2} 
        speed={0.4} 
        opacity={0.8} 
        color="#818CF8" 
        position={[0, 2, 0]}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}

export function HeroConceptB() {
  return (
    <div className={styles.heroContainer}>
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 bg-[#09090B]">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={60} />
          <CyberGrid />
          <fog attach="fog" args={['#09090B', 5, 30]} />
        </Canvas>
      </div>
      
      {/* Content Layer Layer */}
      <div className="absolute inset-0 z-10 flex items-center pointer-events-none">
        <div className="pointer-events-auto">
          <HeroContent animate={true} />
        </div>
      </div>
    </div>
  );
}
