import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useScrollReset } from '@/hooks/useScrollReset';
import whiteCurtainVideo from '@/assets/white-curtain.mp4';
import { useState, useEffect } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { recommendationService } from '@/services/recommendationService';
import { handleAuthError } from '@/services/apiClient';

// Define interface for backend course recommendations
interface BackendCourse {
  id: string | number;
  title: string;
  description: string;
  tags?: string[];
  confidence?: number;
  reason?: string;
}

const CoursesPage = () => {
  const navigate = useNavigate();
  const { sessionData } = useSession();
  const [courses, setCourses] = useState<BackendCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  
  useScrollReset();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      // Check if we have async recommendations in progress
      const statusResult = await recommendationService.getRecommendationStatus();
      
      if (statusResult.task_status === 'processing') {
        setIsPolling(true);
        pollForRecommendations();
      } else {
        // Get recommendations directly
        const result = await recommendationService.getRecommendations(sessionData.expressContent);
        if (result.status === 'success') {
          setCourses(result.recommendations || []);
        }
        setLoading(false);
      }
    } catch (error) {
      handleAuthError(error);
      // No fallback to static data - show empty state instead
      setCourses([]);
      setLoading(false);
    }
  };

  const pollForRecommendations = async () => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResult = await recommendationService.getRecommendationStatus();
        
        if (statusResult.task_status === 'completed') {
          clearInterval(pollInterval);
          setIsPolling(false);
          
          const result = await recommendationService.getRecommendations(sessionData.expressContent);
          if (result.status === 'success') {
            setCourses(result.recommendations || []);
          }
          setLoading(false);
        }
      } catch (error) {
        handleAuthError(error);
        clearInterval(pollInterval);
        setIsPolling(false);
        setCourses([]);
        setLoading(false);
      }
    }, 2000);

    // Timeout after 30 seconds
    setTimeout(() => {
      clearInterval(pollInterval);
      setIsPolling(false);
      if (loading) {
        setCourses([]);
        setLoading(false);
      }
    }, 30000);
  };

  if (loading || isPolling) {
    return (
      <div className="page-with-video">
        <video
          className="page-video-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={whiteCurtainVideo} type="video/mp4" />
        </video>
        <div className="page-inner relative z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary-foreground-dark">
              {isPolling ? 'Personalizing your recommendations...' : 'Loading courses...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-with-video">
      <video
        className="page-video-bg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={whiteCurtainVideo} type="video/mp4" />
      </video>

      <div className="page-inner relative z-10">
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h1 className="display-section text-black text-3xl sm:text-5xl font-extrabold">Modules</h1>
              <Button
                onClick={() => navigate('/growth')}
                className="clean-button px-6 py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            </div>
            <p className="page-subtitle text-black/90 max-w-2xl mb-12 font-medium">
              Explore these modules that might help you on your wellness journey.
            </p>

            {courses.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-black/70 text-lg mb-4">No modules available at the moment.</p>
                <p className="text-black/50 text-sm">Please try again or contact support.</p>
              </div>
            ) : (
              <div className="grid gap-10 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                {courses.map(course => (
                  <div
                    key={course.id}
                    className="group rounded-3xl overflow-hidden bg-white shadow-soft hover:shadow-glow transition-gentle flex flex-col border border-border"
                  >
                    {/* Image Block - Commented out for future use when backend provides images
                    <div className="relative h-72 w-full overflow-hidden md:h-80 xl:h-72">
                      <img
                        src={course.image || '/placeholder-course.jpg'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-5 right-5">
                        <h3 className="font-semibold text-xl text-white drop-shadow mb-1">{course.title}</h3>
                      </div>
                    </div>
                    */}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Title at top when no image */}
                      <h3 className="font-semibold text-xl text-gray-900 mb-4">{course.title}</h3>
                      
                      <p className="text-sm text-gray-700 mb-4 line-clamp-4 leading-relaxed flex-1">
                        {course.description}
                      </p>

                      {/* Tags */}
                      {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {course.tags.slice(0,3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 rounded-full text-[11px] bg-primary/10 text-primary font-semibold border border-primary/25"
                            >
                              {tag}
                            </span>
                          ))}
                          {course.tags.length > 3 && (
                            <span className="px-2 py-1 rounded-full text-[11px] bg-primary/10 text-primary font-medium border border-primary/20">
                              +{course.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
