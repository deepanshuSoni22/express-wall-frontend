import { useState, useEffect, useRef } from 'react';

interface UseSpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  preferredVoices?: string[];
  onVoicesLoaded?: () => void;
}

/**
 * Custom hook for speech synthesis functionality
 * 
 * @param options Configuration options for speech synthesis
 * @returns Speech synthesis controls and state
 */
export function useSpeechSynthesis({
  rate = 0.95,
  pitch = 1.0,
  volume = 1.0,
  preferredVoices = [
    'Google UK English Female',
    'Google US English',
    'Microsoft Aria Online (Natural) - English (United States)',
    'en-US'
  ],
  onVoicesLoaded
}: UseSpeechSynthesisOptions = {}) {
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [isVoiceReady, setIsVoiceReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const voiceReadyRef = useRef(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Initialize voice capabilities
  useEffect(() => {
    if (!speechSupported) return;
    
    const initVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voiceRef.current = pickVoice(voices, preferredVoices);
        voiceReadyRef.current = true;
        setIsVoiceReady(true);
        onVoicesLoaded?.();
      }
    };
    
    initVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', initVoices);
    
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', initVoices);
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      cancelSpeech();
    };
  }, [speechSupported, preferredVoices, onVoicesLoaded]);

  /**
   * Select the most appropriate voice from available options
   */
  const pickVoice = (voices: SpeechSynthesisVoice[], preferred: string[]) => {
    if (!voices || voices.length === 0) return null;
    
    for (const name of preferred) {
      const v = voices.find((vv) => vv.name === name || vv.lang === name);
      if (v) return v;
    }
    
    return voices.find(v => v.lang.startsWith('en')) ?? voices[0] ?? null;
  };

  /**
   * Initialize voice synthesis engine with proper loading state - call within a user gesture (click)
   * Returns a promise that resolves when the voice is ready
   */
  const initializeVoice = (): Promise<void> => {
    if (!speechSupported) {
      setIsVoiceReady(true);
      return Promise.resolve();
    }
    
    if (voiceReadyRef.current && isVoiceReady) {
      return Promise.resolve();
    }

    setIsInitializing(true);

    return new Promise((resolve) => {
      // Wake up the speech engine with a blank utterance
      const u = new SpeechSynthesisUtterance('');
      u.onend = () => {
        // Check if voices are available after the wake-up call
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          voiceRef.current = pickVoice(voices, preferredVoices);
          voiceReadyRef.current = true;
          setIsVoiceReady(true);
          setIsInitializing(false);
          resolve();
        } else {
          // Fallback: wait a bit more for voices to load
          initTimeoutRef.current = setTimeout(() => {
            const retryVoices = window.speechSynthesis.getVoices();
            if (retryVoices.length > 0) {
              voiceRef.current = pickVoice(retryVoices, preferredVoices);
            }
            voiceReadyRef.current = true;
            setIsVoiceReady(true);
            setIsInitializing(false);
            resolve();
          }, 500);
        }
      };

      u.onerror = () => {
        // Even on error, mark as ready to not block the exercise
        voiceReadyRef.current = true;
        setIsVoiceReady(true);
        setIsInitializing(false);
        resolve();
      };

      window.speechSynthesis.speak(u);

      // Fallback timeout in case onend doesn't fire
      const fallbackTimeout = setTimeout(() => {
        if (!voiceReadyRef.current) {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            voiceRef.current = pickVoice(voices, preferredVoices);
          }
          voiceReadyRef.current = true;
          setIsVoiceReady(true);
          setIsInitializing(false);
          resolve();
        }
      }, 1500);

      // Clean up fallback if we resolve earlier
      const originalResolve = resolve;
      resolve = () => {
        clearTimeout(fallbackTimeout);
        originalResolve();
      };
    });
  };

  /**
   * Initialize voice synthesis engine - call within a user gesture (click)
   * @deprecated Use initializeVoice() instead for better async handling
   */
  const warmUpVoice = () => {
    initializeVoice();
  };

  /**
   * Speak text with the selected voice
   */
  const speak = (text: string) => {
    if (!speechSupported || !isVoiceOn) return;
    
    // Last attempt to initialize voices if not ready
    if (!voiceReadyRef.current) {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voiceRef.current = pickVoice(voices, preferredVoices);
        voiceReadyRef.current = true;
      }
    }

    try { 
      // Cancel any ongoing speech to avoid overlap
      window.speechSynthesis.cancel(); 
      
      const u = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) u.voice = voiceRef.current;
      u.lang = voiceRef.current?.lang || 'en-US';
      u.rate = rate;
      u.pitch = pitch;
      u.volume = volume;
      
      window.speechSynthesis.speak(u);
    } catch (error) {
      // Ignore synthesis errors
      console.debug('Speech synthesis error:', error);
    }
  };

  /**
   * Pause ongoing speech
   */
  const pauseSpeech = () => {
    if (!speechSupported) return;
    try { 
      window.speechSynthesis.pause(); 
    } catch {}
  };

  /**
   * Resume paused speech
   */
  const resumeSpeech = () => {
    if (!speechSupported) return;
    try { 
      window.speechSynthesis.resume(); 
    } catch {}
  };

  /**
   * Cancel ongoing speech
   */
  const cancelSpeech = () => {
    if (!speechSupported) return;
    try { 
      window.speechSynthesis.cancel(); 
    } catch {}
  };

  /**
   * Toggle voice on/off
   */
  const toggleVoice = () => {
    setIsVoiceOn(prev => {
      const next = !prev;
      if (!next) {
        cancelSpeech();
      }
      return next;
    });
  };

  return {
    isVoiceOn,
    isVoiceReady,
    isInitializing,
    setIsVoiceOn,
    toggleVoice,
    speak,
    pauseSpeech,
    resumeSpeech,
    cancelSpeech,
    warmUpVoice,
    initializeVoice,
    speechSupported
  };
}