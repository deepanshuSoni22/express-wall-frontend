import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onComplete: () => void;
  holdTime?: number; // time in ms to complete
  children: React.ReactNode;
  className?: string;
  progressClassName?: string;
  vibrate?: boolean; // enable vibration feedback
}

export function HoldButton({
  onComplete,
  holdTime = 1500,
  children,
  className,
  progressClassName,
  disabled,
  vibrate = true,
  ...props
}: HoldButtonProps) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const vibrateIntervalRef = useRef<number | null>(null);
  
  // Check if vibration is supported
  const hasVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrateFeedback = (pattern: number | number[]) => {
    if (hasVibration && vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const resetState = () => {
    setHolding(false);
    setProgress(0);
    
    // Clear all timers and animation frames
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    if (vibrateIntervalRef.current) {
      clearInterval(vibrateIntervalRef.current);
      vibrateIntervalRef.current = null;
    }
    
    // Stop any ongoing vibration
    if (hasVibration && vibrate) {
      navigator.vibrate(0);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return resetState;
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Initial vibration feedback
    vibrateFeedback(15);
    
    startTimeRef.current = performance.now();
    setHolding(true);
    
    // Set timeout for completion
    timerRef.current = window.setTimeout(() => {
      setProgress(100);
      
      // Success vibration pattern
      vibrateFeedback([30, 50, 80]);
      
      // Wait a moment for animation to complete visual feedback
      window.setTimeout(() => {
        resetState();
        onComplete();
      }, 150);
    }, holdTime);
    
    // Periodic subtle vibration feedback during hold
    if (hasVibration && vibrate) {
      vibrateIntervalRef.current = window.setInterval(() => {
        // Only vibrate if still holding
        if (holding) {
          navigator.vibrate(8);
        }
      }, 300);
    }
    
    // Animate progress
    const updateProgress = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const newProgress = Math.min(100, (elapsed / holdTime) * 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    };
    
    rafRef.current = requestAnimationFrame(updateProgress);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!holding) return;
    resetState();
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!holding) return;
    resetState();
  };

  return (
    <Button
      className={cn(
        "wellness-button w-full text-base py-5 relative overflow-hidden",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerUp}
      disabled={disabled}
      {...props}
    >
      <span className={cn("relative z-10", holding && "opacity-90")}>{children}</span>
      
      {/* Progress bar overlay */}
      <span
        className={cn(
          "absolute left-0 top-0 bottom-0 bg-primary-foreground/20 transition-transform",
          progressClassName
        )}
        style={{
          width: '100%',
          transform: `translateX(${progress - 100}%)`,
          transitionDuration: holding ? '50ms' : '300ms'
        }}
      />
    </Button>
  );
}