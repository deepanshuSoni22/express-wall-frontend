import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wind, Heart, Zap, Brain, ArrowRight } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { BreathingExercise } from '@/components/BreathingExercise';
import { Button } from '@/components/ui/button';
import releaseBgVideo from '@/assets/white-curtain.mp4';

const breathingTechniques = [
  {
    id: 'relaxation' as const,
    title: 'Deep Relaxation',
    description: 'Slow, calming breaths for peace',
    icon: <Heart className="w-6 h-6" />,
    gradient: 'bg-gradient-to-br from-purple-300 via-purple-200 to-purple-100',
    pattern: { inhale: 4, hold: 4, exhale: 6 }
  },
  {
    id: 'focus' as const,
    title: 'Mindful Focus',
    description: 'Centered breathing for clarity',
    icon: <Brain className="w-6 h-6" />,
    gradient: 'bg-gradient-to-br from-pink-300 via-pink-200 to-pink-100',
    pattern: { inhale: 4, hold: 2, exhale: 4 }
  },
  {
    id: 'stress-release' as const,
    title: 'Stress Release',
    description: 'Release tension and worry',
    icon: <Wind className="w-6 h-6" />,
    gradient: 'bg-gradient-to-br from-emerald-300 via-emerald-200 to-emerald-100',
    pattern: { inhale: 3, hold: 1, exhale: 5 }
  },
  {
    id: 'energy' as const,
    title: 'Gentle Energy',
    description: 'Revitalizing breath for vitality',
    icon: <Zap className="w-6 h-6" />,
    gradient: 'bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100',
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
              <span className="text-primary-foreground-dark font-medium tracking-wide">Breathe</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground-dark mb-5 animate-fade-in">
            Great – you've expressed your thoughts
          </h2>
          <p
            className="text-primary-foreground-dark/90 text-lg leading-relaxed mb-6 animate-fade-in"
            style={{ animationDelay: '120ms' }}
          >
            Now we'll gently shift from expression to release. Slow your pace, feel your body,
            and invite a softer rhythm into your breath.
          </p>
          <p
            className="text-sm text-primary-foreground-dark/70 animate-fade-in"
            style={{ animationDelay: '240ms' }}
          >
            When you're ready, begin a guided pattern to calm your nervous system and let tension melt away.
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
    window.scrollTo(0, 0); // Ensure scroll position reset
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
    <div className="page-shell relative overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={releaseBgVideo} type="video/mp4" />
        Your browser does not support the background video.
      </video>

      <div className="page-inner relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="page-header mb-14">
            <h2 className="display-section mb-4 text-primary-foreground-dark">
              <span className="block text-xl font-semibold tracking-tight mb-1">Your Release</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none">Your Breath.</span>
            </h2>
            <p className="max-w-xl mx-auto font-semibold text-primary-foreground-dark">
              Choose a breathing technique to let go and find your calm
            </p>
          </div>

          <p className="text-base sm:text-lg font-semibold text-primary-foreground-dark/90 mb-6 text-center">
            How would you like to breathe? <span className="font-normal">Choose your rhythm.</span>
          </p>

          <div className="option-grid">
            {breathingTechniques.map((technique) => (
              <button
                key={technique.id}
                type="button"
                onClick={() => handleTechniqueSelect(technique)}
                className="group option-card bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 backdrop-blur-sm text-gray-700 border-blue-200/50 hover:shadow-lg shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-5 pt-1.5">
                  <div className={`option-card-icon ${technique.gradient} text-white shadow-sm`}>{technique.icon}</div>
                  <div className="flex-1">
                    <h3 className="option-card-title text-gray-800 font-semibold">{technique.title}</h3>
                    <p className="option-card-desc text-gray-600">{technique.description}</p>
                    <p className="option-card-meta text-gray-500">{technique.pattern.inhale}s inhale • {technique.pattern.hold}s hold • {technique.pattern.exhale}s exhale</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 group-hover:text-gray-700 transition-all" />
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