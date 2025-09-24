import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import treesVideo from '@/assets/trees-bg.mp4';
import { authService } from '@/services/authService';
import { handleAuthError } from '@/services/apiClient';
import { useSession } from '@/contexts/SessionContext';

const Register = () => {
  const navigate = useNavigate();
  const { updateSession } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    mobile?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);

  // Validate mobile number format (accepts common formats with optional country codes)
  const isValidMobileNumber = (mobile: string): boolean => {
    // Allow digits, +, spaces, dashes, parentheses
    // This allows formats like: +1 (123) 456-7890, 1234567890, +91 98765 43210
    const mobilePattern = /^[\d\s()+\-]{7,15}$/;
    return mobilePattern.test(mobile);
  };

  const validateForm = (name: string, mobile: string): boolean => {
    const newErrors: {name?: string; mobile?: string} = {};
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Please enter your name";
      isValid = false;
    }

    // Validate mobile number
    if (!mobile.trim()) {
      newErrors.mobile = "Please enter your mobile number";
      isValid = false;
    } else if (!isValidMobileNumber(mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const nameInput = document.getElementById('name') as HTMLInputElement | null;
    const mobileInput = document.getElementById('mobile') as HTMLInputElement | null;

    const name = nameInput?.value.trim() ?? '';
    const mobile = mobileInput?.value.trim() ?? '';

    if (!validateForm(name, mobile)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await authService.register(name, mobile);
      if (result.status === 'success') {
        // Store user data in session context
        if (result.user) {
          updateSession({ user: result.user });
        }
        navigate('/express');
      } else {
        // Handle API error response
        setErrors({
          general: result.error || "Registration failed. Please try again."
        });
      }
    } catch (error) {
      setErrors({
        general: "Connection error. Please check your internet connection and try again."
      });
      handleAuthError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full-viewport w-full relative overflow-hidden">
      {/* Background video */}
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
      
      {/* Subtle overlay to improve text legibility */}
      <div className="absolute inset-0 bg-white/25"></div>

      {/* Content container with fade-in effect and balanced vertical spacing */}
      <div className={`relative z-10 h-full w-full flex flex-col justify-center items-center px-6 py-16 md:py-20 transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="w-full max-w-md mx-auto text-center py-6 md:py-8">
          <h2 className="text-xl sm:text-3xl font-bold text-black mb-3">
            We would love to know you, just a little.
          </h2>
          
          <p className="text-base sm:text-base text-black/90 mb-8">
            This is only so we can stay connected with you when you need us.
          </p>
          
          {/* Registration Form */}
          <form className="space-y-6 text-left">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-md text-sm">
                {errors.general}
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="name" className="block uppercase text-sm sm:text-sm font-semibold text-black">
                NAME
              </label>
              <p className="text-sm sm:text-sm text-black/80 font-semibold">    
                What shall we call you?
              </p>
              <input
                type="text"
                id="name"
                className={`w-full px-4 py-2.5 bg-white/20 border ${errors.name ? 'border-red-500 focus:ring-red-500/40' : 'border-[#3a9dbb] focus:ring-[#3a9dbb]/40'} focus:outline-none focus:ring-2 transition-all text-black placeholder-black/50`}
                placeholder=""
                onChange={() => errors.name && setErrors(prev => ({...prev, name: undefined}))}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="mobile" className="block uppercase text-sm sm:text-sm font-semibold text-black">
                MOBILE NUMBER
              </label>
              <p className="text-base sm:text-sm text-black/80 font-semibold">
                A number where we can reach you with care.
              </p>
              <input
                type="tel"
                id="mobile"
                className={`w-full px-4 py-2.5 bg-white/20 border ${errors.mobile ? 'border-red-500 focus:ring-red-500/40' : 'border-[#3a9dbb] focus:ring-[#3a9dbb]/40'} focus:outline-none focus:ring-2 transition-all text-black placeholder-black/50`}
                placeholder="e.g. +91 98765 43210"
                onChange={() => errors.mobile && setErrors(prev => ({...prev, mobile: undefined}))}
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
              )}
            </div>

            <div className="py-6">
              <p className="text-center uppercase text-base sm:text-sm font-bold mb-3 text-black">
                WE PROMISE!
              </p>
              <p className="text-center text-base sm:text-sm text-black/80 mb-8">
                Your details are safe. Your feelings will never be linked to them.
              </p>
              
              <Button
                onClick={handleContinue}
                disabled={isSubmitting}
                className="clean-button w-full py-4 text-sm sm:text-base font-bold relative"
              >
                <span className="tracking-wide">
                  {isSubmitting ? 'PLEASE WAIT...' : 'STEP INTO MY SPACE'}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;