import React from 'react';
import { MobileChipStack } from './MobileChipStack';
import { AIBrainIllustration } from './illustrations/AIBrainIllustration';
import { GlobeVisualization } from './illustrations/GlobeVisualization';
import { Highlights, MobileCardHeader } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';
import { STATS_DATA } from '@/config/stats';

interface MobileStatPanelProps {
    index: number;
}

export const MobileStatPanel = ({ index }: MobileStatPanelProps) => {
    const stat = STATS_DATA[index];
    const Icon = stat?.icon;

    return (
        <div className="relative w-full bg-[var(--creative-bg-secondary)] flex flex-col">
            {/* Content Container - Uses global padding for consistency */}
            <div className="flex flex-col px-8 pt-12 pb-8 gap-6">

                {/* Header */}
                <div className="w-full">
                    <MobileCardHeader
                        title={stat?.title || ''}
                        separatorWidth="15%"
                    />
                </div>

                {/* Body Text */}
                <div className="relative w-full">
                    {Icon && (
                        <BackgroundDecor
                            position={{ top: '-20px', right: '-10px' }}
                            size="140px"
                            parallaxSpeed={0.10}
                            className="opacity-[0.06] pointer-events-none"
                        >
                            <Icon size={140} strokeWidth={1} />
                        </BackgroundDecor>
                    )}
                    <p className="font-[var(--font-body)] text-[var(--font-mobile-p)] text-[var(--creative-text-secondary)] font-medium leading-relaxed mb-4 text-left relative z-10">
                        {stat?.description}
                    </p>
                </div>

                {/* Highlights */}
                {stat?.highlights && (
                    <div className="w-full">
                        <Highlights
                            items={stat.highlights}
                            mono
                            className="w-full gap-[var(--space-sm)] flex flex-col items-start"
                            itemClassName="!text-[var(--font-size-body-xs)] !leading-snug w-full text-left"
                        />
                    </div>
                )}
            </div>

            {/* Illustration Zone - Full width, natural flow after content */}
            <div className="w-full h-[300px] relative mt-4 bg-[var(--creative-bg-secondary)] border-t border-[rgba(201,169,97,0.1)]">
                <div className={`w-full h-full flex relative px-8 ${index === 1 ? 'items-center' : 'items-end'}`}>
                    {index === 0 && <MobileChipStack />}
                    {index === 1 && <AIBrainIllustration />}
                    {index === 2 && (
                        <div className="absolute bottom-[-15%] left-8 w-[300%] h-[180%] flex items-start justify-start pointer-events-none">
                            <GlobeVisualization />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
