'use client';
import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Sphere, Line, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function useThemeColors() {
  const [colors, setColors] = useState({ 
    bg: '#09090B', 
    primary: '#4F46E5', 
    secondary: '#4338CA',
    accent: '#6366F1' 
  });

  useEffect(() => {
    const updateColors = () => {
      const el = document.querySelector('.creative-theme') as HTMLElement;
      if (!el) return;
      const style = window.getComputedStyle(el);
      setColors({
        bg: style.getPropertyValue('--creative-bg-primary').trim() || '#09090B',
        primary: style.getPropertyValue('--brand-primary').trim() || '#4F46E5',
        secondary: style.getPropertyValue('--brand-secondary').trim() || '#4338CA',
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

function NeuralNetwork({ colors }: { colors: { bg: string, primary: string, secondary: string, accent: string } }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  
  const nodes = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 2.5 + Math.random() * 4.5;
      
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.02;
      
      const targetX = state.pointer.x * 0.5;
      const targetY = state.pointer.y * 0.5;
      groupRef.current.rotation.x += 0.05 * (targetY - groupRef.current.rotation.x);
    }
  });

  return (
    <group ref={groupRef} position={[3, -2, 0]}> {/* Adjusted for smaller container, still bottom right */}
      <Sphere args={[0.6, 32, 32]}>
        <meshBasicMaterial color={hoveredNode !== null ? colors.accent : colors.primary} />
      </Sphere>

      {nodes.map((pos, i) => {
        const isHovered = hoveredNode === i;
        return (
          <group key={`node-${i}`}>
            <Sphere 
              position={pos} 
              args={[isHovered ? 0.2 : 0.08, 16, 16]}
              onPointerOver={(e) => { e.stopPropagation(); setHoveredNode(i); }}
              onPointerOut={(e) => { e.stopPropagation(); setHoveredNode(null); }}
            >
              <meshBasicMaterial color={isHovered ? "#ffffff" : colors.primary} />
            </Sphere>
            <Line 
              points={[[0, 0, 0], [pos.x, pos.y, pos.z]]} 
              color={isHovered ? "#ffffff" : colors.secondary} 
              opacity={isHovered ? 0.8 : 0.2} 
              transparent 
              lineWidth={isHovered ? 2 : 1} 
            />
          </group>
        );
      })}

      {nodes.map((pos1, i) => {
        const nextIndex = (i + 1) % nodes.length;
        const pos2 = nodes[nextIndex];
        const isHovered = hoveredNode === i || hoveredNode === nextIndex;
        
        const acrossIndex = (i + Math.floor(nodes.length / 3)) % nodes.length;
        const pos3 = nodes[acrossIndex];
        const isAcrossHovered = hoveredNode === i || hoveredNode === acrossIndex;
        
        return (
          <group key={`web-group-${i}`}>
            <Line 
              points={[[pos1.x, pos1.y, pos1.z], [pos2.x, pos2.y, pos2.z]]} 
              color={isHovered ? colors.accent : colors.secondary} 
              opacity={isHovered ? 0.6 : 0.15} 
              transparent 
              lineWidth={isHovered ? 1.5 : 0.5} 
            />
            <Line 
              points={[[pos1.x, pos1.y, pos1.z], [pos3.x, pos3.y, pos3.z]]} 
              color={isAcrossHovered ? colors.accent : colors.secondary} 
              opacity={isAcrossHovered ? 0.4 : 0.1} 
              transparent 
              lineWidth={isAcrossHovered ? 1 : 0.5} 
            />
          </group>
        );
      })}
    </group>
  );
}

export function NeuralNetworkVisualization() {
  const colors = useThemeColors();

  return (
    <div className="relative w-full h-[500px] overflow-hidden" style={{ cursor: 'crosshair', pointerEvents: 'auto', background: colors.bg }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
        <ambientLight intensity={0.5} />
        <NeuralNetwork colors={colors} />
        <Sparkles 
          count={150} 
          scale={15} 
          size={1.5} 
          speed={0.4} 
          opacity={0.3} 
          color={colors.accent} 
        />
        <fog attach="fog" args={[colors.bg, 5, 20]} />
      </Canvas>
    </div>
  );
}
