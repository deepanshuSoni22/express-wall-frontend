import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/contexts/SessionContext';
import { ArrowRight, BookOpen } from 'lucide-react';
import { HoldButton } from '@/components/ui/hold-button';

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
    <div className="page-shell bg-gradient-warm flex flex-col p-6">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        <div className="text-center mb-12">
          <div className="header-icon-sm">
            <BookOpen className="w-9 h-9 text-primary-foreground" />
          </div>
          <h2 className="header-title text-primary-foreground mb-3">Your Journal Wall</h2>
          <p className="header-subtitle text-primary-foreground/90">Write freely. Let your thoughts flow without judgment.</p>
        </div>

        <div className="flex-1 mb-10">
          <Textarea
            placeholder="Dear wall, today I feel... What's in your heart right now?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[320px] bg-card border-border/50 rounded-3xl p-6 body-lg resize-none focus:ring-2 focus:ring-primary/50 transition-all shadow-soft"
          />
        </div>

        <HoldButton 
          onComplete={handleContinue}
          disabled={content.trim().length < 10}
          progressClassName="bg-primary-foreground/30"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">Hold to Continue</span>
            <ArrowRight className="w-5 h-5" />
          </span>
        </HoldButton>
      </div>
    </div>
  );
};