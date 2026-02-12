'use client';

import { ReactNode } from 'react';
import styles from './ServiceFrame.module.css';

interface ServiceFrameProps {
    illustration: ReactNode;
}

export function ServiceFrame({ illustration }: ServiceFrameProps) {
    return (
        <div className={styles.tabletWrapper}>
            {/* Tablet Frame */}
            <div className={styles.tabletBezel}>
                {/* Top bezel with camera */}
                <div className={styles.topBezel}>
                    <div className={styles.camera} />
                </div>

                {/* Screen area with illustration */}
                <div className={styles.screenArea}>
                    <div className={styles.illustrationContent}>
                        {illustration}
                    </div>
                </div>

                {/* Bottom bezel */}
                <div className={styles.bottomBezel} />
            </div>
        </div>
    );
}
