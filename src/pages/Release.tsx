import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wind, Heart, Zap, Brain, ArrowRight } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { BreathingExercise } from '@/components/BreathingExercise';
import { Button } from '@/components/ui/button';
import breathingImage from '@/assets/breathing-calm.jpg';

const breathingTechniques = [
  {
    id: 'relaxation' as const,
    title: 'Deep Relaxation',
    description: 'Slow, calming breaths for peace',
    icon: <Heart className="w-6 h-6" />,
    gradient: 'bg-gradient-calm',
    pattern: { inhale: 4, hold: 4, exhale: 6 }
  },
  {
    id: 'focus' as const,
    title: 'Mindful Focus',
    description: 'Centered breathing for clarity',
    icon: <Brain className="w-6 h-6" />,
    gradient: 'bg-gradient-secondary',
    pattern: { inhale: 4, hold: 2, exhale: 4 }
  },
  {
    id: 'stress-release' as const,
    title: 'Stress Release',
    description: 'Release tension and worry',
    icon: <Wind className="w-6 h-6" />,
    gradient: 'bg-gradient-primary',
    pattern: { inhale: 3, hold: 1, exhale: 5 }
  },
  {
    id: 'energy' as const,
    title: 'Gentle Energy',
    description: 'Revitalizing breath for vitality',
    icon: <Zap className="w-6 h-6" />,
    gradient: 'bg-gradient-healing',
    pattern: { inhale: 3, hold: 3, exhale: 3 }
  }
];

const Release = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromExpress = (location.state as any)?.fromExpress === true;

  const { updateSession } = useSession();
  const [selectedTechnique, setSelectedTechnique] = useState<typeof breathingTechniques[0] | null>(null);
  const [showTransition, setShowTransition] = useState<boolean>(fromExpress);

  if (showTransition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-calm relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25 bg-gradient-healing animate-floating" />
          <div className="absolute -bottom-40 -right-32 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-20 bg-gradient-warm animate-floating" style={{ animationDelay: '1.2s' }} />
        </div>
        <div className="relative flex flex-col items-center text-center px-6 max-w-xl">
          <div className="mb-10 w-44 h-44 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-healing opacity-20 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-30 animate-[breathe_4s_ease-in-out_infinite]" />
            <div className="absolute inset-4 rounded-full bg-gradient-secondary opacity-40 animate-[breathe_5s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }} />
            <div className="absolute inset-8 rounded-full bg-gradient-calm flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-medium tracking-wide">Breathe</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-5 animate-fade-in">Release Awaits</h2>
          <p className="text-primary-foreground/90 text-lg leading-relaxed mb-6 animate-fade-in" style={{ animationDelay: '120ms' }}>
            You have expressed your thoughts. Now gently slow down and prepare to breathe.
          </p>
          <p className="text-sm text-primary-foreground/70 animate-fade-in" style={{ animationDelay: '240ms' }}>
            Centering your breath helps your mind settle.
          </p>
          <Button
            onClick={() => setShowTransition(false)}
            className="mt-8 px-10 py-4 font-semibold wellness-button"
          >
            Begin Breathing
          </Button>
        </div>
      </div>
    );
  }

  const handleTechniqueSelect = (technique: typeof breathingTechniques[0]) => {
    setSelectedTechnique(technique);
    updateSession({ releaseChoice: technique.id });
  };

  const handleContinue = () => {
    navigate('/balance');
  };

  if (selectedTechnique) {
    return (
      <BreathingExercise 
        technique={selectedTechnique} 
        onContinue={handleContinue} 
      />
    );
  }

  return (
    <div className="page-shell page-radial-soft">
      {/* Simplified background: removed ambient blobs for cleaner look */}
      <div className="page-inner">
        <div className="max-w-2xl mx-auto">
          <div className="page-header mb-14">
            <img 
              src={breathingImage} 
              alt="Peaceful breathing" 
              className="option-page-image animate-floating"
            />
            <h2 className="display-section mb-4">Release & Breathe</h2>
            <p className="page-subtitle max-w-xl mx-auto">Choose a technique to let go and find your calm</p>
          </div>

          <div className="option-grid">
            {breathingTechniques.map((technique) => (
              <button
                key={technique.id}
                type="button"
                onClick={() => handleTechniqueSelect(technique)}
                className="group option-card"
              >
                <div className={`option-card-stripe ${technique.gradient}`} />
                <div className="flex items-center gap-5 pt-1.5">
                  <div className={`option-card-icon ${technique.gradient}`}>{technique.icon}</div>
                  <div className="flex-1">
                    <h3 className="option-card-title">{technique.title}</h3>
                    <p className="option-card-desc">{technique.description}</p>
                    <p className="option-card-meta">{technique.pattern.inhale}s inhale • {technique.pattern.hold}s hold • {technique.pattern.exhale}s exhale</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Release;