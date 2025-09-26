import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
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

// Define interface for recommendation response
interface RecommendationResponse {
  status: string;
  recommendations?: BackendCourse[];
  analysis?: any;
  is_new?: boolean;
  source?: 'cache' | 'generated' | 'history';
  input_text?: string;
}

const CoursesPage = () => {
  const navigate = useNavigate();
  const { sessionData } = useSession();
  const [courses, setCourses] = useState<BackendCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<{
    isNew: boolean;
    source: string;
    inputText?: string;
  } | null>(null);
  
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
        // Get recommendations directly using POST method with user input
        const result: RecommendationResponse = await recommendationService.getRecommendations(sessionData.expressContent);
        if (result.status === 'success') {
          setCourses(result.recommendations || []);
          // Set cache status for UI indicators
          setCacheStatus({
            isNew: result.is_new ?? false,
            source: result.source || 'unknown',
            inputText: result.input_text
          });
        }
        setLoading(false);
      }
    } catch (error) {
      handleAuthError(error as Error);
      // No fallback to static data - show empty state instead
      setCourses([]);
      setCacheStatus(null);
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
          
          const result: RecommendationResponse = await recommendationService.getRecommendations(sessionData.expressContent);
          if (result.status === 'success') {
            setCourses(result.recommendations || []);
            // Set cache status for UI indicators
            setCacheStatus({
              isNew: result.is_new ?? false,
              source: result.source || 'unknown',
              inputText: result.input_text
            });
          }
          setLoading(false);
        }
      } catch (error) {
        handleAuthError(error as Error);
        clearInterval(pollInterval);
        setIsPolling(false);
        setCourses([]);
        setCacheStatus(null);
        setLoading(false);
      }
    }, 2000);

    // Timeout after 30 seconds
    setTimeout(() => {
      clearInterval(pollInterval);
      setIsPolling(false);
      if (loading) {
        setCourses([]);
        setCacheStatus(null);
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="display-section text-black text-3xl sm:text-5xl font-extrabold">Modules</h1>
              <Button
                onClick={() => navigate('/growth')}
                className="clean-button px-6 py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            </div>

            {/* Cache Status Indicator */}
            {cacheStatus && (
              <div className="mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  cacheStatus.isNew 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {cacheStatus.isNew ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Fresh recommendations based on your expression
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      Previous recommendations for similar expression
                    </>
                  )}
                </div>
              </div>
            )}

            <p className="page-subtitle text-black/90 max-w-2xl mb-12 font-medium">
              {cacheStatus?.isNew 
                ? "Here are personalized modules based on your current emotional expression."
                : "Here are modules we've previously curated for similar expressions."
              }
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
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Title at top when no image */}
                      <h3 className="font-semibold text-xl text-gray-900 mb-4">{course.title}</h3>
                      
                      <p className="text-sm text-gray-700 mb-4 line-clamp-4 leading-relaxed flex-1">
                        {course.description}
                      </p>

                      {/* Reason for recommendation if available */}
                      {course.reason && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-700 font-medium mb-1">Why this might help:</p>
                          <p className="text-xs text-blue-600">{course.reason}</p>
                        </div>
                      )}

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
