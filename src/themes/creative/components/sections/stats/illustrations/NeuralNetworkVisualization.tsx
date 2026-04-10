'use client';
import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Sphere, Line, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useGestures } from '@/themes/creative/context/GestureContext';

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
  const { isGesturesEnabled, isTrackingActive, handCoordinates, lastGesture } = useGestures();
  
  const { nodes, connections } = useMemo(() => {
    // Use deterministic seeded random for consistent positioning
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    // Generate nodes
    const generatedNodes = Array.from({ length: 60 }).map((_, i) => {
      const theta = random(i + 1) * Math.PI * 2;
      const phi = Math.acos((random(i + 42) * 2) - 1);
      const radius = 2.0 + random(i + 100) * 3.5; // Tighter radius
      
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    });

    // Generate connections (nearest neighbors)
    const generatedConnections: Array<[number, number]> = [];
    generatedNodes.forEach((node, i) => {
      // Find 2 closest neighbors for each node to create a complex web
      const distances = generatedNodes
        .map((other, j) => ({ index: j, dist: node.distanceTo(other) }))
        .filter(d => d.index !== i)
        .sort((a, b) => a.dist - b.dist);
      
      // Connect to top 2 neighbors
      for (let k = 0; k < 2; k++) {
        const neighborIdx = distances[k].index;
        // Avoid duplicate lines (i, j) and (j, i)
        if (i < neighborIdx) {
          generatedConnections.push([i, neighborIdx]);
        }
      }
    });
    
    return { nodes: generatedNodes, connections: generatedConnections };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.02;
      
      const targetY = state.pointer.y * 0.5;
      groupRef.current.rotation.x += 0.05 * (targetY - groupRef.current.rotation.x);

      // --- NEW: Hand Gesture Interaction (Pointing) ---
      if (isGesturesEnabled && isTrackingActive && handCoordinates && lastGesture === 'Point') {
        // Map hand to -1 to 1 range (for raycasting/comparison)
        const px = (handCoordinates.x * 2) - 1;
        const py = -((handCoordinates.y * 2) - 1);

        let closestIdx = -1;
        let minDistance = 0.5; // Detection threshold

        nodes.forEach((pos, i) => {
          // Project 3D node to 2D screen space for simplified distance check
          const vector = pos.clone();
          vector.applyMatrix4(groupRef.current!.matrixWorld);
          vector.project(state.camera);
          
          const d = Math.hypot(vector.x - px, vector.y - py);
          if (d < minDistance) {
            minDistance = d;
            closestIdx = i;
          }
        });

        setHoveredNode(closestIdx !== -1 ? closestIdx : null);
      }
    }
  });

  return (
    <group ref={groupRef} position={[2.2, -1.8, 1]} rotation={[0, -Math.PI / 4, 0]}> {/* Bottom-right position */}
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

      {connections.map(([i, j], idx) => {
        const pos1 = nodes[i];
        const pos2 = nodes[j];
        const isHovered = hoveredNode === i || hoveredNode === j;
        
        return (
          <Line 
            key={`connection-${idx}`}
            points={[[pos1.x, pos1.y, pos1.z], [pos2.x, pos2.y, pos2.z]]} 
            color={isHovered ? colors.accent : colors.secondary} 
            opacity={isHovered ? 0.7 : 0.25} 
            transparent 
            lineWidth={isHovered ? 1.5 : 0.5} 
          />
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
