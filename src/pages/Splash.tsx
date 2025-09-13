import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeBg from '@/assets/homeBackgroundImage.jpg';

const Splash = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStart = () => navigate('/onboarding');

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center overflow-hidden">
      {/* Background image */}
      <img
        src={homeBg}
        alt="Abstract calming background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />
      {/* Light overlay for consistent contrast */}

      {/* Content block */}
      <div
        className={`relative z-10 w-full max-w-xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Title */}
        <h1
          className="
            font-extrabold tracking-tight text-black
            leading-[0.95]
            text-[2.4rem]
            sm:text-[3rem]
            md:text-[3.5rem]
            lg:text-[4rem]
            xl:text-[4.25rem]
            drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]
            mb-8
          "
        >
          EXPRESS WALL
        </h1>

        {/* Tagline */}
        <p
          className="
            uppercase font-semibold text-black
            tracking-[0.45em]
            text-[0.7rem]
            sm:text-[0.78rem]
            md:text-[0.85rem]
            lg:text-[0.9rem]
            mb-12
          "
        >
          EXPRESS | RELEASE | BALANCE
        </p>

        {/* Description */}
        <div
           className="
            font-medium mx-auto
            text-[#00849B]                // Changed color to match button
            text-[1.15rem]                // Increased font size
            sm:text-[1.25rem]
            md:text-[1.35rem]
            lg:text-[1.5rem]
            leading-relaxed space-y-3
            max-w-[34rem]
            mb-14
            tracking-wide                // Added letter spacing for readability
          "
        >
          <p>Here, your heart can breathe.</p>
            <p>Your words are safe, and</p>
          <p>your feelings are just yours.</p>
        </div>

        {/* ENTER button */}
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            aria-label="Enter"
            className="
              inline-flex items-center justify-center select-none
              rounded-full border border-black/60
              bg-white
              px-12 py-3
              sm:px-14 sm:py-4
              md:px-16 md:py-5
              font-semibold text-[#00849B]
              tracking-[0.55em]
              text-sm
              sm:text-base
              md:text-lg
              shadow-[0_3px_6px_rgba(0,0,0,0.18)]
              transition-all
              hover:shadow-[0_5px_14px_rgba(0,0,0,0.28)]
              hover:border-black
              active:scale-[0.97]
              focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 focus:ring-offset-white
            "
          >
            <span className="translate-x-[0.28em]">ENTER</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Splash;