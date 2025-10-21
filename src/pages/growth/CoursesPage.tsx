import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Sparkles, Tag, BookOpen, Layers, TrendingUp } from 'lucide-react';
import { useScrollReset } from '@/hooks/useScrollReset';
import whiteCurtainVideo from '@/assets/white-curtain.mp4';
import { useState, useEffect } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { recommendationService } from '@/services/recommendationService';
import { handleAuthError } from '@/services/apiClient';
import type { RecommendedSession } from '@/types';

// Define interface for recommendation response
interface RecommendationResponse {
  status: string;
  recommendations?: RecommendedSession[];  // Changed from 'sessions' to 'recommendations'
  analysis?: any;
  is_new?: boolean;
  source?: 'cache' | 'generated' | 'history';
  input_text?: string;
  user?: any;
}

const CoursesPage = () => {
  const navigate = useNavigate();
  const { sessionData } = useSession();
  const [sessions, setSessions] = useState<RecommendedSession[]>([]);
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
        console.log('📊 Recommendations Response:', result);
        console.log('📊 First Recommendation:', result.recommendations?.[0]);
        
        if (result.status === 'success') {
          setSessions(result.recommendations || []);  // Changed from result.sessions to result.recommendations
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
      console.error('❌ Failed to load recommendations:', error);
      handleAuthError(error as Error);
      setSessions([]);
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
            setSessions(result.recommendations || []);  // Changed from result.sessions to result.recommendations
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
        setSessions([]);
        setCacheStatus(null);
        setLoading(false);
      }
    }, 2000);

    // Timeout after 30 seconds
    setTimeout(() => {
      clearInterval(pollInterval);
      setIsPolling(false);
      if (loading) {
        setSessions([]);
        setCacheStatus(null);
        setLoading(false);
      }
    }, 30000);
  };

  const handleSessionClick = (sessionId: number) => {
    navigate(`/growth/session/${sessionId}`);
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
              {isPolling ? 'Personalizing your recommendations...' : 'Loading sessions...'}
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
              <h1 className="display-section text-black text-3xl sm:text-5xl font-extrabold">Recommended Sessions</h1>
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
                ? "Here are personalized sessions based on your current emotional expression."
                : "Here are sessions we've previously curated for similar expressions."
              }
            </p>

            {sessions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-black/70 text-lg mb-4">No sessions available at the moment.</p>
                <p className="text-black/50 text-sm">Please try again or contact support.</p>
              </div>
            ) : (
              <div className="grid gap-8 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                {sessions.map((rec: any) => (
                  <div
                    key={rec.session_id}
                    onClick={() => handleSessionClick(rec.session_id)}
                    className="group rounded-3xl overflow-hidden bg-white shadow-soft hover:shadow-glow transition-all duration-300 flex flex-col border border-border cursor-pointer hover:scale-105 hover:border-primary/50"
                  >
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Match Score Badge */}
                      {rec.confidence !== undefined && rec.confidence !== null && (
                        <div className="flex justify-end mb-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-xs font-bold text-green-700">
                              {Math.round(rec.confidence * 100)}% Match
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Session Name */}
                      <h3 className="font-bold text-2xl text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        {rec.session_name}
                      </h3>
                      
                      {/* Session Description */}
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed flex-1">
                        {rec.session_description}
                      </p>

                      {/* Module & Course Info */}
                      {rec.module && rec.course && (
                        <div className="space-y-2 mb-4 p-3 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-lg border border-blue-100/50">
                          <div className="flex items-center gap-2 text-xs">
                            <Layers className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                            <span className="font-semibold text-gray-700">Module:</span>
                            <span className="text-gray-900 font-medium">{rec.module.module_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <BookOpen className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <span className="font-semibold text-gray-700">Course:</span>
                            <span className="text-gray-900 font-medium">{rec.course.course_name}</span>
                          </div>
                        </div>
                      )}

                      {/* Reason for recommendation */}
                      {rec.reason && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-700 font-semibold mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Why this might help:
                          </p>
                          <p className="text-xs text-blue-600 leading-relaxed">{rec.reason}</p>
                        </div>
                      )}

                      {/* Tags */}
                      {rec.tags && rec.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-100">
                          {rec.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] bg-primary/10 text-primary font-semibold border border-primary/25"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                          {rec.tags.length > 3 && (
                            <span className="px-2 py-1 rounded-full text-[11px] bg-primary/10 text-primary font-medium border border-primary/20">
                              +{rec.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Click indicator */}
                    <div className="px-6 pb-4">
                      <div className="text-xs text-primary font-medium group-hover:underline flex items-center gap-1">
                        View Full Details
                        <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </div>
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
