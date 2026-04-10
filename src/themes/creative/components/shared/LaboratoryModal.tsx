'use client';

import { X, FlaskConical, Camera, Info, Hand, MousePointer2 } from 'lucide-react';
import { useGestures } from '@/themes/creative/context/GestureContext';
import styles from './LaboratoryModal.module.css';
import { useEffect } from 'react';

interface LaboratoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LaboratoryModal({ isOpen, onClose }: LaboratoryModalProps) {
  const { isGesturesEnabled, setIsGesturesEnabled } = useGestures();

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <FlaskConical className={styles.flaskIcon} size={24} />
            <div>
              <h2 className={styles.title}>The Laboratory</h2>
              <p className={styles.subtitle}>Experimental AI Features</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.featureHeader}>
              <div className={styles.featureInfo}>
                <Hand className={styles.featureIcon} size={20} />
                <h3 className={styles.featureTitle}>Hand Gesture Interactions</h3>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={isGesturesEnabled}
                  onChange={(e) => setIsGesturesEnabled(e.target.checked)}
                />
                <span className={styles.slider} />
              </label>
            </div>

            <p className={styles.description}>
              Control the portfolio using your physical hand movements. This uses **MediaPipe ML** 
              directly in your browser. No data is sent to any server.
            </p>

            {isGesturesEnabled && (
              <div className={styles.permissionAlert}>
                <Camera size={16} />
                <span>Camera access required for real-time tracking.</span>
              </div>
            )}

            <div className={styles.gestureGuide}>
              <h4 className={styles.guideTitle}>Gesture Guide</h4>
              <div className={styles.guideGrid}>
                <div className={styles.guideItem}>
                  <div className={styles.guideIcon}><MousePointer2 size={16} /></div>
                  <div className={styles.guideText}>
                    <strong>Palm</strong>
                    <span>Tilt Hero Parallax</span>
                  </div>
                </div>
                <div className={styles.guideItem}>
                  <div className={styles.guideIcon}>☝️</div>
                  <div className={styles.guideText}>
                    <strong>Point</strong>
                    <span>Highlight nodes/elements</span>
                  </div>
                </div>
                <div className={styles.guideItem}>
                  <div className={styles.guideIcon}>🤏</div>
                  <div className={styles.guideText}>
                    <strong>Pinch</strong>
                    <span>Drag & toss physics chips</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className={styles.footer}>
            <Info size={14} />
            <p>Experimental features may affect performance on older devices.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
