'use client';

import styles from './DevelopmentIllustration.module.css';

export function DevelopmentIllustration() {
    return (
        <svg
            viewBox="0 0 334 216"
            className={styles.container}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Full Bleed Code Editor Background */}
            <rect width="334" height="216" fill="#1e1e2e" />

            {/* Line Numbers Decoration */}
            <rect x="0" y="0" width="40" height="216" fill="#181825" />

            <g fill="#45475a" fontSize="10" fontFamily="monospace" textAnchor="end">
                <text x="30" y="30">1</text>
                <text x="30" y="50">2</text>
                <text x="30" y="70">3</text>
                <text x="30" y="90">4</text>
                <text x="30" y="110">5</text>
                <text x="30" y="130">6</text>
                <text x="30" y="150">7</text>
                <text x="30" y="170">8</text>
                <text x="30" y="190">9</text>
            </g>

            {/* Code Content - Syntax Highlighted Skeletons */}
            <g transform="translate(50, 26)">
                {/* Function Definition */}
                <text x="0" y="0" fill="#cba6f7" fontSize="12" fontFamily="monospace" fontWeight="bold">function</text>
                <text x="60" y="0" fill="#89b4fa" fontSize="12" fontFamily="monospace">EnterprisePortal()</text>
                <text x="190" y="0" fill="#cdd6f4" fontSize="12" fontFamily="monospace">{`{`}</text>

                {/* Variable 1 */}
                <text x="20" y="25" fill="#f38ba8" fontSize="12" fontFamily="monospace">const</text>
                <text x="60" y="25" fill="#f9e2af" fontSize="12" fontFamily="monospace">data</text>
                <text x="95" y="25" fill="#cdd6f4" fontSize="12" fontFamily="monospace">=</text>
                <text x="110" y="25" fill="#a6e3a1" fontSize="12" fontFamily="monospace">useSecureQuery();</text>

                {/* Variable 2 */}
                <text x="20" y="50" fill="#f38ba8" fontSize="12" fontFamily="monospace">const</text>
                <text x="60" y="50" fill="#f9e2af" fontSize="12" fontFamily="monospace">user</text>
                <text x="95" y="50" fill="#cdd6f4" fontSize="12" fontFamily="monospace">=</text>
                <text x="110" y="50" fill="#a6e3a1" fontSize="12" fontFamily="monospace">useAuth();</text>

                {/* Return Statement */}
                <text x="20" y="80" fill="#cba6f7" fontSize="12" fontFamily="monospace">return</text>
                <text x="70" y="80" fill="#cdd6f4" fontSize="12" fontFamily="monospace">(</text>

                {/* JSX Structure */}
                <g transform="translate(40, 100)">
                    <text x="0" y="0" fill="#89b4fa" fontSize="12" fontFamily="monospace">{`<DashboardLayout>`}</text>
                    <text x="20" y="20" fill="#89b4fa" fontSize="12" fontFamily="monospace">{`<AnalyticsChart`}</text>
                    <text x="40" y="40" fill="#fab387" fontSize="12" fontFamily="monospace">data={'{'}data{'}'}</text>
                    <text x="20" y="60" fill="#89b4fa" fontSize="12" fontFamily="monospace">{`/>`}</text>
                    <text x="0" y="80" fill="#89b4fa" fontSize="12" fontFamily="monospace">{`</DashboardLayout>`}</text>
                </g>

                <text x="20" y="190" fill="#cdd6f4" fontSize="12" fontFamily="monospace">);</text>
            </g>
            <text x="50" y="210" fill="#cdd6f4" fontSize="12" fontFamily="monospace">{'}'}</text>

            {/* Cursor Animation */}
            <rect x="230" y="105" width="8" height="14" fill="#cdd6f4">
                <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
            </rect>
        </svg>
    );
}
