'use client';
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Sphere, Line, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999.123) * 10000;
  return x - Math.floor(x);
}

function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  
  const nodes = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const theta = seededRandom(i + 1) * Math.PI * 2;
      const phi = Math.acos((seededRandom(i + 101) * 2) - 1);
      const radius = 2.5 + seededRandom(i + 201) * 4.5;
      
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
      
      const targetY = state.pointer.y * 0.5;
      groupRef.current.rotation.x += 0.05 * (targetY - groupRef.current.rotation.x);
    }
  });

  return (
    <group ref={groupRef} position={[6, -3.5, 0]}>
      <Sphere args={[0.6, 32, 32]}>
        <meshBasicMaterial color={hoveredNode !== null ? "#818CF8" : "#6366F1"} />
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
              <meshBasicMaterial color={isHovered ? "#ffffff" : "#4F46E5"} />
            </Sphere>
            <Line 
              points={[[0, 0, 0], [pos.x, pos.y, pos.z]]} 
              color={isHovered ? "#ffffff" : "#4338CA"} 
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
              color={isHovered ? "#818CF8" : "#4338CA"} 
              opacity={isHovered ? 0.6 : 0.15} 
              transparent 
              lineWidth={isHovered ? 1.5 : 0.5} 
            />
            <Line 
              points={[[pos1.x, pos1.y, pos1.z], [pos3.x, pos3.y, pos3.z]]} 
              color={isAcrossHovered ? "#818CF8" : "#4338CA"} 
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

export function NeuralNodeHero() {
  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 bg-[#09090B]">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
          <ambientLight intensity={0.5} />
          <NeuralNetwork />
          <Sparkles count={150} scale={15} size={1.5} speed={0.4} opacity={0.3} color="#6366F1" />
          <fog attach="fog" args={['#09090B', 5, 20]} />
        </Canvas>
      </div>
      
      <div className="absolute inset-0 z-10 flex flex-col justify-center pointer-events-none px-8 md:px-24">
        <div className="pointer-events-auto max-w-3xl">
          <p className="text-[#6366F1] font-bold tracking-widest uppercase mb-4 text-sm">Neural Architecture</p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#FAFAFA] leading-[1.1] mb-6 tracking-tight">
            Intelligent Systems<br/>For A Connected World
          </h1>
          <p className="text-lg md:text-xl text-[#A1A1AA] mb-10 max-w-2xl leading-relaxed">
            A beautiful, interactive hero component built with React Three Fiber.
            The neural nodes dynamically repel, connect, and illuminate based on your cursor interaction.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 bg-[#4F46E5] hover:bg-[#6366F1] text-white font-medium rounded-md transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              Explore Network
            </button>
            <button className="px-8 py-3 outline outline-1 outline-[#4F46E5] text-[#A5B4FC] hover:bg-[#4F46E5]/10 font-medium rounded-md transition-all duration-300">
              View Source
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
