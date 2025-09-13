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
    <div className="min-h-screen bg-gradient-warm p-6 flex flex-col">
      <div className="max-w-md mx-auto flex-1 flex flex-col">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground animate-floating" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Reflection Space
          </h2>
          <p className="text-muted-foreground">
            What insights or gratitude arose during your session?
          </p>
        </div>

        <div className="flex-1 mb-8">
          <div className="wellness-card">
            <div className="text-sm text-muted-foreground mb-3 font-medium">
              Some gentle prompts to guide you:
            </div>
            <ul className="text-sm text-muted-foreground/80 space-y-1 mb-4">
              <li>• How do I feel right now compared to when I started?</li>
              <li>• What am I grateful for in this moment?</li>
              <li>• What intention do I want to carry forward?</li>
            </ul>
          </div>
          
          <Textarea
            placeholder="I noticed... I'm grateful for... I feel..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[200px] bg-card border-border/50 rounded-2xl p-6 text-base leading-relaxed resize-none focus:ring-2 focus:ring-primary/50 transition-all mt-4"
          />
        </div>

        <Button 
          onClick={handleContinue}
          className="wellness-button w-full"
          disabled={reflection.trim().length < 5}
        >
          Complete Session
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};