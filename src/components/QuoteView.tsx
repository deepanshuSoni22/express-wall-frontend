import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw, Heart } from 'lucide-react';
import type { WithContinueProps } from '@/types';

const inspiringQuotes = [
  {
    text: "You are exactly where you need to be. Trust the process of your healing.",
    author: "Inner Wisdom"
  },
  {
    text: "Every breath is a new beginning, every exhale a gentle release.",
    author: "Mindful Heart"
  },
  {
    text: "Your feelings are valid. Your journey is sacred. You are enough.",
    author: "Self Compassion"
  },
  {
    text: "In stillness, you find your strength. In quiet moments, your truth emerges.",
    author: "Peaceful Soul"
  },
  {
    text: "Today's struggles are tomorrow's strengths. You're growing with each step.",
    author: "Gentle Courage"
  },
  {
    text: "Be patient with yourself. Healing happens in its own beautiful time.",
    author: "Loving Kindness"
  }
];

export const QuoteView = ({ onContinue }: WithContinueProps) => {
  const [currentQuote, setCurrentQuote] = useState(inspiringQuotes[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const randomQuote = inspiringQuotes[Math.floor(Math.random() * inspiringQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const getNewQuote = () => {
    setIsVisible(false);
    setTimeout(() => {
      const randomQuote = inspiringQuotes[Math.floor(Math.random() * inspiringQuotes.length)];
      setCurrentQuote(randomQuote);
      setIsVisible(true);
    }, 300);
  };

  return (
    <div className="page-shell bg-gradient-healing p-6 flex flex-col min-h-full-viewport">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col text-center">
        <div className="mb-12">
          <div className="header-icon-sm bg-gradient-secondary">
            <Heart className="w-9 h-9 text-primary-foreground animate-gentle-pulse" />
          </div>
          <h2 className="header-title text-primary-foreground mb-3">Words of Wisdom</h2>
          <p className="header-subtitle text-primary-foreground/90">Let these words nourish your spirit</p>
        </div>

        <div className={`flex-1 flex items-center justify-center mb-14 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="wellness-card max-w-lg mx-auto">
            <div className="text-xl font-medium text-foreground leading-relaxed mb-5 italic">
              "{currentQuote.text}"
            </div>
            <div className="text-muted-foreground font-medium tracking-wide">
              — {currentQuote.author}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <Button 
            onClick={getNewQuote}
            variant="outline"
            className="w-full bg-card/50 border-border/50 hover:bg-card text-base py-5"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Another Quote
          </Button>

          <Button 
            onClick={onContinue}
            className="wellness-button w-full text-base py-5"
          >
            Complete Session
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};