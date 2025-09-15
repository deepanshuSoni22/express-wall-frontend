import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Heart, Wind, Sparkles } from 'lucide-react';
import whiteCurtainVideo from '@/assets/white-curtain.mp4'; // added

const onboardingSteps = [
  {
    title: "Express Yourself",
    description: "Release your thoughts through writing, speaking, or drawing. This is your safe space.",
    icon: <Heart className="w-16 h-16 text-primary animate-gentle-pulse" />,
    gradient: "bg-gradient-primary"
  },
  {
    title: "Release & Breathe",
    description: "Let go of stress with guided breathing exercises. Feel the tension melt away.",
    icon: <Wind className="w-16 h-16 text-calm animate-breathe" />,
    gradient: "bg-gradient-calm"
  },
  {
    title: "Find Your Balance",
    description: "End with reflection, inspiration, or calming music to restore inner peace.",
    icon: <Sparkles className="w-16 h-16 text-healing animate-floating" />,
    gradient: "bg-gradient-healing"
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Video fallback handling (no structural / color changes)
  const [videoError, setVideoError] = useState(false);
  const [enableVideo, setEnableVideo] = useState(true);

  useEffect(() => {
    // Respect reduced motion
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) setEnableVideo(false);
    } catch {}
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Updated flow: go to Splash (logo) screen before Express
      navigate('/splash');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const currentContent = onboardingSteps[currentStep];

  return (
    <div
      className={`page-shell ${currentContent.gradient} flex flex-col items-center justify-center p-6 text-center transition-all duration-500 relative overflow-hidden`}
    >
      {/* Background video (falls back to existing gradient if error / disabled) */}
      {enableVideo && !videoError && (
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
        >
          <source src={whiteCurtainVideo} type="video/mp4" />
        </video>
      )}

      {/* Content wrapper kept identical (just elevated above video) */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="mb-10">
          {currentContent.icon}
        </div>

        <h2 className="display-section mb-6 text-primary-foreground-dark">
          {currentContent.title}
        </h2>
        <p className="page-subtitle mb-14 text-primary-foreground-dark/90">
          {currentContent.description}
        </p>

        <div className="step-dots mb-10">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`step-dot ${index === currentStep ? 'step-dot-active' : ''}`}
            />
          ))}
        </div>

        <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            className={`${currentStep === 0 ? 'hidden' : ''} w-full sm:w-auto bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 text-base px-6 py-5`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            className={`wellness-button w-full sm:w-auto text-base px-8 py-5 ${currentStep === 0 ? 'sm:ml-auto' : 'sm:ml-6'}`}
          >
            {currentStep === onboardingSteps.length - 1 ? 'Start Session' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;