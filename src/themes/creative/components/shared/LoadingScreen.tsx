'use client';

import React, { useEffect } from 'react';

export const LoadingScreen = () => {
    useEffect(() => {
        // Preload ALL critical components during initial loading screen
        const preloadCriticalComponents = async () => {
            try {
                // Preload 3D laptop model
                await import('@/components/demos/laptop3d');
                
                // Preload service illustrations
                await Promise.all([
                    import('./../sections/services/illustrations/AiAppIllustration'),
                    import('./../sections/services/illustrations/ImmersiveWebIllustration'),
                    import('./../sections/services/illustrations/DevelopmentIllustration'),
                    import('./../sections/services/illustrations/IntegrationsIllustration'),
                    import('./../sections/services/illustrations/SeoIllustration'),
                ]);

                // Preload stats illustrations
                await Promise.all([
                    import('./../sections/stats').then(mod => mod.AIBrainIllustration),
                    import('./../sections/stats').then(mod => mod.ChipStacking),
                    import('./../sections/stats').then(mod => mod.GlobeVisualization),
                ]);

                // Preload mobile components
                await Promise.all([
                    import('./../sections/stats/MobileStatPanel'),
                    import('./../layout/ServiceFrame'),
                ]);

                console.log('[LoadingScreen] All critical components preloaded');
            } catch (error) {
                console.warn('[LoadingScreen] Preload failed:', error);
            }
        };

        preloadCriticalComponents();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0E0D]">
            <div className="text-[#E6E6E6] text-sm tracking-widest uppercase">
                Loading...
            </div>
        </div>
    );
};
