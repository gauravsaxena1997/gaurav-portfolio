'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type GestureType = 'None' | 'Palm' | 'Point' | 'Pinch' | 'Victory' | 'ThumbUp';

interface HandCoordinates {
  x: number; // 0-1
  y: number; // 0-1
  z: number; // Raw depth
}

interface GestureContextValue {
  isGesturesEnabled: boolean;
  setIsGesturesEnabled: (enabled: boolean) => void;
  
  isTrackingActive: boolean;
  setIsTrackingActive: (active: boolean) => void;
  
  lastGesture: GestureType;
  setLastGesture: (gesture: GestureType) => void;
  
  handCoordinates: HandCoordinates | null;
  setHandCoordinates: (coords: HandCoordinates | null) => void;
  
  // For interaction: confidence of the gesture
  confidence: number;
  setConfidence: (conf: number) => void;
}

const GestureContext = createContext<GestureContextValue | undefined>(undefined);

export function GestureProvider({ children }: { children: ReactNode }) {
  const [isGesturesEnabled, setIsGesturesEnabled] = useState(false);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [lastGesture, setLastGesture] = useState<GestureType>('None');
  const [handCoordinates, setHandCoordinates] = useState<HandCoordinates | null>(null);
  const [confidence, setConfidence] = useState(0);

  return (
    <GestureContext.Provider
      value={{
        isGesturesEnabled,
        setIsGesturesEnabled,
        isTrackingActive,
        setIsTrackingActive,
        lastGesture,
        setLastGesture,
        handCoordinates,
        setHandCoordinates,
        confidence,
        setConfidence,
      }}
    >
      {children}
    </GestureContext.Provider>
  );
}

export function useGestures() {
  const context = useContext(GestureContext);
  if (context === undefined) {
    throw new Error('useGestures must be used within a GestureProvider');
  }
  return context;
}
