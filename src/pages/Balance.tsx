import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote, PenTool, Music, ArrowRight } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { QuoteView } from '@/components/QuoteView';
import { ReflectionView } from '@/components/ReflectionView';
import { MusicView } from '@/components/MusicView';
import heroImage from '@/assets/hero-wellness.jpg';

const balanceOptions = [
  {
    id: 'quote' as const,
    title: 'Read Inspiration',
    description: 'Find wisdom in calming words',
    icon: <Quote className="w-8 h-8" />,
    gradient: 'bg-gradient-secondary'
  },
  {
    id: 'reflection' as const,
    title: 'Write Reflection',
    description: 'Capture your insights',
    icon: <PenTool className="w-8 h-8" />,
    gradient: 'bg-gradient-warm'
  },
  {
    id: 'music' as const,
    title: 'Listen & Rest',
    description: 'Soothing sounds for peace',
    icon: <Music className="w-8 h-8" />,
    gradient: 'bg-gradient-healing'
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
    <div className="page-shell page-radial-soft">
      {/* Simplified background: decorative blobs removed */}
      <div className="page-inner">
        <div className="max-w-2xl mx-auto">
          <div className="page-header mb-14">
            <img
              src={heroImage}
              alt="Find your balance"
              className="option-page-image"
            />
            <h2 className="display-section mb-4">Find Your Balance</h2>
            <p className="page-subtitle max-w-xl mx-auto">Choose how you'd like to restore your inner peace</p>
          </div>

          <div className="option-grid">
            {balanceOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(option.id)}
                className="group option-card"
              >
                <div className={`option-card-stripe ${option.gradient}`} />
                <div className="flex items-center gap-5 pt-1.5">
                  <div className={`option-card-icon ${option.gradient}`}>{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="option-card-title">{option.title}</h3>
                    <p className="option-card-desc">{option.description}</p>
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

export default Balance;