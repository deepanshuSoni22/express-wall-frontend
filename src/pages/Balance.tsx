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
    <div className="min-h-screen relative bg-background overflow-hidden">
      {/* Ambient decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30 bg-gradient-primary" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-25 bg-gradient-healing" />

      <div className="relative p-6 md:flex md:min-h-screen md:items-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <img
              src={heroImage}
              alt="Find your balance"
              className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl mx-auto mb-6 shadow-soft ring-1 ring-border/50"
            />
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Find Your Balance
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Choose how you'd like to restore your inner peace
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {balanceOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(option.id)}
                className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 text-left shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {/* accent gradient stripe */}
                <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl ${option.gradient} opacity-90`} />

                <div className="flex items-center gap-4 pt-1.5">
                  <div className={`shrink-0 p-3 rounded-xl ${option.gradient} text-primary-foreground shadow-glow group-hover:scale-110 transition-transform`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
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

export default Balance;