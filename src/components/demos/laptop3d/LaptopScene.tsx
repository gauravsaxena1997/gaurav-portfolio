'use client';
import { Suspense, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { useSpring } from '@react-spring/core';
import { a as three } from '@react-spring/three';
import { a as web } from '@react-spring/web';
import { LaptopModel } from './LaptopModel';
import styles from './LaptopScene.module.css';

interface LaptopSceneProps {
  screenContent?: ReactNode;
  showClickText?: boolean;
  enableMagneticEffect?: boolean;
}

export function LaptopScene({ screenContent, showClickText = true, enableMagneticEffect = true }: LaptopSceneProps) {
  const [open, setOpen] = useState(false);
  const props = useSpring({ open: Number(open) });

  return (
    <web.main
      className={styles.container}
      style={{ background: props.open.to([0, 1], ['#f0f0f0', '#d25578']) }}
    >
      {showClickText && (
        <web.h1
          className={styles.clickText}
          style={{
            opacity: props.open.to([0, 1], [1, 0]),
            transform: props.open.to(
              (o) => `translate3d(-50%,${o * 50 - 100}px,0)`
            ),
          }}
        >
          click
        </web.h1>
      )}

      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, -25], fov: 35 }}>
        <three.pointLight
          position={[10, 10, 10]}
          intensity={1.5}
          color={props.open.to([0, 1], ['#f0f0f0', '#d25578'])}
        />
        <Suspense fallback={null}>
          <group rotation={[0, Math.PI, 0]} onClick={() => setOpen(!open)}>
            <LaptopModel
              open={open}
              hinge={props.open.to([0, 1], [1.575, -0.425])}
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
    </web.main>
  );
}
