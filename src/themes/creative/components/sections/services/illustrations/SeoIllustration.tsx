'use client';

import { useEffect, useState } from 'react';
import styles from './SeoIllustration.module.css';

export function SeoIllustration() {
    const [score, setScore] = useState(0);

    useEffect(() => {
        // Faster animation - 15ms instead of 25ms
        const interval = setInterval(() => {
            setScore((prev) => {
                if (prev >= 95) return 95;
                return prev + 1;
            });
        }, 15);

        return () => clearInterval(interval);
    }, []);

    return (
        <svg
            viewBox="0 0 334 216"
            className={styles.container}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Background gradient */}
            <defs>
                <linearGradient id="seoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#AA96DA" />
                    <stop offset="100%" stopColor="#9561E2" />
                </linearGradient>
            </defs>

            {/* Gauge */}
            <g className={styles.gauge}>
                <circle cx="167" cy="75" r="38" fill="none" stroke="#ffffff20" strokeWidth="6" />
                <circle
                    cx="167"
                    cy="75"
                    r="38"
                    fill="none"
                    stroke="url(#seoGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - score / 100)}`}
                    transform="rotate(-90 167 75)"
                    className={styles.progressCircle}
                />
                <text x="167" y="78" className={styles.scoreNumber} textAnchor="middle" dominantBaseline="middle">
                    {score}
                </text>
            </g>

            {/* Metrics */}
            <g className={styles.metrics}>
                {/* Speed Index */}
                <g className={styles.metric1}>
                    <text x="30" y="135" className={styles.metricLabel}>
                        ⚡ Speed: {(score * 0.012).toFixed(1)}s
                    </text>
                    <rect x="30" y="140" width="135" height="8" fill="#ffffff15" rx="4" />
                    <rect x="30" y="140" width={score * 1.35} height="8" fill="url(#seoGradient)" rx="4" className={styles.bar1} />
                    <text x="172" y="147" className={styles.percentage}>{score}%</text>
                </g>

                {/* First Paint */}
                <g className={styles.metric2}>
                    <text x="30" y="165" className={styles.metricLabel}>
                        ⚡ Paint: {(score * 0.008).toFixed(1)}s
                    </text>
                    <rect x="30" y="170" width="135" height="8" fill="#ffffff15" rx="4" />
                    <rect x="30" y="170" width={score * 1.35} height="8" fill="url(#seoGradient)" rx="4" className={styles.bar2} />
                    <text x="172" y="177" className={styles.percentage}>{score}%</text>
                </g>

                {/* SEO Score */}
                <g className={styles.metric3}>
                    <text x="30" y="195" className={styles.metricLabel}>
                        🎯 SEO Score
                    </text>
                    <rect x="30" y="200" width="135" height="8" fill="#ffffff15" rx="4" />
                    <rect x="30" y="200" width={score * 1.35} height="8" fill="url(#seoGradient)" rx="4" className={styles.bar3} />
                    <text x="172" y="207" className={styles.percentage}>{score}%</text>
                </g>
            </g>

            {/* Chart */}
            <g className={styles.chart}>
                <text x="215" y="135" className={styles.chartTitle}>Traffic</text>
                <path
                    d="M 200 175 L 218 160 L 236 168 L 254 150 L 272 158 L 290 140"
                    fill="none"
                    stroke="url(#seoGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={styles.chartPath}
                />
                <text x="300" y="145" className={styles.trendText}>↗ +{score}%</text>
            </g>
        </svg>
    );
}
