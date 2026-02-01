/**
 * Custom hook for Matter.js physics engine lifecycle management
 */

import { useEffect, useRef, useState } from 'react';
import * as Matter from 'matter-js';
import type { PhysicsConfig, PhysicsEngineReturn } from '@/themes/creative/components/sections/stats/illustrations/types/physics.types';

interface UsePhysicsEngineOptions {
  config?: Partial<PhysicsConfig>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const DEFAULT_CONFIG: PhysicsConfig = {
  gravity: {
    x: 0,
    y: 1.5,
    scale: 0.001,
  },
  chip: {
    height: 60,
    restitution: 0.3,
    friction: 0.1,
    frictionStatic: 0.5,
    frictionAir: 0.01,
    density: 0.001,
  },
  ground: {
    restitution: 0.2,
    friction: 0.8,
  },
  engine: {
    enableSleeping: true,
    positionIterations: 6,
    velocityIterations: 4,
  },
  mouse: {
    stiffness: 0.2,
  },
};

export function usePhysicsEngine({
  config: userConfig,
  containerRef,
}: UsePhysicsEngineOptions): PhysicsEngineReturn | null {
  const [isInitialized, setIsInitialized] = useState(false);
  const engineRef = useRef<Matter.Engine | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  const bodyMapRef = useRef<Map<string, Matter.Body>>(new Map());

  useEffect(() => {
    if (!containerRef.current) return;

    const config = { ...DEFAULT_CONFIG, ...userConfig };

    // Create engine
    const engine = Matter.Engine.create({
      enableSleeping: config.engine.enableSleeping,
      positionIterations: config.engine.positionIterations,
      velocityIterations: config.engine.velocityIterations,
    });

    // Configure gravity
    engine.gravity.x = config.gravity.x;
    engine.gravity.y = config.gravity.y;
    engine.gravity.scale = config.gravity.scale;

    // Get world reference
    const world = engine.world;

    // Store references
    engineRef.current = engine;
    worldRef.current = world;

    setIsInitialized(true);

    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
      if (worldRef.current) {
        Matter.World.clear(worldRef.current, false);
      }
      bodyMapRef.current.clear();
      engineRef.current = null;
      worldRef.current = null;
      setIsInitialized(false);
    };
  }, [containerRef]);

  if (!isInitialized || !engineRef.current || !worldRef.current) {
    return null;
  }

  const addBody = (body: Matter.Body) => {
    if (!worldRef.current) return;
    Matter.World.add(worldRef.current, body);
    if (body.label) {
      bodyMapRef.current.set(body.label, body);
    }
  };

  const removeBody = (body: Matter.Body) => {
    if (!worldRef.current) return;
    Matter.World.remove(worldRef.current, body);
    if (body.label) {
      bodyMapRef.current.delete(body.label);
    }
  };

  const getBodyById = (id: string): Matter.Body | undefined => {
    return bodyMapRef.current.get(id);
  };

  const cleanup = () => {
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
    }
    if (worldRef.current) {
      Matter.World.clear(worldRef.current, false);
    }
    bodyMapRef.current.clear();
  };

  return {
    engine: engineRef.current,
    world: worldRef.current,
    addBody,
    removeBody,
    getBodyById,
    cleanup,
  };
}
