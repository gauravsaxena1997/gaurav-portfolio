'use client';

import React from 'react';

export const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0E0D]">
            <div className="text-[#E6E6E6] text-sm tracking-widest uppercase">
                Loading...
            </div>
        </div>
    );
};
