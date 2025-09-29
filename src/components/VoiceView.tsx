import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { HoldButton } from '@/components/ui/hold-button';
import wallBg from '@/assets/wallBG.jpg';
import { audioService } from '@/services/audioService';
import { recommendationService } from '@/services/recommendationService';
import { handleAuthError } from '@/services/apiClient';

interface VoiceViewProps {
  onContinue: () => void;
}

export const VoiceView = ({ onContinue }: VoiceViewProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [vizLevel, setVizLevel] = useState(0); // 0..1 smoothed mic level
  const [transcript, setTranscript] = useState(''); // Live transcript

  // Keep freshest values for async callbacks (avoid stale closures)
  const transcriptRef = useRef(transcript);
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);

  const { updateSession } = useSession();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio visualization refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null); // SpeechRecognition instance

  const STORAGE_KEY_AUDIO = 'expressWell_voiceRecording_tmp';
  const STORAGE_KEY_DURATION = 'expressWell_voiceRecording_duration_tmp';

  // Choose a supported mime type for recording
  const getPreferredMimeType = () => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];
    for (const type of candidates) {
      if ((window as any).MediaRecorder && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  };

  // On mount, set up audio element and restore any temporary recording (within session)
  useEffect(() => {
    audioRef.current = new Audio();
    const onEnded = () => setIsPlaying(false);
    audioRef.current.addEventListener('ended', onEnded);

    // Restore from sessionStorage if present (e.g., re-render within same route)
    const savedBase64 = sessionStorage.getItem(STORAGE_KEY_AUDIO);
    if (savedBase64) {
      const blob = base64ToBlob(savedBase64, 'audio/webm');
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setHasRecorded(true);
      const d = sessionStorage.getItem(STORAGE_KEY_DURATION);
      if (d) setRecordingDuration(parseInt(d, 10));
    }

    // Cleanup on unmount: stop playback, revoke URLs, clear temporary storage
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', onEnded);
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
        audioCtxRef.current = null;
        analyserRef.current = null;
      }
      sessionStorage.removeItem(STORAGE_KEY_AUDIO);
      sessionStorage.removeItem(STORAGE_KEY_DURATION);
      stopSpeechRecognition();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startViz = (stream: MediaStream) => {
    try {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new Ctx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.85;
      source.connect(analyser);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      const timeData = new Uint8Array(analyser.fftSize);
      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(timeData);
        let sum = 0;
        for (let i = 0; i < timeData.length; i++) {
          const v = (timeData[i] - 128) / 128; // -1..1
          sum += v * v;
        }
        const rms = Math.sqrt(sum / timeData.length); // ~0..1
        const level = Math.min(1, rms * 2.2); // amplify softly
        setVizLevel((prev) => prev * 0.8 + level * 0.2);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      // Visualization is optional; ignore errors
      console.warn('Audio visualization init failed', e);
    }
  };

  const stopViz = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setVizLevel(0);
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
      analyserRef.current = null;
    }
  };

  // start/stop speech recognition for live transcription
  const startSpeechRecognition = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn('SpeechRecognition is not supported in this browser.');
      return;
    }
    try {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      let finalText = '';
      rec.onresult = (e: any) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const piece = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalText += piece + ' ';
          else interim += piece;
        }
        setTranscript((finalText + interim).trim());
      };
      rec.onerror = (err: any) => console.warn('SpeechRecognition error:', err?.error || err);
      rec.onend = () => { recognitionRef.current = null; };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('Failed to start SpeechRecognition:', err);
    }
  };

  const stopSpeechRecognition = () => {
    const rec = recognitionRef.current;
    if (rec) {
      try { rec.stop(); } catch {}
      recognitionRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getPreferredMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      // Start reactive visualization
      startViz(stream);

      // start live transcription
      startSpeechRecognition();

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        try {
          const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          setHasRecorded(true);

          // Persist temporarily for this session only
          const base64 = await blobToBase64(blob);
          const base64Data = base64.split(',')[1];
          sessionStorage.setItem(STORAGE_KEY_AUDIO, base64Data);
          sessionStorage.setItem(STORAGE_KEY_DURATION, String(recordingDuration));

          // Stop all media tracks
          stream.getTracks().forEach((t) => t.stop());

          // Stop visualization
          stopViz();

          // Finalize transcript, but do NOT log or update session here
          const latestText = (transcriptRef.current || '').trim();
          setTranscript(latestText);
        } catch (err) {
          console.error('Failed to finalize recording', err);
        }
      };

      recorder.start();
      setIsRecording(true);
      setPermissionDenied(false);

      // Start duration timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingDuration(seconds);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setPermissionDenied(true);
      setIsRecording(false);
      stopViz();
      stopSpeechRecognition();
    }
  };

  const stopRecording = () => {
    // stop STT when user stops recording
    stopSpeechRecognition();

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleRecord = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handlePlayback = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioUrl) {
      audioRef.current.src = audioUrl;
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback failed:', err);
      }
    } else {
      const savedBase64 = sessionStorage.getItem(STORAGE_KEY_AUDIO);
      if (!savedBase64) return;
      const blob = base64ToBlob(savedBase64, 'audio/webm');
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      audioRef.current.src = url;
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback failed:', err);
      }
    }
  };

  const handleRerecord = () => {
    if (isRecording) stopRecording();
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    sessionStorage.removeItem(STORAGE_KEY_AUDIO);
    sessionStorage.removeItem(STORAGE_KEY_DURATION);
    setHasRecorded(false);
    setRecordingDuration(0);
  };

  const handleContinue = async () => {
    try {
      let expressContent = transcript || 'Voice recording completed';
      
      // Always try to send audio file if we have a recording
      if (hasRecorded) {
        let audioBlob: Blob | null = null;
        
        // Try to get audio blob from current audioUrl first
        if (audioUrl) {
          try {
            audioBlob = await fetch(audioUrl).then(r => r.blob());
          } catch (err) {
            console.warn('Failed to get audio from URL:', err);
          }
        }
        
        // Fallback: try to get audio from sessionStorage
        if (!audioBlob) {
          const savedBase64 = sessionStorage.getItem(STORAGE_KEY_AUDIO);
          if (savedBase64) {
            try {
              audioBlob = base64ToBlob(savedBase64, 'audio/webm');
            } catch (err) {
              console.warn('Failed to convert base64 to blob:', err);
            }
          }
        }
        
        // If we have a valid audio blob, send it to the backend
        if (audioBlob && audioBlob.size > 0) {
          console.log('🎤 Sending audio to backend:', {
            size: audioBlob.size,
            type: audioBlob.type
          });
          
          try {
            // Send audio file to the backend for processing
            const processResult = await recommendationService.processAudio(audioBlob);
            console.log('✅ Backend response:', processResult);
            
            // Use the backend transcript if available
            if (processResult.transcript) {
              expressContent = processResult.transcript;
              setTranscript(expressContent);
              console.log('📄 Using backend transcript:', expressContent);
            } else if (transcript) {
              // Keep using local transcript if backend didn't return one
              expressContent = transcript;
              console.log('📄 Using local transcript:', expressContent);
            }
            
            // Don't call prepareRecommendations here - the /api/process/ endpoint handles everything
            
          } catch (error) {
            console.error('❌ Audio processing failed:', error);
            // Show error to user instead of silently falling back
            alert('Failed to process audio recording. Please try again or record a new message.');
            return; // Don't continue if audio processing fails
          }
        } else {
          console.error('⚠️ No valid audio blob found but hasRecorded is true');
          alert('Audio recording not found. Please record your voice again.');
          return;
        }
      } else {
        console.log('ℹ️ No recording found, using default content');
        // Only use text-based processing if no recording was made
        if (transcript) {
          expressContent = transcript;
          await recommendationService.prepareRecommendations(expressContent);
        }
      }
      
      updateSession({ expressContent });
      onContinue();
    } catch (error) {
      console.error('❌ Continue handler error:', error);
      handleAuthError(error);
      updateSession({ expressContent: transcript || 'Voice recording completed' });
      onContinue();
    }
  };

  // Helpers
  const blobToBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Visual styles derived from mic level
  const scale = 1 + (isRecording ? vizLevel * 0.18 : 0);
  const ringScale = 1 + (isRecording ? vizLevel * 0.35 : 0);
  const glowOpacity = isRecording ? 0.45 + vizLevel * 0.45 : 0.25;

  return (
    <div className="page-shell relative overflow-hidden p-6 flex flex-col">
      <img src={wallBg} alt="Calming wall background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col text-center relative">
        <div className="mb-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-soft bg-gradient-to-br from-sky-300 via-sky-200 to-sky-100">
            <Mic className="w-9 h-9 text-white" />
          </div>
          <h2 className="header-title text-primary-foreground-dark mb-3">Voice Wall</h2>
          <p className="header-subtitle text-primary-foreground-dark/80">Let your voice carry the weight away.</p>
        </div>

        {permissionDenied ? (
          <div className="wellness-card mb-10">
            <p className="text-destructive mb-2">Microphone access was denied</p>
            <p className="text-sm text-muted-foreground">Please allow microphone access in browser settings.</p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center mb-10">
            <div className="w-44 h-44 relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{
                  background: 'radial-gradient(60% 60% at 50% 50%, rgba(255,180,160,0.9), rgba(180,160,255,0.2))',
                  opacity: glowOpacity,
                  transition: 'opacity 180ms ease',
                }}
              />
              <div
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: 'rgba(255,255,255,0.6)',
                  transform: `scale(${ringScale})`,
                  opacity: 0.35 + vizLevel * 0.5,
                  transition: 'transform 120ms ease, opacity 180ms ease',
                }}
              />
              <div
                className="absolute inset-0 rounded-full border"
                style={{
                  borderColor: 'rgba(255,255,255,0.35)',
                  transform: `scale(${1 + (isRecording ? 0.15 + vizLevel * 0.25 : 0)})`,
                  opacity: 0.25 + vizLevel * 0.35,
                  transition: 'transform 160ms ease, opacity 200ms ease',
                }}
              />
              <div
                className={`breathing-circle rounded-full w-28 h-28 flex items-center justify-center transition-all duration-150 ${isRecording ? 'scale-105' : ''}`}
                style={{
                  transform: `scale(${scale})`,
                  background: 'conic-gradient(from 180deg at 50% 50%, rgba(210,230,255,1), rgba(160,200,255,0.9), rgba(210,230,255,1))',
                  boxShadow: `0 10px 40px rgba(120,170,255,${0.22 + vizLevel * 0.25}), 0 0 80px rgba(140,180,255,${0.12 + vizLevel * 0.25})`,
                }}
              >
                <Button onClick={handleRecord} variant="ghost" size="lg" className="w-full h-full rounded-full hover:bg-transparent">
                  {isRecording ? (
                    <Square className="w-8 h-8 text-primary-foreground" />
                  ) : (
                    <Mic className="w-8 h-8 text-primary-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="mb-10">
            <p className="text-primary-foreground-dark/80 animate-gentle-pulse mb-3">Recording... Speak from your heart</p>
            <p className="text-primary-foreground-dark/80 font-mono text-sm">{formatTime(recordingDuration)}</p>
          </div>
        )}

        {hasRecorded && !isRecording && (
          <div className="wellness-card mb-10">
            <p className="text-healing mb-4">✓ Recording captured</p>
            <p className="text-sm text-muted-foreground mb-5">Length: {formatTime(recordingDuration)}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={handlePlayback} className="px-5">
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" /> Play
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRerecord} className="px-5">
                <RefreshCw className="w-4 h-4 mr-2" /> Re-record
              </Button>
            </div>
          </div>
        )}

        {/* Show error message when user tries to continue without recording */}
        {!hasRecorded && !isRecording && (
          <div className="mb-6 p-3 bg-red-50/70 border border-red-300/80 rounded text-sm text-red-700 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Please record your voice to continue</span>
          </div>
        )}

        <HoldButton 
          onComplete={handleContinue}
          disabled={!hasRecorded}
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">Hold to Release</span>
            <ArrowRight className="w-5 h-5" />
          </span>
        </HoldButton>
      </div>
    </div>
  );
};