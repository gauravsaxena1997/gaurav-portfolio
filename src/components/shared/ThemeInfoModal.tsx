'use client';

import { Palette } from 'lucide-react';
import { Modal } from './Modal';
import styles from './ThemeInfoModal.module.css';

interface ThemeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: 'creative' | 'github';
  onThemeSwitch: (theme: 'creative' | 'github') => void;
}

export function ThemeInfoModal({
  isOpen,
  onClose,
  currentTheme,
  onThemeSwitch,
}: ThemeInfoModalProps) {
  const targetTheme = currentTheme === 'creative' ? 'github' : 'creative';

  const content = {
    creative: {
      currentName: 'Creative Theme',
      currentDesc:
        'Immersive experience with animations and visual storytelling.',
      altName: 'GitHub Theme',
      altDesc:
        'Developer-focused interface with structured layouts.',
      buttonText: 'Switch to GitHub Theme',
    },
    github: {
      currentName: 'GitHub Theme',
      currentDesc:
        'Developer-focused interface with structured layouts.',
      altName: 'Creative Theme',
      altDesc:
        'Immersive experience with animations and visual storytelling.',
      buttonText: 'Switch to Creative Theme',
    },
  };

  const { currentName, currentDesc, altName, altDesc, buttonText } =
    content[currentTheme];

  const handleSwitch = () => {
    onThemeSwitch(targetTheme);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="700px">
      <div className={styles.modalContent}>
        {/* Header with icon and title */}
        <div className={styles.header}>
          <Palette className={styles.icon} size={32} />
          <h2 className={styles.heading}>Portfolio Experiences</h2>
        </div>

        <p className={styles.intro}>
          Explore the same work through different design perspectives.
        </p>

        {/* Horizontal theme comparison */}
        <div className={styles.themesContainer}>
          <section className={styles.themeCard}>
            <span className={styles.label}>Currently Viewing</span>
            <h3 className={styles.themeName}>{currentName}</h3>
            <p className={styles.themeDesc}>{currentDesc}</p>
          </section>

          <section className={styles.themeCard}>
            <span className={styles.label}>Also Available</span>
            <h3 className={styles.themeName}>{altName}</h3>
            <p className={styles.themeDesc}>{altDesc}</p>
          </section>
        </div>

        <button className={styles.switchButton} onClick={handleSwitch}>
          {buttonText}
        </button>
      </div>
    </Modal>
  );
}
