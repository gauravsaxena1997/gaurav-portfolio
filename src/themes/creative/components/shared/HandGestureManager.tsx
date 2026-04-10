'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGestures, GestureType } from '@/themes/creative/context/GestureContext';
import { useScrollContext } from '../../context/ScrollContext';

/**
 * HandGestureManager: The core ML engine for hand tracking.
 * Runs in the background when gestures are enabled.
 * Uses MediaPipe HandLandmarker to track 21 points on the hand.
 */
export function HandGestureManager() {
  const { 
    isGesturesEnabled, 
    setIsTrackingActive, 
    setLastGesture, 
    setHandCoordinates
  } = useGestures();
  
  const { activeSection } = useScrollContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handLandmarkerRef = useRef<import('@mediapipe/tasks-vision').HandLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Initialize MediaPipe Hand Landmarker
  useEffect(() => {
    if (!isGesturesEnabled) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const initLandmarker = async () => {
      try {
        // Dynamically import only on the client
        const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
        
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        
        handLandmarkerRef.current = landmarker;
        startCamera();
      } catch {
        // Suppressed console error for production
      }
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, frameRate: 30 } 
        });
        
        if (!videoRef.current) {
          const video = document.createElement('video');
          video.style.display = 'none';
          video.width = 640;
          video.height = 480;
          document.body.appendChild(video);
          videoRef.current = video;
        }
        
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraReady(true);
      } catch {
        // Suppressed camera error for production
      }
    };

    initLandmarker();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(t => t.stop());
      }
    };
  }, [isGesturesEnabled]);

  // SMART FOCUS: Only run detection if we are in an interactive section
  const isCurrentlyInInteractiveSection = ['hero', 'stats'].includes(activeSection);

  // Detection Loop
  const detectGestures = useCallback(() => {
    if (!handLandmarkerRef.current || !videoRef.current || !isCameraReady || !isCurrentlyInInteractiveSection) {
      requestRef.current = requestAnimationFrame(detectGestures);
      return;
    }

    const startTimeMs = performance.now();
    
    // SAFEGUARD: Ensure video has valid dimensions before processing
    // MediaPipe will throw "ROI width/height must be > 0" if dimensions are 0
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      requestRef.current = requestAnimationFrame(detectGestures);
      return;
    }

    const results = handLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

    if (results.landmarks.length > 0) {
      setIsTrackingActive(true);
      const landmarks = results.landmarks[0];
      
      // 1. Map Coordinates (Normalized 0-1)
      // Mirror X coordinates for natural feeling orientation
      const x = 1 - landmarks[0].x; 
      const y = landmarks[0].y;
      const z = landmarks[0].z;
      
      setHandCoordinates({ x, y, z });

      // 2. Gesture Logic (Manual implementation since we want custom gestures)
      // Pinch: Thumb Tip (4) and Index Tip (8)
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      
      const pinchDistance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
      const isPinch = pinchDistance < 0.05;

      // Index Point: Index finger is up, others are down
      const isIndexUp = indexTip.y < landmarks[6].y;
      const isMiddleDown = middleTip.y > landmarks[10].y;
      
      // Palm: Distance between wrist and middle tip is large
      const palmDistance = Math.hypot(landmarks[0].x - landmarks[12].x, landmarks[0].y - landmarks[12].y);
      const isPalm = palmDistance > 0.4;

      let gesture: GestureType = 'None';
      if (isPinch) gesture = 'Pinch';
      else if (isIndexUp && isMiddleDown) gesture = 'Point';
      else if (isPalm) gesture = 'Palm';

      setLastGesture(gesture);
    } else {
      setIsTrackingActive(false);
      setLastGesture('None');
      setHandCoordinates(null);
    }

    requestRef.current = requestAnimationFrame(detectGestures);
  }, [isCameraReady, setIsTrackingActive, setHandCoordinates, setLastGesture, isCurrentlyInInteractiveSection]);

  useEffect(() => {
    if (isCameraReady && isGesturesEnabled) {
      detectGestures();
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isCameraReady, isGesturesEnabled, detectGestures]);

  return null; // Headless component
}
