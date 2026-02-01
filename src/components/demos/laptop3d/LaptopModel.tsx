'use client';
import * as THREE from 'three';
import { useRef, useState, useEffect, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Cube008: THREE.Mesh;
    Cube008_1: THREE.Mesh;
    Cube008_2: THREE.Mesh;
    keyboard: THREE.Mesh;
    Cube002: THREE.Mesh;
    Cube002_1: THREE.Mesh;
    touchbar: THREE.Mesh;
  };
  materials: {
    aluminium: THREE.MeshStandardMaterial;
    'matte.001': THREE.MeshStandardMaterial;
    'screen.001': THREE.MeshStandardMaterial;
    keys: THREE.MeshStandardMaterial;
    trackpad: THREE.MeshStandardMaterial;
    touchbar: THREE.MeshStandardMaterial;
  };
};

interface LaptopModelProps {
  open: boolean;
  hinge: number;
  screenContent?: ReactNode;
  enableMagneticEffect?: boolean;
}

export function LaptopModel({
  open,
  hinge,
  screenContent,
  enableMagneticEffect = true,
  ...props
}: LaptopModelProps) {
  const group = useRef<THREE.Group>(null!);
  const { nodes, materials } = useGLTF(
    '/models/mac-draco.glb'
  ) as unknown as GLTFResult;

  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();

  // Mouse position for magnetic effect
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (enableMagneticEffect && open) {
      // Magnetic effect - laptop follows mouse with lerp for smoothness
      const targetRotationX = Math.cos(t / 10) / 10 + 0.25 + mouse.current.y * 0.15;
      const targetRotationY = Math.sin(t / 10) / 4 + mouse.current.x * 0.3;
      const targetRotationZ = Math.sin(t / 10) / 10;

      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetRotationX,
        0.1
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotationY,
        0.1
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        targetRotationZ,
        0.1
      );
    } else {
      // Original floating effect
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        open ? Math.cos(t / 10) / 10 + 0.25 : 0,
        0.1
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        open ? Math.sin(t / 10) / 4 : 0,
        0.1
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        open ? Math.sin(t / 10) / 10 : 0,
        0.1
      );
    }

    // Vertical floating
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      open ? (-2 + Math.sin(t)) / 3 : -4.3,
      0.1
    );
  });

  return (
    <group
      ref={group}
      {...props}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      dispose={null}
    >
      {/* Screen/Lid group - animated with hinge */}
      <group rotation-x={hinge} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            geometry={nodes.Cube008.geometry}
            material={materials.aluminium}
          />
          <mesh
            geometry={nodes.Cube008_1.geometry}
            material={materials['matte.001']}
          />
          <mesh
            geometry={nodes.Cube008_2.geometry}
            material={materials['screen.001']}
          >
            {screenContent && (
              <Html
                className="laptop-screen-content"
                position={[0, 0.05, -0.09]}
                rotation-x={-Math.PI / 2}
                transform
                occlude
              >
                <div className="laptop-screen-wrapper">
                  {screenContent}
                </div>
              </Html>
            )}
          </mesh>
        </group>
      </group>

      {/* Keyboard */}
      <mesh
        geometry={nodes.keyboard.geometry}
        material={materials.keys}
        position={[1.79, 0, 3.45]}
      />

      {/* Trackpad */}
      <group position={[0, -0.1, 3.39]}>
        <mesh
          geometry={nodes.Cube002.geometry}
          material={materials.aluminium}
        />
        <mesh
          geometry={nodes.Cube002_1.geometry}
          material={materials.trackpad}
        />
      </group>

      {/* Touchbar */}
      <mesh
        geometry={nodes.touchbar.geometry}
        material={materials.touchbar}
        position={[0, -0.03, 1.2]}
      />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/mac-draco.glb');
