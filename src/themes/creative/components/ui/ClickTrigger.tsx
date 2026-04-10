'use client';

import { useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import styles from './ClickTrigger.module.css';

// ─── Individual particle element ───────────────────────────────────────────
interface ArmProps {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

function RippleArm({ x, y, direction }: ArmProps) {
  const isVertical = direction === 'up' || direction === 'down';
  const dirClass =
    direction === 'up' ? styles.armUp :
    direction === 'down' ? styles.armDown :
    direction === 'left' ? styles.armLeft :
    styles.armRight;

  return (
    <div
      className={`${styles.rippleArm} ${isVertical ? styles.armVertical : styles.armHorizontal} ${dirClass}`}
      style={{ left: x, top: y }}
    />
  );
}

interface DotProps {
  x: number;
  y: number;
  corner: 'tl' | 'tr' | 'bl' | 'br';
}

function CornerDot({ x, y, corner }: DotProps) {
  const cornerClass =
    corner === 'tl' ? styles.dotTopLeft :
    corner === 'tr' ? styles.dotTopRight :
    corner === 'bl' ? styles.dotBottomLeft :
    styles.dotBottomRight;

  return (
    <div
      className={`${styles.cornerDot} ${cornerClass}`}
      style={{ left: x, top: y }}
    />
  );
}

// ─── Spawn burst at x,y (window-absolute coords) ─────────────────────────
function spawnBurst(x: number, y: number) {
  const container = document.createElement('div');
  // Cheap host element — no layout impact
  container.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;z-index:9999;';
  document.body.appendChild(container);

  const root = createRoot(container);

  root.render(
    <>
      <RippleArm x={x} y={y} direction="up" />
      <RippleArm x={x} y={y} direction="down" />
      <RippleArm x={x} y={y} direction="left" />
      <RippleArm x={x} y={y} direction="right" />
      <CornerDot x={x} y={y} corner="tl" />
      <CornerDot x={x} y={y} corner="tr" />
      <CornerDot x={x} y={y} corner="bl" />
      <CornerDot x={x} y={y} corner="br" />
    </>
  );

  // Clean up after animation completes (600ms + small buffer)
  setTimeout(() => {
    root.unmount();
    container.remove();
  }, 700);
}

// ─── Global click handler hook ────────────────────────────────────────────
/**
 * ClickTrigger — site-wide cursor click animation.
 *
 * Renders an accent-coloured plus-burst at the exact click coordinates,
 * themed via `--creative-accent`. Mount once in the layout; no visible DOM.
 */
export function ClickTrigger() {
  const handleClick = useCallback((e: MouseEvent) => {
    // Don't fire on interactive elements that have their own click feedback
    const target = e.target as HTMLElement;
    if (target.closest('a, button, [role="button"]')) return;

    spawnBurst(e.clientX, e.clientY);
  }, []);

  useEffect(() => {
    // Use capture phase so we always fire before any stopPropagation
    window.addEventListener('click', handleClick, { capture: true });
    return () => window.removeEventListener('click', handleClick, { capture: true });
  }, [handleClick]);

  // This component renders nothing — it's a pure side-effect provider
  return null;
}
