import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// Adjust the extension (.jpg / .png / .webp) to match the actual file
import wallBg from '@/assets/wallBG.jpg';

const Ending = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);

  const goToWall = () => {
    navigate('/express');
  };

  const endSession = () => {
    navigate('/');
  };

  return (
    <div
      className="min-h-full-viewport relative flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${wallBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`relative text-center max-w-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide mb-10 uppercase drop-shadow-lg">
          your wall is always here
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Button
            onClick={goToWall}
            className="wellness-button text-base font-semibold px-8 py-6"
          >
            Go to My Wall
          </Button>
          <Button
            onClick={endSession}
            className="wellness-button text-base font-semibold px-8 py-6"
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Ending;