import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Mic, Paintbrush, ArrowRight } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { JournalView } from '@/components/JournalView';
import { VoiceView } from '@/components/VoiceView';
import { DrawingView } from '@/components/DrawingView';
import expressImage from '@/assets/express-creative.jpg';

const expressOptions = [
  {
    id: 'write' as const,
    title: 'Write on Wall',
    description: 'Journal your thoughts and feelings',
    icon: <PenTool className="w-8 h-8" />,
    gradient: 'bg-gradient-primary'
  },
  {
    id: 'speak' as const,
    title: 'Speak on Wall',
    description: 'Record your voice and emotions',
    icon: <Mic className="w-8 h-8" />,
    gradient: 'bg-gradient-secondary'
  },
  {
    id: 'draw' as const,
    title: 'Draw on Wall',
    description: 'Express through colors and shapes',
    icon: <Paintbrush className="w-8 h-8" />,
    gradient: 'bg-gradient-healing'
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
    <div className="page-shell page-radial-soft">
      {/* Simplified background: decorative blobs removed for cleaner theme */}
      <div className="page-inner">
        <div className="mx-auto max-w-2xl">
          <div className="page-header mb-14">
            <img 
              src={expressImage} 
              alt="Creative expression" 
              className="option-page-image"
            />
            <h2 className="display-section mb-4">Express Yourself</h2>
            <p className="page-subtitle max-w-xl mx-auto">Choose the way that feels right today.</p>
          </div>

          {/* Options grid */}
          <div className="option-grid">
            {expressOptions.map((option) => (
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

export default Express;