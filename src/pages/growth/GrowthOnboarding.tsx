import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Leaf } from 'lucide-react';
import whiteCurtainVideo from '@/assets/white-curtain.mp4';
import { useEffect, useState } from 'react';

const GrowthOnboarding = () => {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);
  const [enableVideo, setEnableVideo] = useState(true);

  useEffect(() => {
    try { const mq = window.matchMedia('(prefers-reduced-motion: reduce)'); if (mq.matches) setEnableVideo(false); } catch {}
  }, []);

  const handleContinue = () => {
    window.scrollTo(0, 0); // Ensure scroll position reset
    navigate('/growth/courses');
  };

  return (
    <div className={`page-shell bg-gradient-healing flex flex-col items-center justify-center p-6 text-center relative overflow-hidden`}>
      {enableVideo && !videoError && (
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay muted loop playsInline preload="auto" onError={() => setVideoError(true)}
        >
          <source src={whiteCurtainVideo} type="video/mp4" />
        </video>
      )}
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-10 flex items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-300 via-purple-200 to-purple-100 flex items-center justify-center shadow-soft">
            <Sparkles className="w-10 h-10 text-white animate-gentle-pulse" />
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-300 via-emerald-200 to-emerald-100 hidden sm:flex items-center justify-center shadow-soft">
            <Leaf className="w-10 h-10 text-white animate-floating" />
          </div>
        </div>
        <h2 className="display-section mb-6 text-primary-foreground-dark">Growth Zone</h2>
        <div className="space-y-6 mb-14">
          <p className="page-subtitle text-primary-foreground-dark/90 font-semibold">Where your journey shifts from release to renewal.</p>
          <p className="page-subtitle text-primary-foreground-dark/90">Growth Zone offers you guided modules that support your journey of self-work and growth. Each module is a step forward, crafted thoughtfully with stories, tools, and practices that gently guide you toward inner balance and resilience.</p>
          <p className="page-subtitle text-primary-foreground-dark/90">Choose the modules that speak to you, add them to your cart, and begin your journey at your own pace.</p>
          <p className="page-subtitle text-primary-foreground-dark/90 font-semibold">This is your space to grow - one step, one choice, one module at a time.</p>
        </div>
        <Button onClick={handleContinue} className="clean-button px-10 py-5 mx-4 text-base">
          Explore Modules
        </Button>
        <Button
          onClick={() => navigate('/ending')}
          className="clean-button px-10 py-5 text-base mt-4"
          variant="outline"
        >
          End Session
        </Button>
      </div>
    </div>
  );
};

export default GrowthOnboarding;
