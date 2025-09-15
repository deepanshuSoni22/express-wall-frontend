import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import treesVideo from '@/assets/trees-bg.mp4';

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Reuse Splash video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={treesVideo} type="video/mp4" />
      </video>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF4E680] via-[#FADADD80] to-[#EAD9F580]" />

      {/* Content (fade-in like Splash) */}
      <div
        className={`relative max-w-xl w-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="font-extrabold tracking-tight text-5xl md:text-6xl mb-4">
          The Express Wall
        </h1>
        <p className="text-lg md:text-lg font-bold text-foreground/90 mb-8 leading-relaxed">
          A quiet, private space to let feelings out,
          breathe them through,
          and return to balance.
        </p>
        <Button
          onClick={() => navigate('/onboarding')}
            className="wellness-button text-base md:text-lg px-10 py-4 font-semibold focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Begin
        </Button>
      </div>
    </div>
  );
};

export default Home;