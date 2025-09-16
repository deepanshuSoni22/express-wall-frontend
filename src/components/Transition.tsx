import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import LiquidChrome from './LiquidChromeBG';

interface TransitionProps {
  onContinue: () => void;
}

export const Transition = ({ onContinue }: TransitionProps) => {
  const lines = [
    'Released.',
    'Your story is safe.',
    'Your heart is lighter.',
    "Relax... you\'ve let it go."
  ];

  const [displayLines, setDisplayLines] = useState<string[]>(Array(lines.length).fill(''));
  const [done, setDone] = useState(false);
  const [showCursors, setShowCursors] = useState<boolean[]>(Array(lines.length).fill(false));

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    const typingSpeed = 100;         // ms per character
    const lineDelay = 550;          // delay before next line starts

    let timeoutId: number;

    const type = () => {
      if (lineIndex >= lines.length) {
        setDone(true);
        setShowCursors(Array(lines.length).fill(false));
        return;
      }
      
      // Set the current line's cursor to visible
      setShowCursors(() => {
        const next = Array(lines.length).fill(false);
        next[lineIndex] = true;
        return next;
      });
      
      const currentLine = lines[lineIndex];
      if (charIndex <= currentLine.length) {
        setDisplayLines(prev => {
          const next = [...prev];
          next[lineIndex] = currentLine.slice(0, charIndex);
          return next;
        });
        charIndex++;
        timeoutId = window.setTimeout(type, typingSpeed);
      } else {
        lineIndex++;
        charIndex = 0;
        timeoutId = window.setTimeout(type, lineDelay);
      }
    };

    type();
    return () => clearTimeout(timeoutId);
  }, []);

  // Text shadow style for better visibility
  const textShadowStyle = {
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 0, 0, 0.2)'
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Liquid Chrome Background (calmer palette) */}
      <div className="absolute inset-0 z-0">
        <LiquidChrome
          baseColor={[0.52, 0.80, 0.98]} // calm light sky blue
          speed={0.79}
          amplitude={0.32}
          frequencyX={1.6}
          frequencyY={1.8}
          interactive={false}
        />
      </div>

      {/* Light, soft overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-br from-sky-100/45 via-teal-100/35 to-emerald-100/30 backdrop-blur-sm" />

      <div className="relative z-10 max-w-2xl w-full text-center px-6">
      <h2
        className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black mb-10 leading-tight"
        style={textShadowStyle}
      >
        {displayLines[0]}
        {showCursors[0] && (
        <span className="inline-block w-2 h-6 align-middle bg-white ml-1 opacity-75" />
        )}
        </h2>

        <div className="space-y-6 text-xl font-semibold">
          {lines.slice(1).map((_, idx) => {
            const absoluteIndex = idx + 1;
            return (
              <p 
                key={absoluteIndex} 
                className="leading-relaxed text-black"
                style={textShadowStyle}
              >
                {displayLines[absoluteIndex]}
                {showCursors[absoluteIndex] && (
                  <span className="inline-block w-2 h-5 align-middle bg-white ml-1 opacity-75" />
                )}
              </p>
            );
          })}
        </div>

        <Button
          onClick={onContinue}
          disabled={!done}
          className="mt-12 px-10 py-4 font-bold wellness-button disabled:opacity-40 disabled:cursor-default transition-opacity"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default Transition;