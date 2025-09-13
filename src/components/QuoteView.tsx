import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw, Heart } from 'lucide-react';

interface QuoteViewProps {
  onContinue: () => void;
}

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

export const QuoteView = ({ onContinue }: QuoteViewProps) => {
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
    <div className="min-h-screen bg-gradient-secondary p-6 flex flex-col">
      <div className="max-w-md mx-auto flex-1 flex flex-col text-center">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-glow">
            <Heart className="w-8 h-8 text-primary-foreground animate-gentle-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Words of Wisdom
          </h2>
          <p className="text-muted-foreground">
            Let these words nourish your spirit
          </p>
        </div>

        <div className={`flex-1 flex items-center justify-center mb-12 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="wellness-card max-w-sm">
            <div className="text-lg font-medium text-foreground leading-relaxed mb-4">
              "{currentQuote.text}"
            </div>
            <div className="text-muted-foreground font-medium">
              — {currentQuote.author}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={getNewQuote}
            variant="outline"
            className="w-full bg-card/50 border-border/50 hover:bg-card"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Another Quote
          </Button>

          <Button 
            onClick={onContinue}
            className="wellness-button w-full"
          >
            Complete Session
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};