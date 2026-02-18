'use client';

export function useCreativeTheme() {
    // Creative theme is dark-only; no toggle needed
    const theme = 'dark';

    return {
        theme,
    };
}
