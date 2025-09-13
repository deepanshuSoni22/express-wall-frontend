import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Heart, Wind, Sparkles } from 'lucide-react';

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

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/express');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentContent = onboardingSteps[currentStep];

  return (
    <div className={`min-h-screen ${currentContent.gradient} flex flex-col items-center justify-center p-6 text-center transition-all duration-500`}>
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          {currentContent.icon}
        </div>

        <h2 className="text-3xl font-bold text-primary-foreground mb-4">
          {currentContent.title}
        </h2>

        <p className="text-lg text-primary-foreground/90 mb-12 leading-relaxed">
          {currentContent.description}
        </p>

        <div className="flex justify-center items-center space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-primary-foreground' : 'bg-primary-foreground/30'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            className={`${currentStep === 0 ? 'invisible' : 'visible'} bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button 
            onClick={handleNext}
            className="wellness-button"
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