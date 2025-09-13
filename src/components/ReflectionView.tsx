import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';

interface ReflectionViewProps {
  onContinue: () => void;
}

export const ReflectionView = ({ onContinue }: ReflectionViewProps) => {
  const [reflection, setReflection] = useState('');
  const { updateSession } = useSession();

  const handleContinue = () => {
    updateSession({ balanceContent: reflection });
    onContinue();
  };

  return (
    <div className="page-shell bg-gradient-warm p-6 flex flex-col">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        <div className="text-center mb-12">
          <div className="header-icon-sm">
            <Sparkles className="w-9 h-9 text-primary-foreground animate-floating" />
          </div>
          <h2 className="header-title text-primary-foreground mb-3">Reflection Space</h2>
          <p className="header-subtitle text-primary-foreground/90">What insights or gratitude arose during your session?</p>
        </div>

        <div className="flex-1 mb-10">
          <div className="wellness-card mb-6">
            <div className="text-sm font-medium text-muted-foreground mb-3">Some gentle prompts to guide you:</div>
            <ul className="text-sm text-muted-foreground/80 space-y-1">
              <li>• How do I feel right now compared to when I started?</li>
              <li>• What am I grateful for in this moment?</li>
              <li>• What intention do I want to carry forward?</li>
            </ul>
          </div>

          <Textarea
            placeholder="I noticed... I'm grateful for... I feel..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[240px] bg-card border-border/50 rounded-3xl p-6 body-lg resize-none focus:ring-2 focus:ring-primary/50 transition-all shadow-soft"
          />
        </div>

        <Button 
          onClick={handleContinue}
          className="wellness-button w-full text-base py-5"
          disabled={reflection.trim().length < 5}
        >
          Complete Session
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};