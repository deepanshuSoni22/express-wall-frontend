import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import treesVideo from '@/assets/trees-bg.mp4';

const Register = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const nameInput = document.getElementById('name') as HTMLInputElement | null;
    const mobileInput = document.getElementById('mobile') as HTMLInputElement | null;

    const name = nameInput?.value.trim() ?? '';
    const number = mobileInput?.value.trim() ?? '';

    console.log(`name: ${name}`);
    console.log(`number: ${number}`);

    navigate('/express');
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
                className="w-full px-4 py-2.5 bg-white/20 border border-[#3a9dbb] focus:outline-none focus:ring-2 focus:ring-[#3a9dbb]/40 transition-all text-black placeholder-black/50"
                placeholder=""
              />
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
                className="w-full px-4 py-2.5 bg-white/20 border border-[#3a9dbb] focus:outline-none focus:ring-2 focus:ring-[#3a9dbb]/40 transition-all text-black placeholder-black/50"
                placeholder=""
              />
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
                className="clean-button w-full py-4 text-sm sm:text-base font-bold"
              >
                <span className="tracking-wide">STEP INTO MY SPACE</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;