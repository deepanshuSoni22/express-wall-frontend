import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/contexts/SessionContext';
import { ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { HoldButton } from '@/components/ui/hold-button';
import wallBg from '@/assets/wallBG.jpg';
import { useScrollReset } from '@/hooks/useScrollReset';
import { recommendationService } from '@/services/recommendationService';
import { handleAuthError } from '@/services/apiClient';

interface JournalViewProps {
  onContinue: () => void;
}

export const JournalView = ({ onContinue }: JournalViewProps) => {
  const [content, setContent] = useState('');
  const [showLengthError, setShowLengthError] = useState(false);
  const { updateSession } = useSession();
  
  // Reset scroll position when component mounts
  useScrollReset();

  // Check content length when it changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Show error if user has started typing but content is still too short
    if (newContent.length > 0 && newContent.length < 10) {
      setShowLengthError(true);
    } else {
      setShowLengthError(false);
    }
  };

  const handleContinue = async () => {
    try {
      // Start async recommendation preparation
      await recommendationService.prepareRecommendations(content);
      updateSession({ expressContent: content });
      onContinue();
    } catch (error) {
      handleAuthError(error);
      // Still allow continuation even if prep fails
      updateSession({ expressContent: content });
      onContinue();
    }
  };

  const isContentTooShort = content.trim().length < 10;

  return (
    <div className="page-shell relative overflow-hidden flex flex-col p-6">
      <img src={wallBg} alt="Calming wall background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative max-w-2xl w-full mx-auto flex-1 flex flex-col">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-soft bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100">
            <BookOpen className="w-9 h-9 text-white" />
          </div>
          <h2 className="header-title text-primary-foreground-dark mb-3">Your Express Wall</h2>
          <p className="header-subtitle text-primary-foreground-dark/80">Pour your heart out into words</p>
        </div>

        <div className="flex-1 mb-4">
          <Textarea
            placeholder="Dear wall, today I feel... What's in your heart right now?"
            value={content}
            onChange={handleContentChange}
            autoFocus
            className="
              min-h-[55vh]
              w-full
              bg-transparent
              border-none
              rounded-none
              px-2 sm:px-3
              pt-2
              pb-4
              resize-none
              shadow-none
              text-xl sm:text-2xl md:text-3xl lg:text-4xl
              leading-relaxed
              tracking-wide
              font-medium
              text-foreground/90
              caret-foreground
              placeholder:text-foreground/25 placeholder:italic
              focus-visible:ring-0 focus-visible:outline-none
              selection:bg-primary/25
            "
          />
        </div>
        
        {showLengthError && (
          <div className="mb-6 p-3 bg-red-50/70 border border-red-300/80 rounded text-sm text-red-700 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Please express with at least 10 characters to continue</span>
          </div>
        )}

        <HoldButton 
          onComplete={handleContinue}
          disabled={isContentTooShort}
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">Hold to Release</span>
            <ArrowRight className="w-5 h-5" />
          </span>
        </HoldButton>
      </div>
    </div>
  );
};