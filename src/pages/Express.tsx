import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Mic, Paintbrush, ArrowRight } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { JournalView } from '@/components/JournalView';
import { VoiceView } from '@/components/VoiceView';
import { DrawingView } from '@/components/DrawingView';
import expressBgVideo from '@/assets/white-curtain.mp4'; // Updated to use the new video file

const expressOptions = [
  {
    id: 'write' as const,
    title: 'Text Wall',
    description: 'Pour your heart out with words',
    icon: <PenTool className="w-8 h-8" />,
    gradient: 'bg-gradient-to-br from-[#1AAEAC] to-[#1AAEAC]/70' // Teal gradient
  },
  {
    id: 'speak' as const,
    title: 'Voice Wall',
    description: 'Let your voice carry the weight away', 
    icon: <Mic className="w-8 h-8" />,
    gradient: 'bg-gradient-to-br from-[#1AAEAC] to-[#1AAEAC]/70' // Teal gradient
  },
  {
    id: 'draw' as const,
    title: 'Doodle Wall',
    description: 'Sketch what your heart cannot say',
    icon: <Paintbrush className="w-8 h-8" />,
    gradient: 'bg-gradient-to-br from-[#1AAEAC] to-[#1AAEAC]/70' // Teal gradient
  }
];

const Express = () => {
  const navigate = useNavigate();
  const { updateSession } = useSession();
  const [selectedOption, setSelectedOption] = useState<'write' | 'speak' | 'draw' | null>(null);

  const handleOptionSelect = (option: 'write' | 'speak' | 'draw') => {
    setSelectedOption(option);
    updateSession({ expressChoice: option, startTime: new Date() });
  };

  const handleContinue = () => {
    navigate('/release', { state: { fromExpress: true } });
  };

  if (selectedOption) {
    return (
      <div className="min-h-screen bg-background">
        {selectedOption === 'write' && <JournalView onContinue={handleContinue} />}
        {selectedOption === 'speak' && <VoiceView onContinue={handleContinue} />} 
        {selectedOption === 'draw' && <DrawingView onContinue={handleContinue} />}
      </div>
    );
  }

  return (
    <div className="page-shell relative overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={expressBgVideo} type="video/mp4" />
        Your browser does not support the background video.
      </video>

      {/* Teal-tinted overlay for readability */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-[#1AAEAC40] via-[#1AAEAC30] to-[#EAD9F520] backdrop-blur-sm" /> */}

      <div className="page-inner relative z-10">
        <div className="mx-auto max-w-2xl">
          <div className="page-header mb-14">
            {/* Updated heading & descriptive copy (layout preserved) */}
            <h2 className="display-section mb-4 text-primary-foreground-dark">
              <span className="block text-xl font-semibold tracking-tight mb-1">Your Space</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none">Your Story.</span>
            </h2>
            <p className="max-w-xl mx-auto font-semibold text-primary-foreground-dark">
              What’s weighing on your heart today? Share it anonymously on your EXPRESS WALL. 
            </p>
          </div>

          {/* Section prompt before options */}
          <p className="text-base sm:text-lg font-semibold text-primary-foreground-dark/90 mb-6 text-center">
            How would you like to express? <span className="font-normal">Select one below.</span>
          </p>

          {/* Options grid with teal styling */}
          <div className="option-grid">
            {expressOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(option.id)}
                className="group option-card bg-blue-400 text-primary-foreground border-primary-foreground/20 hover:brightness-110 shadow-md"
              >
                <div className="flex items-center gap-5 pt-1.5">
                  <div className={`option-card-icon bg-white/20 text-white`}>{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="option-card-title text-primary-foreground font-semibold">{option.title}</h3>
                    <p className="option-card-desc text-primary-foreground/80">{option.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Express;