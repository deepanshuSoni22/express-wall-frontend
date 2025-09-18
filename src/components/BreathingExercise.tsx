import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useScrollReset } from '@/hooks/useScrollReset';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';

interface BreathingPattern {
  inhale: number;
  hold: number;
  exhale: number;
}

interface Technique {
  id: string;
  title: string;
  gradient: string;
  pattern: BreathingPattern;
}

interface BreathingExerciseProps {
  technique: Technique;
  onContinue: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'ready';

// Phase configuration data
const phaseTexts: Record<Phase, string> = {
  ready: 'Ready to begin?',
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
};

const phaseColors: Record<Phase, string> = {
  ready: 'bg-gradient-calm',
  inhale: 'bg-gradient-secondary',
  hold: 'bg-gradient-breathe-out',
  exhale: 'bg-gradient-breathe-in',
};

export const BreathingExercise = ({ technique, onContinue }: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('ready');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [phaseDuration, setPhaseDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Use our custom speech synthesis hook
  const {
    isVoiceOn,
    toggleVoice,
    speak,
    pauseSpeech,
    resumeSpeech,
    cancelSpeech,
    warmUpVoice
  } = useSpeechSynthesis();
  
  // Refs for animation timing
  const phaseStartRef = useRef<number>(0);
  const cycleStartRef = useRef<number>(0);
  const elapsedPhaseRef = useRef(0);
  const elapsedCycleRef = useRef(0);
  
  // Reset scroll position
  useScrollReset();

  const pattern = technique.pattern;
  const cycleTotal = pattern.inhale + pattern.hold + pattern.exhale;

  // Animation frame callback
  const animationCallback = (time: number) => {
    const elapsedPhase = (time - phaseStartRef.current) / 1000;
    const remaining = Math.max(0, phaseDuration - elapsedPhase);

    setTimeLeft(Math.ceil(remaining));

    // Calculate cycle progress
    let baseOffset = 0;
    if (currentPhase === 'hold') baseOffset = pattern.inhale;
    if (currentPhase === 'exhale') baseOffset = pattern.inhale + pattern.hold;
    
    const cycleElapsed = Math.min(cycleTotal, baseOffset + Math.min(elapsedPhase, phaseDuration));
    setProgress(cycleElapsed / cycleTotal);

    // Store elapsed time for pause/resume
    elapsedPhaseRef.current = Math.min(elapsedPhase, phaseDuration);
    elapsedCycleRef.current = cycleElapsed;

    if (remaining <= 0.0001) {
      nextPhase(currentPhase);
    }
  };

  // Use our custom animation frame hook
  const { start, stop } = useAnimationFrame(animationCallback, isActive && currentPhase !== 'ready');

  // Progress to the next breathing phase
  const nextPhase = (from: Phase) => {
    const now = performance.now();
    
    if (from === 'inhale') {
      if (pattern.hold > 0) {
        speak('Hold');
        setCurrentPhase('hold');
        setPhaseDuration(pattern.hold);
        setTimeLeft(pattern.hold);
        phaseStartRef.current = now;
        return;
      }
      // Skip hold phase if duration is 0
      speak('Breathe out');
      setCurrentPhase('exhale');
      setPhaseDuration(pattern.exhale);
      setTimeLeft(pattern.exhale);
      phaseStartRef.current = now;
      return;
    }
    
    if (from === 'hold') {
      speak('Breathe out');
      setCurrentPhase('exhale');
      setPhaseDuration(pattern.exhale);
      setTimeLeft(pattern.exhale);
      phaseStartRef.current = now;
      return;
    }
    
    if (from === 'exhale') {
      speak('Breathe in');
      setCycleCount((c) => c + 1);
      setCurrentPhase('inhale');
      setPhaseDuration(pattern.inhale);
      setTimeLeft(pattern.inhale);
      phaseStartRef.current = now;
      return;
    }
  };

  // Start the breathing exercise
  const startExercise = () => {
    warmUpVoice();

    const now = performance.now();
    setIsActive(true);
    speak('Breathe in');

    setCurrentPhase('inhale');
    setPhaseDuration(pattern.inhale);
    setTimeLeft(pattern.inhale);
    setCycleCount(0);
    
    phaseStartRef.current = now;
    cycleStartRef.current = now;
    elapsedPhaseRef.current = 0;
    elapsedCycleRef.current = 0;
  };

  // Pause or resume the exercise
  const togglePause = () => {
    if (currentPhase === 'ready') return;
    
    if (isActive) {
      setIsActive(false);
      stop();
      pauseSpeech();
    } else {
      const now = performance.now();
      phaseStartRef.current = now - elapsedPhaseRef.current * 1000;
      setIsActive(true);
      start();
      resumeSpeech();
    }
  };

  // Reset the exercise
  const resetExercise = () => {
    setIsActive(false);
    stop();
    setCurrentPhase('ready');
    setTimeLeft(0);
    setCycleCount(0);
    setProgress(0);
    setPhaseDuration(0);
    cancelSpeech();
  };

  // Calculate visual dynamics
  const scaleTarget = currentPhase === 'exhale' ? 1.0 : currentPhase === 'ready' ? 1.0 : 1.25;
  const transitionDuration = currentPhase === 'hold' ? 0 : phaseDuration;
  const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const glow = 0.25 + (scaleTarget - 1) * 0.9;
  const progressDeg = Math.max(0, Math.min(360, Math.round(progress * 360)));

  return (
    <div className={`page-shell ${technique.gradient} p-6 flex flex-col transition-all duration-700 min-h-full-viewport`}> 
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col text-center">
        <div className="mb-10">
          <h2 className="header-title text-primary-foreground mb-3">{technique.title}</h2>
          <p className="header-subtitle text-primary-foreground/90">
            Inhale {pattern.inhale}s • Hold {pattern.hold}s • Exhale {pattern.exhale}s
          </p>
          <div className="mt-4 flex items-center justify-center">
            <button
              type="button"
              onClick={toggleVoice}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium border border-primary-foreground/30 text-primary-foreground/90 hover:bg-primary-foreground/10 transition"
              title="Toggle voice guide"
              aria-pressed={isVoiceOn}
            >
              {isVoiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Voice guide {isVoiceOn ? 'on' : 'off'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center mb-12">
          <div className="relative" style={{ width: 300, height: 300 }}>
            {/* Ambient soft glow */}
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(60% 60% at 50% 50%, rgba(255,210,195,0.9), rgba(210,190,255,0.25))',
                opacity: glow,
                transition: `opacity ${Math.max(0.2, transitionDuration)}s ${easing}`,
              }}
            />
            <div 
              className="absolute inset-0 rounded-full" 
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${progressDeg}deg, rgba(255,255,255,0.25) ${progressDeg}deg)`,
                padding: 8,
                filter: 'drop-shadow(0 2px 14px rgba(0,0,0,0.08))',
              }}
            >
              <div className="w-full h-full bg-white/95 rounded-full" />
            </div>
            <div 
              className="absolute inset-[14px] rounded-full flex items-center justify-center"
              style={{
                transform: `scale(${scaleTarget})`,
                transition: `transform ${Math.max(0.2, transitionDuration)}s ${easing}`,
                boxShadow: `0 20px 40px rgba(0,0,0,0.08), 0 0 80px rgba(255,180,160,${0.2 + (scaleTarget - 1) * 0.8})`,
                background: 'radial-gradient(65% 65% at 40% 40%, rgba(255,240,235,0.95), rgba(230,225,255,0.85))',
              }}
            >
              <div className={`px-8 py-5 rounded-full ${phaseColors[currentPhase]} bg-opacity-60`}>                
                <div className="text-4xl font-bold text-primary-foreground mb-1 leading-none">
                  {timeLeft > 0 && isActive ? timeLeft : ''}
                </div>
                <div className="text-primary-foreground/90 font-medium tracking-wide uppercase text-sm">
                  {phaseTexts[currentPhase]}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 mb-6">
          {(!isActive && currentPhase === 'ready') ? (
            <Button onClick={startExercise} className="wellness-button w-full text-base py-5">
              <Play className="w-5 h-5 mr-2" />
              Start Breathing
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button 
                onClick={togglePause}
                variant="outline"
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 text-base py-5"
              >
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button 
                onClick={resetExercise}
                variant="outline"
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 text-base py-5"
              >
                Reset
              </Button>
            </div>
          )}
        </div>

        {cycleCount >= 1 && (
          <Button onClick={onContinue} className="wellness-button w-full text-base py-5">
            Continue to Balance
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};