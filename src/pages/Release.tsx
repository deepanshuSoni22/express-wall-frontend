import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wind, Heart, Zap, Brain, ArrowRight } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { BreathingExercise } from '@/components/BreathingExercise';
import { Transition } from '@/components/Transition';
import releaseBgVideo from '@/assets/white-curtain.mp4';

type BreathingTechniqueId = 'relaxation' | 'focus' | 'stress-release' | 'energy';

interface BreathingPattern {
  inhale: number;
  hold: number;
  exhale: number;
}

interface BreathingTechnique {
  id: BreathingTechniqueId;
  title: string;
  description: string;
  icon: JSX.Element;
  gradient: string;
  pattern: BreathingPattern;
}

const breathingTechniques: BreathingTechnique[] = [
  {
    id: 'relaxation',
    title: 'Deep Relaxation',
    description: 'Slow, calming breaths for peace',
    icon: <Heart className="w-6 h-6" />,
    gradient: 'icon-gradient-blue',
    pattern: { inhale: 4, hold: 4, exhale: 6 }
  },
  {
    id: 'focus',
    title: 'Mindful Focus',
    description: 'Centered breathing for clarity',
    icon: <Brain className="w-6 h-6" />,
    gradient: 'icon-gradient-sky',
    pattern: { inhale: 4, hold: 2, exhale: 4 }
  },
  {
    id: 'stress-release',
    title: 'Stress Release',
    description: 'Release tension and worry',
    icon: <Wind className="w-6 h-6" />,
    gradient: 'icon-gradient-indigo',
    pattern: { inhale: 3, hold: 1, exhale: 5 }
  },
  {
    id: 'energy',
    title: 'Gentle Energy',
    description: 'Revitalizing breath for vitality',
    icon: <Zap className="w-6 h-6" />,
    gradient: 'icon-gradient-blue',
    pattern: { inhale: 3, hold: 3, exhale: 3 }
  }
];

const Release = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromExpress = (location.state as { fromExpress?: boolean })?.fromExpress === true;

  const { updateSession } = useSession();
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [showTransition, setShowTransition] = useState<boolean>(fromExpress);

  if (showTransition) {
    return <Transition onContinue={() => setShowTransition(false)} />;
  }

  const handleTechniqueSelect = (technique: BreathingTechnique) => {
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
    <div className="page-with-video">
      <video
        className="page-video-bg"
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

          <p className="option-page-prompt mb-6">
            How would you like to breathe? <span className="font-normal">Choose your rhythm.</span>
          </p>

          <div className="option-grid">
            {breathingTechniques.map((technique) => (
              <button
                key={technique.id}
                type="button"
                onClick={() => handleTechniqueSelect(technique)}
                className="group option-card card-gradient-bg hover:shadow-lg shadow-md transition-all duration-300"
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