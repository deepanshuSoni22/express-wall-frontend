import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, ArrowRight, Volume2, VolumeX } from 'lucide-react';

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

export const BreathingExercise = ({ technique, onContinue }: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('ready');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [phaseDuration, setPhaseDuration] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 within a full cycle
  const [voiceOn, setVoiceOn] = useState(true);
  const voiceReadyRef = useRef(false);

  // Timing refs for smooth RAF engine
  const rafIdRef = useRef<number | null>(null);
  const phaseStartRef = useRef<number>(0);
  const cycleStartRef = useRef<number>(0);
  const elapsedPhaseRef = useRef(0);
  const elapsedCycleRef = useRef(0);

  // SpeechSynthesis voice management
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const pickVoice = () => {
    if (!speechSupported) return null;
    const preferred = [
      'Google UK English Female',
      'Google US English',
      'Microsoft Aria Online (Natural) - English (United States)',
      'en-US'
    ];
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;
    for (const name of preferred) {
      const v = voices.find((vv) => vv.name === name || vv.lang === name);
      if (v) return v;
    }
    return voices.find(v => v.lang.startsWith('en')) ?? voices[0] ?? null;
  };

  const warmUpAndLoadVoices = () => {
    if (!speechSupported || voiceReadyRef.current) return;
    
    // This blank utterance is a common trick to "wake up" the speech engine on iOS
    const u = new SpeechSynthesisUtterance('');
    window.speechSynthesis.speak(u);

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voiceRef.current = pickVoice();
      voiceReadyRef.current = true;
    }
  };

  useEffect(() => {
    if (!speechSupported) return;
    const init = () => {
      // On mobile, this might be an empty array initially
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voiceRef.current = pickVoice();
        voiceReadyRef.current = true;
      }
    };
    init();
    window.speechSynthesis.addEventListener?.('voiceschanged', init);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', init);
    };
  }, [speechSupported]);

  const speak = (text: string) => {
    if (!speechSupported || !voiceOn) return;
    
    // If voices aren't ready, try one last time.
    if (!voiceReadyRef.current) {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voiceRef.current = pickVoice();
        voiceReadyRef.current = true;
      }
    }

    // Cancel any ongoing utterance to avoid overlap
    try { window.speechSynthesis.cancel(); } catch {}
    const u = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) u.voice = voiceRef.current;
    u.lang = voiceRef.current?.lang || 'en-US';
    u.rate = 0.95;   // calm tempo
    u.pitch = 1.0;
    u.volume = 1.0;
    try {
      window.speechSynthesis.speak(u);
    } catch {
      // ignore synthesis errors
    }
  };

  const pattern = technique.pattern;
  const cycleTotal = pattern.inhale + pattern.hold + pattern.exhale;

  const phaseTexts: Record<Phase, string> = {
    ready: 'Ready to begin?',
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
  };

  const phaseColors: Record<Phase, string> = {
    ready: 'bg-gradient-calm',
    inhale: 'bg-gradient-breathe-in',
    hold: 'bg-gradient-secondary',
    exhale: 'bg-gradient-breathe-out',
  };

  // Begin the exercise
  const startExercise = () => {
    // This is the key: warm up the voices inside the user gesture (the button click)
    warmUpAndLoadVoices();

    const now = performance.now();
    setIsActive(true);
    
    // Voice cue
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

  const stopRAF = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
  };

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
      // Skip hold if 0
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

  const tick = () => {
    const now = performance.now();
    const elapsedPhase = (now - phaseStartRef.current) / 1000; // s
    const remaining = Math.max(0, phaseDuration - elapsedPhase);

    // Update displayed time (ceil for user-friendly countdown)
    setTimeLeft(Math.ceil(remaining));

    // Compute cycle progress based on phase offsets
    let baseOffset = 0;
    if (currentPhase === 'hold') baseOffset = pattern.inhale;
    if (currentPhase === 'exhale') baseOffset = pattern.inhale + pattern.hold;
    const cycleElapsed = Math.min(cycleTotal, baseOffset + Math.min(elapsedPhase, phaseDuration));
    setProgress(cycleElapsed / cycleTotal);

    // Save for pause/resume continuity
    elapsedPhaseRef.current = Math.min(elapsedPhase, phaseDuration);
    elapsedCycleRef.current = cycleElapsed;

    if (remaining <= 0.0001) {
      nextPhase(currentPhase);
    }

    rafIdRef.current = requestAnimationFrame(tick);
  };

  // Start/stop RAF engine in response to isActive and phase changes
  useEffect(() => {
    stopRAF();
    if (isActive && currentPhase !== 'ready') {
      rafIdRef.current = requestAnimationFrame(tick);
    }
    return stopRAF;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, currentPhase, phaseDuration, pattern.inhale, pattern.hold, pattern.exhale]);

  // Pause/resume handler keeps smooth timing and voice sync
  const togglePause = () => {
    if (currentPhase === 'ready') return;
    if (isActive) {
      setIsActive(false);
      stopRAF();
      try { window.speechSynthesis.pause(); } catch {}
    } else {
      const now = performance.now();
      phaseStartRef.current = now - elapsedPhaseRef.current * 1000;
      setIsActive(true);
      try { window.speechSynthesis.resume(); } catch {}
    }
  };

  const resetExercise = () => {
    setIsActive(false);
    stopRAF();
    setCurrentPhase('ready');
    setTimeLeft(0);
    setCycleCount(0);
    setProgress(0);
    setPhaseDuration(0);
    try { window.speechSynthesis.cancel(); } catch {}
  };

  useEffect(() => {
    return () => {
      try { window.speechSynthesis.cancel(); } catch {}
    };
  }, []);

  // Visual dynamics
  const scaleTarget = currentPhase === 'exhale' ? 1.0 : currentPhase === 'ready' ? 1.0 : 1.25;
  const transitionDuration = currentPhase === 'hold' ? 0 : phaseDuration; // hold stays still
  const easing = 'cubic-bezier(0.22, 1, 0.36, 1)'; // smooth modern ease
  const glow = 0.25 + (scaleTarget - 1) * 0.9; // glow intensity

  const progressDeg = Math.max(0, Math.min(360, Math.round(progress * 360)));

  return (
    <div className={`page-shell ${technique.gradient} p-6 flex flex-col transition-all duration-700`}> 
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col text-center">
        <div className="mb-10">
          <h2 className="header-title text-primary-foreground mb-3">{technique.title}</h2>
          <p className="header-subtitle text-primary-foreground/90">Inhale {pattern.inhale}s • Hold {pattern.hold}s • Exhale {pattern.exhale}s</p>
          <div className="mt-4 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setVoiceOn((v) => {
                  const next = !v;
                  if (!next) { try { window.speechSynthesis.cancel(); } catch {} }
                  return next;
                });
              }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium border border-primary-foreground/30 text-primary-foreground/90 hover:bg-primary-foreground/10 transition"
              title="Toggle voice guide"
              aria-pressed={voiceOn}
            >
              {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Voice guide {voiceOn ? 'on' : 'off'}
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
            <div className="absolute inset-0 rounded-full" style={{
              background: `conic-gradient(hsl(var(--primary)) ${progressDeg}deg, rgba(255,255,255,0.25) ${progressDeg}deg)`,
              padding: 8,
              filter: 'drop-shadow(0 2px 14px rgba(0,0,0,0.08))',
            }}>
              <div className="w-full h-full bg-white/95 rounded-full" />
            </div>
            <div className="absolute inset-[14px] rounded-full flex items-center justify-center"
                 style={{
                   transform: `scale(${scaleTarget})`,
                   transition: `transform ${Math.max(0.2, transitionDuration)}s ${easing}`,
                   boxShadow: `0 20px 40px rgba(0,0,0,0.08), 0 0 80px rgba(255,180,160,${0.2 + (scaleTarget - 1) * 0.8})`,
                   background: 'radial-gradient(65% 65% at 40% 40%, rgba(255,240,235,0.95), rgba(230,225,255,0.85))',
                 }}>
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