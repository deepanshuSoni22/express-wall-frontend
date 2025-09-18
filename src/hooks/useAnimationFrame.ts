import { useRef, useEffect } from 'react';

type FrameCallback = (time: number, deltaTime: number) => void;

/**
 * Custom hook for handling requestAnimationFrame with cleanup
 * 
 * @param callback Function to call on each animation frame
 * @param active Whether the animation should be running
 * @returns Object with methods to control the animation
 */
export function useAnimationFrame(callback: FrameCallback, active = true) {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const callbackRef = useRef<FrameCallback>(callback);
  const activeRef = useRef(active);
  
  // Update refs when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Main animation loop
  const animate = (time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
    }
    
    const deltaTime = time - previousTimeRef.current;
    previousTimeRef.current = time;
    
    if (activeRef.current) {
      callbackRef.current(time, deltaTime);
    }
    
    // Continue the loop
    requestRef.current = requestAnimationFrame(animate);
  };

  // Start animation
  const start = () => {
    if (requestRef.current === null) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  // Stop animation
  const stop = () => {
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
      previousTimeRef.current = null;
    }
  };

  // Reset without stopping
  const reset = () => {
    previousTimeRef.current = null;
  };

  // Setup and cleanup
  useEffect(() => {
    if (active) {
      start();
    }
    
    return stop;
  }, [active]);

  return { start, stop, reset };
}