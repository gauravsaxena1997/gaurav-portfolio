/** Tailwind config aligned to existing theme tokens (light/dark via CSS vars).
 * Desktop migration pilot: utilities can map to these tokens without changing UI.
 */
const colorsWithVar = (name) => ({
  DEFAULT: `rgb(var(${name}) / <alpha-value>)`,
});

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: colorsWithVar('--creative-accent-rgb'),
        ink: '#1A1816',
        paper: '#F5F4F0',
        contrast: '#ffffff',
      },
      fontFamily: {
        display: 'var(--font-display)',
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        sm: 'var(--radius-sm, 6px)',
        md: 'var(--radius-md, 10px)',
        lg: 'var(--radius-lg, 12px)',
      },
      spacing: {
        'section-x': 'var(--section-padding-x, 1.5rem)',
        'section-y': 'var(--section-padding-y, 3rem)',
      },
      boxShadow: {
        accent: '0 4px 12px rgba(201, 169, 97, 0.3)',
      },
    },
  },
  plugins: [],
};
