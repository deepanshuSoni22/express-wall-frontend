import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import treesVideo from '@/assets/trees-bg.mp4';

const Splash = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);

  const handleStart = () => navigate('/onboarding');

  return (
    <div className="min-h-screen app-splash-bg relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={treesVideo} type="video/mp4" />
        Your browser does not support the background video.
      </video>

      {/* Stronger readability overlay (warm subtle gradient + light blur) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF4E680] via-[#FADADD80] to-[#EAD9F580]" />

      <div
        className={`relative max-w-xl w-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } flex flex-col items-center`}
      >
        {/* Top keywords */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-foreground text-lg font-bold shadow-sm uppercase">
            Express
          </span>
          <span className="text-foreground font-semibold">|</span>
          <span className="text-foreground text-lg font-bold shadow-sm uppercase">
            Release
          </span>
          <span className="text-foreground font-semibold">|</span>
            <span className="text-foreground text-lg font-bold shadow-sm uppercase">
            Balance
          </span>
        </div>

        {/* Logo structure with The/Express/Wall as a cohesive unit */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-64 h-32 md:w-80 md:h-36 mx-auto">
            {/* First row - THE (left aligned) */}
            <div className="absolute top-0 left-3">
              <span className="text-3xl md:text-4xl font-extrabold text-foreground drop-shadow-sm tracking-tight">
                THE
              </span>
            </div>
            
            {/* Second row - EXPRESS (center aligned) */}
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2">
              <span
              className="text-5xl md:text-6xl font-extrabold text-primary tracking-wider"
              style={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.55), 0 6px 14px rgba(0,0,0,0.35)'
              }}
              >
              EXPRESS
              </span>
            </div>
            
            {/* Third row - WALL (right aligned) */}
            <div className="absolute bottom-0 right-0">
              <span className="text-4xl md:text-5xl font-extrabold text-foreground drop-shadow-sm tracking-tight italic" style={{ fontFamily: 'Corinthia' }}>
                Wall
              </span>
            </div>
          </div>
        </div>

        <p className="text-lg font-medium text-foreground/90 mb-8 leading-relaxed">
          <span className="block font-bold tracking-wide text-primary-foreground uppercase">
            Here, your heart can breathe.
          </span>
          <span className="block font-bold text-primary-foreground uppercase">
            Your words are safe,
          </span>
          <span className="block font-bold text-primary-foreground uppercase">
            and your feelings are just yours.
          </span>
        </p>

        <Button
          onClick={handleStart}
          className="clean-button text-primary bg-white font-bold uppercase text-xl px-12 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          Enter
        </Button>
      </div>
    </div>
  );
};

export default Splash;