import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Heart, Wind, Sparkles } from 'lucide-react';
import curtainVideo from '@/assets/white-curtain.mp4'; // NEW import

const onboardingSteps = [
  {
    title: "Express Yourself",
    description: "Release your thoughts through writing, speaking, or drawing. This is your safe space.",
    icon: <Heart className="w-16 h-16 text-primary animate-gentle-pulse" />,
  },
  {
    title: "Release & Breathe",
    description: "Let go of stress with guided breathing exercises. Feel the tension melt away.",
    icon: <Wind className="w-16 h-16 text-calm animate-breathe" />,
  },
  {
    title: "Find Your Balance",
    description: "End with reflection, inspiration, or calming music to restore inner peace.",
    icon: <Sparkles className="w-16 h-16 text-healing animate-floating" />,
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/express');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const currentContent = onboardingSteps[currentStep];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={curtainVideo} type="video/mp4" />
      </video>

      {/* Light greyish overlay */}
      <div className="absolute inset-0 bg-white/35 backdrop-blur-[2px]" />

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-md mx-auto transition-all duration-500"
        key={currentStep}
      >
        <div className="mb-10 flex justify-center">
          <div className="p-6 rounded-3xl bg-white/55 shadow-lg backdrop-blur-sm">
            {currentContent.icon}
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mb-6">
          {currentContent.title}
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-black/80 mb-10 leading-relaxed font-medium">
          {currentContent.description}
        </p>

        <div className="flex justify-center items-center space-x-3 mb-10">
          {onboardingSteps.map((_, index) => (
            <span
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-black/80'
                  : 'w-2 bg-black/30'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            className={`${currentStep === 0 ? 'invisible' : 'visible'} bg-white/60 border-black/20 text-black hover:bg-white/80`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

            <Button
              onClick={handleNext}
              className="rounded-full px-8 py-5 font-semibold tracking-wide bg-black text-white hover:bg-black/90"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Start Session' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;