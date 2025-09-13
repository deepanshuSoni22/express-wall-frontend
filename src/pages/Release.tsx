import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, Heart, Zap, Brain, ArrowRight } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { BreathingExercise } from '@/components/BreathingExercise';
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
  const { updateSession } = useSession();
  const [selectedTechnique, setSelectedTechnique] = useState<typeof breathingTechniques[0] | null>(null);

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
    <div className="min-h-screen relative bg-background overflow-hidden">
      {/* Ambient decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-20 w-96 h-96 rounded-full blur-3xl opacity-25 bg-gradient-primary" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20 bg-gradient-healing" />

      <div className="relative p-6 md:flex md:min-h-screen md:items-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <img 
              src={breathingImage} 
              alt="Peaceful breathing" 
              className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl mx-auto mb-6 shadow-soft ring-1 ring-border/50 animate-floating"
            />
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Release & Breathe
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Choose a technique to let go and find your calm
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {breathingTechniques.map((technique) => (
              <button
                key={technique.id}
                type="button"
                onClick={() => handleTechniqueSelect(technique)}
                className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 text-left shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {/* accent gradient stripe */}
                <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl ${technique.gradient} opacity-90`} />

                <div className="flex items-center gap-4 pt-1.5">
                  <div className={`shrink-0 p-3 rounded-xl ${technique.gradient} text-primary-foreground shadow-glow group-hover:scale-110 transition-transform`}>
                    {technique.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {technique.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {technique.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {technique.pattern.inhale}s inhale • {technique.pattern.hold}s hold • {technique.pattern.exhale}s exhale
                    </p>
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