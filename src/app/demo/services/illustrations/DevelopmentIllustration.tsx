'use client';

import { useEffect, useState } from 'react';
import styles from './DevelopmentIllustration.module.css';

const CODE_LINES = [
    { text: "function", color: "#C586C0", type: "keyword" },
    { text: " createMagic", color: "#DCDCAA", type: "function" },
    { text: "() {", color: "#D4D4D4", type: "syntax" },

    { text: "  ", color: "#D4D4D4", type: "indent" },
    { text: "const", color: "#569CD6", type: "keyword" },
    { text: " idea ", color: "#9CDCFE", type: "variable" },
    { text: "= transform();", color: "#D4D4D4", type: "syntax" },

    { text: "  ", color: "#D4D4D4", type: "indent" },
    { text: "const", color: "#569CD6", type: "keyword" },
    { text: " code ", color: "#9CDCFE", type: "variable" },
    { text: "= build(idea);", color: "#D4D4D4", type: "syntax" },

    { text: "  ", color: "#D4D4D4", type: "indent" },
    { text: "return", color: "#C586C0", type: "keyword" },
    { text: " ", color: "#D4D4D4", type: "space" },
    { text: "'Success'", color: "#CE9178", type: "string" },
    { text: ";", color: "#D4D4D4", type: "syntax" },

    { text: "}", color: "#D4D4D4", type: "syntax" },
];

export function DevelopmentIllustration() {
    const [visibleTokens, setVisibleTokens] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleTokens((prev) => {
                if (prev < CODE_LINES.length) return prev + 1;
                return prev;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <svg
            viewBox="0 0 334 216"
            className={styles.container}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Background */}
            <rect width="334" height="216" fill="#0a0a0a" />

            {/* Code Editor */}
            <g className={styles.codeEditor}>
                <rect x="10" y="10" width="314" height="196" fill="#1e1e1e" rx="4" />

                {/* Tab */}
                <rect x="20" y="20" width="60" height="18" fill="#95E1D340" rx="3" />
                <text x="50" y="32" className={styles.tabText} textAnchor="middle">App.tsx</text>

                {/* Line numbers */}
                <rect x="10" y="45" width="28" height="161" fill="#ffffff05" />
                <text x="24" y="70" className={styles.lineNumber} textAnchor="middle">1</text>
                <text x="24" y="92" className={styles.lineNumber} textAnchor="middle">2</text>
                <text x="24" y="114" className={styles.lineNumber} textAnchor="middle">3</text>
                <text x="24" y="136" className={styles.lineNumber} textAnchor="middle">4</text>
                <text x="24" y="158" className={styles.lineNumber} textAnchor="middle">5</text>

                {/* Code with proper syntax highlighting */}
                <g className={styles.code}>
                    {/* Line 1: function createMagic() { */}
                    <text x="48" y="70" className={styles.codeLine}>
                        {visibleTokens >= 1 && <tspan fill="#C586C0">function</tspan>}
                        {visibleTokens >= 2 && <tspan fill="#DCDCAA"> createMagic</tspan>}
                        {visibleTokens >= 3 && <tspan fill="#D4D4D4">{'() {'}</tspan>}
                    </text>

                    {/* Line 2: const idea = transform(); */}
                    <text x="48" y="92" className={styles.codeLine}>
                        {visibleTokens >= 4 && <tspan fill="#D4D4D4">  </tspan>}
                        {visibleTokens >= 5 && <tspan fill="#569CD6">const</tspan>}
                        {visibleTokens >= 6 && <tspan fill="#9CDCFE"> idea </tspan>}
                        {visibleTokens >= 7 && <tspan fill="#D4D4D4">= transform();</tspan>}
                    </text>

                    {/* Line 3: const code = build(idea); */}
                    <text x="48" y="114" className={styles.codeLine}>
                        {visibleTokens >= 8 && <tspan fill="#D4D4D4">  </tspan>}
                        {visibleTokens >= 9 && <tspan fill="#569CD6">const</tspan>}
                        {visibleTokens >= 10 && <tspan fill="#9CDCFE"> code </tspan>}
                        {visibleTokens >= 11 && <tspan fill="#D4D4D4">= build(idea);</tspan>}
                    </text>

                    {/* Line 4: return 'Success'; */}
                    <text x="48" y="136" className={styles.codeLine}>
                        {visibleTokens >= 12 && <tspan fill="#D4D4D4">  </tspan>}
                        {visibleTokens >= 13 && <tspan fill="#C586C0">return</tspan>}
                        {visibleTokens >= 14 && <tspan fill="#D4D4D4"> </tspan>}
                        {visibleTokens >= 15 && <tspan fill="#CE9178">'Success'</tspan>}
                        {visibleTokens >= 16 && <tspan fill="#D4D4D4">;</tspan>}
                    </text>

                    {/* Line 5: } */}
                    <text x="48" y="158" className={styles.codeLine}>
                        {visibleTokens >= 17 && <tspan fill="#D4D4D4">{'}'}</tspan>}
                    </text>
                </g>

                {/* Blinking cursor */}
                {visibleTokens < CODE_LINES.length && (
                    <rect
                        x="48"
                        y="58"
                        width="2"
                        height="14"
                        fill="#95E1D3"
                        className={styles.cursor}
                    />
                )}
            </g>
        </svg>
    );
}
