import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, RotateCcw } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import heroImage from '@/assets/hero-wellness.jpg';

const Ending = () => {
  const navigate = useNavigate();
  const { sessionData, resetSession } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNewSession = () => {
    resetSession();
    navigate('/');
  };

  const getSessionSummary = () => {
    const { expressChoice, releaseChoice, balanceChoice } = sessionData;
    
    let summary = "You've completed a beautiful wellness journey. ";
    
    if (expressChoice === 'write') summary += "Your words found their way to the wall. ";
    else if (expressChoice === 'speak') summary += "Your voice was heard and honored. ";
    else if (expressChoice === 'draw') summary += "Your creativity flowed freely. ";
    
    if (releaseChoice === 'relaxation') summary += "You found deep relaxation through breath. ";
    else if (releaseChoice === 'focus') summary += "You centered yourself with mindful breathing. ";
    else if (releaseChoice === 'stress-release') summary += "You released tension and worry. ";
    else if (releaseChoice === 'energy') summary += "You revitalized your energy gently. ";
    
    if (balanceChoice === 'quote') summary += "Wisdom has filled your heart.";
    else if (balanceChoice === 'reflection') summary += "Your insights have been captured.";
    else if (balanceChoice === 'music') summary += "Calming sounds have soothed your soul.";
    
    return summary;
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-6 text-center">
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mb-8 relative">
          <img 
            src={heroImage} 
            alt="Session complete" 
            className="w-80 h-48 object-cover rounded-3xl shadow-glow mx-auto animate-floating"
          />
        </div>
        
        <div className="mb-6">
          <Heart className="w-16 h-16 text-primary-foreground mx-auto mb-4 animate-gentle-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-primary-foreground mb-4">
          Session Complete
        </h1>
        
        <div className="wellness-card bg-primary-foreground/10 border-primary-foreground/20 mb-8 max-w-md mx-auto">
          <p className="text-primary-foreground-dark/90 leading-relaxed">
            {getSessionSummary()}
          </p>
        </div>

        <div className="space-y-3 max-w-sm mx-auto">
          <p className="text-primary-foreground-dark/80 text-sm mb-6">
            Remember: You are worthy of love, peace, and all the gentleness this world has to offer. 
            Come back whenever you need this space.
          </p>
          
          <Button 
            onClick={handleNewSession}
            className="wellness-button w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start New Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Ending;