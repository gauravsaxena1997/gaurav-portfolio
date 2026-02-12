'use client';

import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

export function useCreativeTheme() {
    // Initialize theme from localStorage with lazy initialization (prevents hydration mismatch)
    const [theme, setTheme] = useState<ThemeMode>(() => {
        if (typeof window === 'undefined') return 'light';

        // Check localStorage first
        const saved = localStorage.getItem('creative-theme');
        if (saved === 'light' || saved === 'dark') return saved;

        // Default to light mode if no preference saved
        return 'light';
    });

    // Apply theme to document root for global access (e.g., portaled modals)
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        // Also update localStorage in case it wasn't set (e.g. first visit default)
        localStorage.setItem('creative-theme', theme);
    }, [theme]);

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    return {
        theme,
        toggleTheme,
        setTheme
    };
}
