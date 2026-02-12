'use client';

import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';

interface MobileHeightContextType {
    safeHeight: number;
    headerHeight: number;
    isSmallScreen: boolean; // < 668px height (iPhone SE)
    isTallScreen: boolean;  // > 850px height
}

const MobileHeightContext = createContext<MobileHeightContextType>({
    safeHeight: 0,
    headerHeight: 56,
    isSmallScreen: false,
    isTallScreen: false,
});

export const useMobileHeight = () => useContext(MobileHeightContext);

export const MobileHeightProvider = ({ children }: { children: React.ReactNode }) => {
    const [dimensions, setDimensions] = useState({
        safeHeight: 0,
        headerHeight: 56, // Default header height
        isSmallScreen: false,
        isTallScreen: false,
    });

    useLayoutEffect(() => {
        const updateHeight = () => {
            // Get actual visual viewport height (handles Safari address bar better than window.innerHeight in some cases)
            const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;

            // Get computed header height if possible, else fallback
            const header = document.querySelector('header');
            const headerH = header ? header.offsetHeight : 56;

            const safeH = vh - headerH;

            // Set CSS variable for CSS-only usage
            document.documentElement.style.setProperty('--mobile-safe-height', `${safeH}px`);
            document.documentElement.style.setProperty('--mobile-header-height', `${headerH}px`);
            document.documentElement.style.setProperty('--mobile-100vh', `${vh}px`);


            setDimensions({
                safeHeight: safeH,
                headerHeight: headerH,
                isSmallScreen: vh < 668,
                isTallScreen: vh > 850,
            });
        };

        updateHeight();

        window.addEventListener('resize', updateHeight);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateHeight);
        }

        return () => {
            window.removeEventListener('resize', updateHeight);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateHeight);
            }
        };
    }, []);

    return (
        <MobileHeightContext.Provider value={dimensions}>
            {children}
        </MobileHeightContext.Provider>
    );
};
