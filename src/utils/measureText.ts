/**
 * Utility for measuring text dimensions using Canvas API
 */

interface TextMeasurementOptions {
  font?: string;
  letterSpacing?: number;
  padding?: number;
  minWidth?: number;
  maxWidth?: number;
}

const DEFAULT_OPTIONS: Required<TextMeasurementOptions> = {
  font: 'bold 18px var(--font-display, sans-serif)',
  letterSpacing: 1.2, // Per character - increased for accurate spacing
  padding: 90, // 45px each side - INCREASED from 70 for better spacing
  minWidth: 160,
  maxWidth: 550,  // INCREASED from 500 to prevent clipping on longer text
};

// Canvas context cache to avoid recreating
let cachedCanvas: HTMLCanvasElement | null = null;
let cachedContext: CanvasRenderingContext2D | null = null;

function getCanvasContext(): CanvasRenderingContext2D {
  if (!cachedCanvas) {
    cachedCanvas = document.createElement('canvas');
    cachedContext = cachedCanvas.getContext('2d');
  }
  return cachedContext!;
}

/**
 * Measures the width required for a text string with custom font and spacing
 */
export function measureChipWidth(
  text: string,
  options: TextMeasurementOptions = {}
): number {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const context = getCanvasContext();

  // Set font for measurement
  context.font = opts.font;

  // Measure text width
  const textWidth = context.measureText(text).width;

  // Add letter spacing
  const totalLetterSpacing = text.length * opts.letterSpacing;

  // Add 15% safety margin for bold font rendering
  const safetyMargin = textWidth * 0.15;

  // Calculate total width with safety margin
  const width = Math.ceil(
    textWidth + totalLetterSpacing + opts.padding + safetyMargin
  );

  // Increase by 10% for larger chips
  const scaledWidth = Math.ceil(width * 1.1);

  // Clamp between min/max
  return Math.max(opts.minWidth, Math.min(opts.maxWidth, scaledWidth));
}

/**
 * Get responsive width based on viewport size
 * Note: Keeping static width as requested by user
 */
export function getResponsiveWidth(baseWidth: number): number {
  // Keep width static - no scaling
  return baseWidth;
}

/**
 * Batch measure multiple chip texts
 */
export function measureChips(
  texts: string[],
  options?: TextMeasurementOptions
): number[] {
  return texts.map((text) => measureChipWidth(text, options));
}

/**
 * Clear canvas cache (useful for cleanup)
 */
export function clearMeasurementCache(): void {
  cachedCanvas = null;
  cachedContext = null;
}
