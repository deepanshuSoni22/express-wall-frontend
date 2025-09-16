import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, ArrowRight, Volume2 } from 'lucide-react';

interface MusicViewProps {
  onContinue: () => void;
}

type Track = {
  id: 'rain' | 'forest' | 'ocean';
  title: string;
  description: string;
  src: string;
};

const calmingTracks: Track[] = [
  {
    id: 'rain',
    title: 'Gentle Rain',
    description: 'Soft raindrops for deep relaxation',
    src: '/sounds/rain.mp3',
  },
  {
    id: 'forest',
    title: 'Forest Whispers',
    description: 'Nature sounds for inner peace',
    src: '/sounds/forest.mp3',
  },
  {
    id: 'ocean',
    title: 'Ocean Waves',
    description: 'Rhythmic waves for meditation',
    src: '/sounds/ocean.mp3',
  },
];

export const MusicView = ({ onContinue }: MusicViewProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedTrack, setSelectedTrack] = useState<Track>(calmingTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasListened, setHasListened] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});

  // Create a single Audio element once, and attach listeners
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';

    const onLoadedMetadata = () => {
      const dur = Number.isFinite(audio.duration) ? audio.duration : 0;
      setDuration(dur);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.currentTime >= 5) setHasListened(true);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setHasListened(true);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, []);

  // Preload metadata for all tracks so list shows real lengths
  useEffect(() => {
    const controllers: HTMLAudioElement[] = [];
    calmingTracks.forEach((t) => {
      const a = new Audio();
      a.preload = 'metadata';
      a.src = t.src;
      const handler = () => {
        const dur = Number.isFinite(a.duration) ? a.duration : 0;
        setDurations((prev) => ({ ...prev, [t.id]: dur }));
        a.removeEventListener('loadedmetadata', handler);
      };
      a.addEventListener('loadedmetadata', handler);
      controllers.push(a);
    });
    return () => {
      controllers.forEach((a) => (a.src = ''));
    };
  }, []);

  // Load selected track into the shared audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // ensure any previous playback is stopped before swapping src
    audio.pause();
    setIsPlaying(false);
    setCurrentTime(0);
    setHasListened(false);

    // set displayed duration to known value (will be updated by loadedmetadata if needed)
    setDuration(durations[selectedTrack.id] || 0);

    audio.src = selectedTrack.src;
    audio.load();
  }, [selectedTrack, durations]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e: any) {
        // Ignore AbortError caused by a new load() interrupting play()
        if (e?.name !== 'AbortError') {
          console.error('Playback error:', e);
        }
      }
    }
  };

  const selectTrack = (track: Track) => {
    if (track.id === selectedTrack.id) return;
    const audio = audioRef.current;
    if (audio) audio.pause();
    setSelectedTrack(track);
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
    const s = Math.floor(seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="page-shell bg-gradient-healing p-6 flex flex-col">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col text-center">
        <div className="mb-12">
          <div className="header-icon-sm bg-gradient-secondary">
            <Volume2 className="w-9 h-9 text-primary-foreground animate-gentle-pulse" />
          </div>
          <h2 className="header-title text-primary-foreground mb-3">Calming Sounds</h2>
          <p className="header-subtitle text-primary-foreground/90">Let soothing sounds wash over you</p>
        </div>

        <div className="space-y-4 mb-10 text-left">
          {calmingTracks.map((track) => {
            const dur = durations[track.id] ?? 0;
            return (
              <div
                key={track.id}
                onClick={() => selectTrack(track)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  selectedTrack.id === track.id
                    ? 'bg-card border-primary/30 shadow-soft'
                    : 'bg-card/60 border-border/40 hover:bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-semibold text-foreground mb-0.5">{track.title}</div>
                    <div className="text-sm text-muted-foreground">{track.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {dur ? formatTime(dur) : '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="wellness-card mb-10">
          <div className="mb-5 text-left">
            <h3 className="font-semibold text-foreground mb-2">{selectedTrack.title}</h3>
            <p className="text-sm text-muted-foreground">{selectedTrack.description}</p>
          </div>

          <div className="mb-6">
            <div className="w-full bg-border/30 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <Button onClick={togglePlay} className="wellness-button w-full text-base py-5">
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Play
              </>
            )}
          </Button>
        </div>

        <Button
          onClick={onContinue}
          className="wellness-button w-full text-base py-5"
          disabled={!hasListened}
        >
          Complete Session
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};