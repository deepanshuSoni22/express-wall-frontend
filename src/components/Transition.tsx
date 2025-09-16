import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import wallBg from '@/assets/wallBg.jpg';

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

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    const typingSpeed = 45;         // ms per character
    const lineDelay = 550;          // delay before next line starts

    let timeoutId: number;

    const type = () => {
      if (lineIndex >= lines.length) {
        setDone(true);
        return;
      }
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

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-6"
      style={{
        backgroundImage: `url(${wallBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >

      <div className="relative max-w-2xl w-full text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary-foreground-dark mb-10 leading-tight">
          {displayLines[0]}
          {!done && displayLines[0].length < lines[0].length && (
            <span className="inline-block w-2 h-6 align-middle bg-primary-foreground-dark ml-1 animate-pulse" />
          )}
        </h2>

        <div className="space-y-5 text-lg text-primary-foreground-dark font-medium">
          {lines.slice(1).map((_, idx) => {
            const absoluteIndex = idx + 1;
            const isTyping = displayLines[absoluteIndex].length < lines[absoluteIndex].length;
            const showCaret = !done && isTyping;
            return (
              <p key={absoluteIndex} className="leading-relaxed">
                {displayLines[absoluteIndex]}
                {showCaret && (
                  <span className="inline-block w-2 h-5 align-middle bg-primary-foreground-dark ml-1 animate-pulse" />
                )}
              </p>
            );
          })}
        </div>

        <Button
          onClick={onContinue}
            disabled={!done}
          className="mt-12 px-10 py-4 font-semibold wellness-button disabled:opacity-40 disabled:cursor-default transition-opacity"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default Transition;