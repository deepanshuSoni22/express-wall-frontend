import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag, BookOpen, Layers, Clock } from 'lucide-react';
import { useScrollReset } from '@/hooks/useScrollReset';
import whiteCurtainVideo from '@/assets/white-curtain.mp4';
import { recommendationService } from '@/services/recommendationService';
import { handleAuthError } from '@/services/apiClient';
import type { Session } from '@/types';

const SessionDetailPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useScrollReset();

  useEffect(() => {
    loadSessionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const loadSessionDetails = async () => {
    if (!sessionId) {
      setError('Session ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await recommendationService.getSessionById(sessionId);
      console.log('📊 Full API Response:', response);
      
      // API returns { session: {...}, status: "success" }
      // Extract the actual session data from the wrapper
      const sessionData = response.session || response;
      
      console.log('📊 Session Data:', sessionData);
      console.log('📊 Session Data Keys:', Object.keys(sessionData));
      setSession(sessionData);
    } catch (err) {
      console.error('Failed to load session:', err);
      setError('Failed to load session details. Please try again.');
      handleAuthError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
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
            <p className="text-primary-foreground-dark">Loading session details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
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
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-border">
              <p className="text-red-600 text-lg mb-4">{error || 'Session not found'}</p>
              <Button
                onClick={() => navigate('/growth/courses')}
                className="clean-button px-6 py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sessions
              </Button>
            </div>
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => navigate('/growth/courses')}
              className="clean-button px-6 py-3 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sessions
            </Button>

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-border">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {(session as any).session_name}
              </h1>

              {/* Tags */}
              {(session as any).tags && (session as any).tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {(session as any).tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm bg-primary/10 text-primary font-semibold border border-primary/25"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                {/* Module Info */}
                {(session as any).module && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">MODULE</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {(session as any).module.module_name}
                      </p>
                      {(session as any).module.module_description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {(session as any).module.module_description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Course Info */}
                {(session as any).course && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">COURSE</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {(session as any).course.course_name}
                      </p>
                      {(session as any).course.course_description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {(session as any).course.course_description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-border mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full"></span>
              Session Overview
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {(session as any).session_description}
              </p>
            </div>
          </div>

          {/* Learning Path Context */}
          {(session as any).course && (session as any).module && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-soft border border-blue-100 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" />
                Learning Path
              </h2>
              
              <div className="space-y-4">
                {/* Course Level */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Course</p>
                    <p className="text-lg font-bold text-gray-900">{(session as any).course.course_name}</p>
                    {(session as any).course.course_description && (
                      <p className="text-sm text-gray-600 mt-1">{(session as any).course.course_description}</p>
                    )}
                  </div>
                </div>

                <div className="ml-4 border-l-2 border-blue-300 h-6"></div>

                {/* Module Level */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Module</p>
                    <p className="text-lg font-bold text-gray-900">{(session as any).module.module_name}</p>
                    {(session as any).module.module_description && (
                      <p className="text-sm text-gray-600 mt-1">{(session as any).module.module_description}</p>
                    )}
                  </div>
                </div>

                <div className="ml-4 border-l-2 border-purple-300 h-6"></div>

                {/* Session Level */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Session (Current)</p>
                    <p className="text-lg font-bold text-primary">{(session as any).session_name}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          {((session as any).created_at || (session as any).updated_at) && (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-soft border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {(session as any).created_at && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Created:</span>
                    <span>{formatDate((session as any).created_at)}</span>
                  </div>
                )}
                {(session as any).updated_at && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Last Updated:</span>
                    <span>{formatDate((session as any).updated_at)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/growth/courses')}
              className="clean-button px-8 py-4 text-base"
              variant="outline"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> View All Sessions
            </Button>
            <Button
              onClick={() => navigate('/growth')}
              className="clean-button px-8 py-4 text-base"
            >
              Back to Growth Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailPage;