import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote, PenTool, Music, ArrowRight } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { QuoteView } from '@/components/QuoteView';
import { ReflectionView } from '@/components/ReflectionView';
import { MusicView } from '@/components/MusicView';
import balanceBgVideo from '@/assets/white-curtain.mp4';

const balanceOptions = [
  {
    id: 'quote' as const,
    title: 'Inspiring Words',
    description: 'Find wisdom in calming thoughts',
    icon: <Quote className="w-8 h-8" />,
    gradient: 'bg-gradient-to-br from-purple-300 via-purple-200 to-purple-100'
  },
  {
    id: 'reflection' as const,
    title: 'Personal Reflection',
    description: 'Capture your journey insights',
    icon: <PenTool className="w-8 h-8" />,
    gradient: 'bg-gradient-to-br from-pink-300 via-pink-200 to-pink-100'
  },
  {
    id: 'music' as const,
    title: 'Calming Sounds',
    description: 'Soothing melodies for peace',
    icon: <Music className="w-8 h-8" />,
    gradient: 'bg-gradient-to-br from-emerald-300 via-emerald-200 to-emerald-100'
  }
];

const Balance = () => {
  const navigate = useNavigate();
  const { updateSession } = useSession();
  const [selectedOption, setSelectedOption] = useState<'quote' | 'reflection' | 'music' | null>(null);

  const handleOptionSelect = (option: 'quote' | 'reflection' | 'music') => {
    setSelectedOption(option);
    updateSession({ balanceChoice: option });
  };

  const handleContinue = () => {
    navigate('/ending');
  };

  if (selectedOption) {
    return (
      <div className="min-h-screen bg-background">
        {selectedOption === 'quote' && <QuoteView onContinue={handleContinue} />}
        {selectedOption === 'reflection' && <ReflectionView onContinue={handleContinue} />}
        {selectedOption === 'music' && <MusicView onContinue={handleContinue} />}
      </div>
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
        <source src={balanceBgVideo} type="video/mp4" />
        Your browser does not support the background video.
      </video>

      <div className="page-inner relative z-10">
        <div className="mx-auto max-w-2xl">
          <div className="page-header mb-14">
            <h2 className="display-section mb-4 text-primary-foreground-dark">
              <span className="block text-xl font-semibold tracking-tight mb-1">Your Journey</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none">Your Balance.</span>
            </h2>
            <p className="max-w-xl mx-auto font-semibold text-primary-foreground-dark">
              You've expressed and released. Now rebuild your inner peace and ground yourself in this moment.
            </p>
          </div>

          <p className="text-base sm:text-lg font-semibold text-primary-foreground-dark/90 mb-6 text-center">
            How would you like to Rebuild yourself? <span className="font-normal">Choose your path.</span>
          </p>

          <div className="option-grid">
            {balanceOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(option.id)}
                className="group option-card bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 backdrop-blur-sm text-gray-700 border-blue-200/50 hover:shadow-lg shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-5 pt-1.5">
                  <div className={`option-card-icon ${option.gradient} text-white shadow-sm`}>{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="option-card-title text-gray-800 font-semibold">{option.title}</h3>
                    <p className="option-card-desc text-gray-600">{option.description}</p>
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

export default Balance;