import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen app-splash-bg relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-[2px]" />
      <div
        className={`relative transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
      <h1 className="text-4xl font-bold text-white drop-shadow mb-4 animate-fade-in">
        ExpressWall
      </h1>
      <p className="text-lg font-semibold text-white mb-8 max-w-md mx-auto leading-relaxed space-y-1">
        <span>
        <span className="font-bold bg-white/20/50 bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
          Express
        </span>{' '}
        |{' '}
        <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
          Release
        </span>{' '}
        |{' '}
        <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
          Balance
        </span>
        </span>
        <span className="block mt-3 tracking-wide">
        Here, your heart can breathe.
        </span>
        <span className="block">Your words are safe, and</span>
        <span className="block">your feelings are just yours.</span>
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