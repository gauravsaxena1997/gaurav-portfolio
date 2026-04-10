'use client';

import { useGestures } from '@/themes/creative/context/GestureContext';
import styles from './GestureFeedback.module.css';

/**
 * GestureFeedback: A visual cursor that follows the detected hand position.
 * Shows a ring for Point, a solid dot for Pinch, and a faint circle for Palm.
 */
export function GestureFeedback() {
  const { isGesturesEnabled, isTrackingActive, handCoordinates, lastGesture } = useGestures();

  if (!isGesturesEnabled || !isTrackingActive || !handCoordinates) {
    return null;
  }

  // Map normalized coordinates (0-1) to viewport percentages
  const left = `${handCoordinates.x * 100}%`;
  const top = `${handCoordinates.y * 100}%`;

  return (
    <div 
      className={styles.container}
      style={{ left, top }}
    >
      <div className={`${styles.cursor} ${styles[lastGesture.toLowerCase()] || ''}`}>
        {/* Glow effect */}
        <div className={styles.glow} />
        
        {/* Inner indicator */}
        <div className={styles.dot} />

        {/* Gesture Label */}
        {lastGesture !== 'None' && (
          <div className={styles.label}>
            {lastGesture}
          </div>
        )}
      </div>
    </div>
  );
}
