'use client';

import { memo } from 'react';
import { LaptopScene } from '@/components/demos/laptop3d/LaptopScene';
import { DashboardScreen } from './screens/DashboardScreen';
import styles from './LaptopIllustration.module.css';

interface LaptopIllustrationProps {
  className?: string;
}

export const LaptopIllustration = memo(function LaptopIllustration({
  className,
}: LaptopIllustrationProps) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <LaptopScene
        screenContent={<DashboardScreen />}
        showClickText={false}
        enableMagneticEffect={true}
        transparent={true}  // Use transparent background in stats section
      />
    </div>
  );
});
