import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import treesVideo from '@/assets/trees-bg.mp4';

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { 
    setIsVisible(true); 
  }, []);

  const handleStart = () => navigate('/onboarding');

  return (
    <div className="h-full-viewport w-full app-splash-bg relative overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={treesVideo} type="video/mp4" />
          Your browser does not support the background video.
        </video>
      </div>

      <div className={`relative h-full w-full flex flex-col px-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Top keywords */}
        <div className="pt-6 sm:pt-8 pb-2 sm:pb-3 text-center">
          <div className="inline-flex items-center justify-center gap-2 sm:gap-3 md:gap-4 whitespace-nowrap overflow-hidden splash-keywords">
            <span className="text-lg sm:text-sm md:text-lg lg:text-2xl uppercase tracking-widest sm:tracking-widest">Express</span>
            <span className="text-lg sm:text-sm md:text-lg lg:text-2xl font-semibold">|</span>
            <span className="text-lg sm:text-sm md:text-lg lg:text-2xl uppercase tracking-widest sm:tracking-widest">Release</span>
            <span className="text-lg sm:text-sm md:text-lg lg:text-2xl font-semibold">|</span>
            <span className="text-lg sm:text-sm md:text-lg lg:text-2xl uppercase tracking-widest sm:tracking-widest">Rebuild</span>
          </div>
        </div>

        {/* Logo block */}
        <div className="flex-grow flex items-center justify-center">
          <div className="relative w-80 h-40 sm:w-96 sm:h-48 md:w-[440px] md:h-52 lg:w-[520px] lg:h-60 mx-auto">
            <div className="absolute top-0 left-7 sm:left-14 md:left-14 lg:left-16">
              <span className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground drop-shadow-sm tracking-tight splash-logo-the">
                T H E
              </span>
            </div>
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2">
              <span
                className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-widest splash-logo-express"
                style={{
                  color: 'oklch(0.65 0.1 222)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.15), 0 6px 14px rgba(0,0,0,0.1)'
                }}
              >
                EXPRESS
              </span>
            </div>
            <div className="absolute bottom-0 right-12 sm:right-14 md:right-14 lg:right-20">
              <span className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground drop-shadow-sm tracking-tight italic splash-logo-wall">
                Wall
              </span>
            </div>
          </div>
        </div>

        {/* Bottom content */}
        <div className="pb-8 sm:pb-12 space-y-5 sm:space-y-6 text-center splash-font">
          <p className="text-lg sm:text-base md:text-base lg:text-2xl tracking-widest font-medium text-foreground/90 leading-relaxed space-y-1">
            <span className="block text-primary-foreground uppercase">
              Here, your heart can breathe.
            </span>
            <span className="block text-primary-foreground uppercase">
              Your words are safe,
            </span>
            <span className="block text-primary-foreground uppercase">
              and your feelings are just yours.
            </span>
          </p>

          <div className="pt-2">
            <Button
              onClick={handleStart}
              className="bg-white text-[#3a9dbb] tracking-wider uppercase text-xl sm:text-lg md:text-lg lg:text-xl px-10 sm:px-8 md:px-10 lg:px-12 py-3 rounded-full shadow-md hover:shadow-lg button-glow transition-all duration-300"
            >
              Enter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;