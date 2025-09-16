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
    <div className="h-screen w-full app-splash-bg relative overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-80"
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

      {/* Replaced previous contrast/fog/vignette/dimmer with unified mist overlay */}
      <div className="mist-overlay">
        <div className="mist-layer" />
        <div className="mist-film" />
      </div>

      {/* Content container with fixed height and spacing */}
      <div className={`relative h-full w-full flex flex-col px-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Top keywords - fixed position at top */}
        <div className="pt-8 sm:pt-12 pb-4 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="text-foreground text-lg font-bold shadow-sm uppercase">Express</span>
            <span className="text-foreground font-semibold">|</span>
            <span className="text-foreground text-lg font-bold shadow-sm uppercase">Release</span>
            <span className="text-foreground font-semibold">|</span>
            <span className="text-foreground text-lg font-bold shadow-sm uppercase">Balance</span>
          </div>
        </div>

        {/* Logo block - centered in available space */}
        <div className="flex-grow flex items-center justify-center">
          <div className="relative w-64 h-32 md:w-80 md:h-36 mx-auto">
            <div className="absolute top-0 left-3">
              <span className="text-3xl md:text-4xl font-extrabold text-foreground drop-shadow-sm tracking-tight">
                THE
              </span>
            </div>
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2">
              <span
              className="text-5xl md:text-6xl font-extrabold tracking-wider"
              style={{
                color: 'oklch(0.65 0.1 222)',
                textShadow: '0 1px 3px rgba(0,0,0,0.15), 0 6px 14px rgba(0,0,0,0.1)',
              }}
              >
              EXPRESS
              </span>
            </div>
            <div className="absolute bottom-0 right-0">
              <span
                className="text-4xl md:text-5xl font-extrabold text-foreground drop-shadow-sm tracking-tight italic"
                style={{ fontFamily: 'Corinthia' }}
              >
                Wall
              </span>
            </div>
          </div>
        </div>

        {/* Bottom content - fixed position at bottom with spacing */}
        <div className="pb-12 sm:pb-16 space-y-8 text-center">
          {/* Tagline */}
          <p className="text-base sm:text-lg tracking-wider font-medium text-foreground/90 leading-relaxed space-y-1">
            <span className="block font-bold text-primary-foreground uppercase">
              Here, your heart can breathe.
            </span>
            <span className="block font-bold text-primary-foreground uppercase">
              Your words are safe,
            </span>
            <span className="block font-bold text-primary-foreground uppercase">
              and your feelings are just yours.
            </span>
          </p>

          {/* Action button */}
          <div className="pt-2">
            <Button
              onClick={handleStart}
              className="bg-gradient-secondary text-primary-foreground font-bold uppercase text-xl px-12 py-3 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
            >
              Enter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;