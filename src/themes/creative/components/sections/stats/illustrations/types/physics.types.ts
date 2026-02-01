/**
 * TypeScript types for Matter.js physics integration
 */

import * as Matter from 'matter-js';

export interface ChipData {
  id: string;
  text: string;
  baseWidth: number;
  width: number;
  color: string;
}

export interface PhysicsConfig {
  gravity: {
    x: number;
    y: number;
    scale: number;
  };
  chip: {
    height: number;
    restitution: number;
    friction: number;
    frictionStatic: number;
    frictionAir: number;
    density: number;
  };
  ground: {
    restitution: number;
    friction: number;
  };
  engine: {
    enableSleeping: boolean;
    positionIterations: number;
    velocityIterations: number;
  };
  mouse: {
    stiffness: number;
  };
}

export interface PhysicsEngineReturn {
  engine: Matter.Engine;
  world: Matter.World;
  addBody: (body: Matter.Body) => void;
  removeBody: (body: Matter.Body) => void;
  getBodyById: (id: string) => Matter.Body | undefined;
  cleanup: () => void;
}

export interface ChipBody {
  data: ChipData;
  body: Matter.Body;
  element: HTMLDivElement | null;
}

export interface AnimationState {
  isPhysicsActive: boolean;
  isAnimating: boolean;
  animationFrameId: number | null;
}
