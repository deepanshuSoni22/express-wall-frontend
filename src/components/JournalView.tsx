import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/contexts/SessionContext';
import { ArrowRight, BookOpen } from 'lucide-react';

interface JournalViewProps {
  onContinue: () => void;
}

export const JournalView = ({ onContinue }: JournalViewProps) => {
  const [content, setContent] = useState('');
  const { updateSession } = useSession();

  const handleContinue = () => {
    updateSession({ expressContent: content });
    onContinue();
  };

  return (
    <div className="min-h-screen bg-gradient-warm p-6 flex flex-col">
      <div className="max-w-md mx-auto flex-1 flex flex-col">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-glow">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Your Journal Wall
          </h2>
          <p className="text-muted-foreground">
            Write freely. Let your thoughts flow without judgment.
          </p>
        </div>

        <div className="flex-1 mb-8">
          <Textarea
            placeholder="Dear wall, today I feel... What's in your heart right now?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] bg-card border-border/50 rounded-2xl p-6 text-base leading-relaxed resize-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <Button 
          onClick={handleContinue}
          className="wellness-button w-full"
          disabled={content.trim().length < 10}
        >
          Continue to Release
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};