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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'var(--creative-bg-primary)' }}>
            <div className="w-full max-w-5xl flex flex-col gap-6" style={{ color: 'var(--creative-text-secondary)' }}>
                {/* Skeleton layout mimicking hero with social/header placeholders */}
                <div className="flex flex-col gap-4 md:gap-6">
                    <div className="h-8 w-40 rounded animate-pulse" style={{ background: 'color-mix(in srgb, var(--creative-text-secondary) 12%, transparent)' }} aria-hidden="true" />
                    <div className="space-y-3">
                        <div className="h-12 w-3/4 rounded animate-pulse" style={{ background: 'color-mix(in srgb, var(--creative-text-secondary) 10%, transparent)' }} aria-hidden="true" />
                        <div className="h-12 w-1/2 rounded animate-pulse" style={{ background: 'color-mix(in srgb, var(--creative-text-secondary) 10%, transparent)' }} aria-hidden="true" />
                    </div>
                    <div className="h-16 w-full max-w-2xl rounded animate-pulse" style={{ background: 'color-mix(in srgb, var(--creative-text-secondary) 8%, transparent)' }} aria-hidden="true" />
                    <div className="flex gap-3">
                        <div className="h-11 w-32 rounded-full animate-pulse" style={{ background: 'color-mix(in srgb, var(--creative-text-secondary) 12%, transparent)' }} aria-hidden="true" />
                        <div className="h-11 w-32 rounded-full animate-pulse" style={{ background: 'color-mix(in srgb, var(--creative-text-secondary) 12%, transparent)' }} aria-hidden="true" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-10 w-10 rounded-full animate-pulse" style={{ background: 'color-mix(in srgb, var(--creative-text-secondary) 15%, transparent)' }} aria-hidden="true" />
                        <div className="h-10 w-10 rounded-full animate-pulse" style={{ background: 'color-mix(in srgb, var(--creative-text-secondary) 15%, transparent)' }} aria-hidden="true" />
                        <div className="h-10 w-10 rounded-full animate-pulse" style={{ background: 'color-mix(in srgb, var(--creative-text-secondary) 15%, transparent)' }} aria-hidden="true" />
                    </div>
                </div>
            </div>
        </div>
    );
};
