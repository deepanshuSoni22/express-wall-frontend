import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-wellness.jpg';

const Splash = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStart = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-6 text-center">
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mb-8 relative">
          <img 
            src={heroImage} 
            alt="Peaceful wellness illustration" 
            className="w-80 h-48 object-cover rounded-3xl shadow-glow mx-auto animate-floating"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-primary-foreground mb-4 animate-fade-in">
          ExpressWall
        </h1>
        
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-md mx-auto leading-relaxed">
          Welcome to your personal wellness journey. 
          A gentle space to express, release, and find balance.
        </p>
        
        <Button 
          onClick={handleStart}
          className="wellness-button text-lg px-12 py-4 animate-slide-up"
        >
          Begin Your Session
        </Button>
      </div>
    </div>
  );
};

export default Splash;