'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  alt?: string;
}

export function ImageViewer({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  alt = 'Image',
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
      if (e.key === 'ArrowRight') setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0));
    },
    [isOpen, onClose, images.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button style={styles.closeButton} onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        {/* Navigation - Previous */}
        {images.length > 1 && (
          <button
            style={{ ...styles.navButton, left: 16 }}
            onClick={() => setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Image */}
        <div style={styles.imageContainer}>
          <Image
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            fill
            style={{ objectFit: 'contain' }}
            quality={100}
            sizes="100vw"
            priority
          />
        </div>

        {/* Navigation - Next */}
        {images.length > 1 && (
          <button
            style={{ ...styles.navButton, right: 16 }}
            onClick={() => setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div style={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}

// Thumbnail component to trigger the viewer
interface ImageThumbnailProps {
  src: string;
  alt: string;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ImageThumbnail({ src, alt, onClick, className, style }: ImageThumbnailProps) {
  return (
    <div
      style={{ position: 'relative', cursor: 'pointer', ...style }}
      className={className}
      onClick={onClick}
    >
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} quality={100} sizes="(max-width: 600px) 100vw, 50vw" />
      <div style={styles.zoomOverlay}>
        <ZoomIn size={24} color="white" />
      </div>
    </div>
  );
}

// Inline styles for theme-agnostic design
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: 8,
    padding: 8,
    cursor: 'pointer',
    color: 'white',
    zIndex: 10,
    transition: 'background 0.2s',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: 8,
    padding: 8,
    cursor: 'pointer',
    color: 'white',
    zIndex: 10,
    transition: 'background 0.2s',
  },
  imageContainer: {
    position: 'relative',
    width: '90vw',
    height: '90vh',
    maxWidth: 1400,
  },
  counter: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '4px 12px',
    borderRadius: 16,
  },
  zoomOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0)',
    transition: 'background 0.2s',
    opacity: 0,
  },
};
