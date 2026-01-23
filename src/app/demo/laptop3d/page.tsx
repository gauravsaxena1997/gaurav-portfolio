'use client';
import { useState } from 'react';
import { LaptopScene } from '@/components/demos/laptop3d/LaptopScene';
import {
  WebsiteScreen,
  VideoScreen,
  CustomScreen,
  ScrollableScreen,
} from '@/components/demos/laptop3d/screens';

type VariationType = 'none' | 'website' | 'video' | 'custom' | 'scrollable';

const variations: { id: VariationType; label: string; description: string }[] = [
  { id: 'none', label: 'Default', description: 'Original demo - no screen content' },
  { id: 'website', label: 'Website', description: 'YouTube channel embed (scrollable iframe)' },
  { id: 'video', label: 'Video', description: 'YouTube video player on screen' },
  { id: 'custom', label: 'Interactive', description: 'React UI with working buttons & state' },
  { id: 'scrollable', label: 'Scroll', description: 'Scrollable content inside laptop screen' },
];

export default function Laptop3DDemo() {
  const [activeVariation, setActiveVariation] = useState<VariationType>('none');
  const [magneticEffect, setMagneticEffect] = useState(true);

  const getScreenContent = () => {
    switch (activeVariation) {
      case 'website':
        return <WebsiteScreen />;
      case 'video':
        return <VideoScreen />;
      case 'custom':
        return <CustomScreen />;
      case 'scrollable':
        return <ScrollableScreen />;
      default:
        return undefined;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Variation Tabs */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          gap: '4px',
          background: 'rgba(0,0,0,0.6)',
          padding: '6px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
        }}
      >
        {variations.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveVariation(v.id)}
            title={v.description}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeVariation === v.id ? 'white' : 'transparent',
              color: activeVariation === v.id ? '#1a1a1a' : 'white',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Info Panel */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 100,
          background: 'rgba(0,0,0,0.6)',
          padding: '14px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          color: 'white',
          maxWidth: '280px',
        }}
      >
        <h3 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>
          {variations.find((v) => v.id === activeVariation)?.label}
        </h3>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.8, lineHeight: 1.4 }}>
          {variations.find((v) => v.id === activeVariation)?.description}
        </p>
        <div
          style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            fontSize: '11px',
            opacity: 0.6,
          }}
        >
          <div>Click laptop to open/close</div>
          <div>Move mouse for magnetic effect</div>
          {activeVariation !== 'none' && (
            <div>Interact with screen content</div>
          )}
        </div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={magneticEffect}
            onChange={(e) => setMagneticEffect(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          Magnetic effect
        </label>
      </div>

      {/* 3D Scene */}
      <LaptopScene
        screenContent={getScreenContent()}
        showClickText={activeVariation === 'none'}
        enableMagneticEffect={magneticEffect}
      />
    </div>
  );
}
