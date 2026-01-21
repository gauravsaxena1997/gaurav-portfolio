'use client';

import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

interface UseTypedAnimationOptions {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  loop?: boolean;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function useTypedAnimation(options: UseTypedAnimationOptions) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const typedRef = useRef<Typed | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    typedRef.current = new Typed(elementRef.current, {
      strings: options.strings,
      typeSpeed: options.typeSpeed ?? 80,
      backSpeed: options.backSpeed ?? 40,
      loop: options.loop ?? true,
      showCursor: options.showCursor ?? true,
      onComplete: options.onComplete,
    });

    return () => {
      typedRef.current?.destroy();
    };
  }, [options.strings, options.typeSpeed, options.backSpeed, options.loop, options.showCursor, options.onComplete]);

  return elementRef;
}
