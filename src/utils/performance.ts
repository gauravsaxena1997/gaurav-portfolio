/**
 * Performance monitoring utilities for lazy-loaded components and scroll performance
 */

interface ComponentLoadMetric {
  componentName: string;
  loadTime: number;
  timestamp: number;
}

interface ScrollMetric {
  fps: number;
  frameTime: number;
  timestamp: number;
}

const componentLoadMetrics: ComponentLoadMetric[] = [];
const scrollMetrics: ScrollMetric[] = [];

/**
 * Measure component load time
 * @param componentName Name of the component
 * @param startTime Performance.now() timestamp when load started
 */
export function measureComponentLoad(componentName: string, startTime: number): void {
  const loadTime = performance.now() - startTime;
  const metric: ComponentLoadMetric = {
    componentName,
    loadTime,
    timestamp: Date.now(),
  };

  componentLoadMetrics.push(metric);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
  }
}

/**
 * Log lazy load metrics for all components
 */
export function logLazyLoadMetrics(): ComponentLoadMetric[] {
  if (process.env.NODE_ENV === 'development' && componentLoadMetrics.length > 0) {
    console.table(
      componentLoadMetrics.map(m => ({
        Component: m.componentName,
        'Load Time (ms)': m.loadTime.toFixed(2),
        Time: new Date(m.timestamp).toLocaleTimeString(),
      }))
    );
  }

  return componentLoadMetrics;
}

/**
 * Measure scroll performance (FPS)
 * Should be called in a scroll event handler or requestAnimationFrame
 */
export function measureScrollPerformance(): void {
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;

  const measureFrame = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;

    frameCount++;

    // Calculate FPS every 10 frames
    if (frameCount >= 10) {
      fps = Math.round((frameCount / deltaTime) * 1000);
      frameCount = 0;
      lastTime = currentTime;

      const metric: ScrollMetric = {
        fps,
        frameTime: deltaTime / 10,
        timestamp: Date.now(),
      };

      scrollMetrics.push(metric);

      // Keep only last 100 metrics
      if (scrollMetrics.length > 100) {
        scrollMetrics.shift();
      }

      if (process.env.NODE_ENV === 'development' && fps < 55) {
        console.warn(`[Performance] Low FPS detected: ${fps} FPS`);
      }
    }

    requestAnimationFrame(measureFrame);
  };

  requestAnimationFrame(measureFrame);
}

/**
 * Get average scroll FPS
 */
export function getAverageScrollFPS(): number {
  if (scrollMetrics.length === 0) return 60;

  const sum = scrollMetrics.reduce((acc, m) => acc + m.fps, 0);
  return Math.round(sum / scrollMetrics.length);
}

/**
 * Get performance summary
 */
export function getPerformanceSummary() {
  return {
    componentLoads: componentLoadMetrics,
    scrollMetrics: scrollMetrics,
    averageFPS: getAverageScrollFPS(),
    totalComponents: componentLoadMetrics.length,
    averageLoadTime: componentLoadMetrics.length > 0
      ? componentLoadMetrics.reduce((acc, m) => acc + m.loadTime, 0) / componentLoadMetrics.length
      : 0,
  };
}

/**
 * Clear all performance metrics
 */
export function clearPerformanceMetrics(): void {
  componentLoadMetrics.length = 0;
  scrollMetrics.length = 0;
}

/**
 * Mark performance milestone using Performance API
 */
export function markPerformance(name: string): void {
  if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
    window.performance.mark(name);
  }
}

/**
 * Measure performance between two marks
 */
export function measurePerformance(name: string, startMark: string, endMark: string): void {
  if (typeof window !== 'undefined' && window.performance && window.performance.measure) {
    try {
      window.performance.measure(name, startMark, endMark);

      if (process.env.NODE_ENV === 'development') {
        const entries = window.performance.getEntriesByName(name);
        if (entries.length > 0) {
          const measure = entries[entries.length - 1];
          console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
        }
      }
    } catch (error) {
      // Marks may not exist, silently fail
    }
  }
}
