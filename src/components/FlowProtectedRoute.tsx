import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';

// Define the application flow sequence
const appFlow = [
  '/express',
  '/release',
  '/rebuild',
  '/growth',
  '/growth/courses',
  '/ending'
];

// Initial route that all users have access to
const publicRoutes = ['/', '/onboarding', '/register'];

export const FlowProtectedRoute = ({ stage }: { stage: number }) => {
  const { sessionData } = useSession();
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if user is authenticated first
  if (!sessionData.user) {
    // Redirect to registration if not authenticated
    return <Navigate to="/register" replace />;
  }

  // Define what the user's current allowed stage is based on their progress
  let userMaxAllowedStage = 0; // Default to first stage (express)

  // Update allowed stage based on session data
  if (sessionData.expressChoice) userMaxAllowedStage = Math.max(userMaxAllowedStage, 1); // release
  if (sessionData.releaseChoice) userMaxAllowedStage = Math.max(userMaxAllowedStage, 2); // rebuild
  if (sessionData.rebuildChoice) userMaxAllowedStage = Math.max(userMaxAllowedStage, 3); // growth
  
  // Allow access to Ending page from Growth section
  // If currently in a growth page or has reached growth stage, allow ending page
  if (currentPath.startsWith('/growth') || userMaxAllowedStage >= 3) {
    userMaxAllowedStage = Math.max(userMaxAllowedStage, 4); // ending
  }
  
  // If trying to access a stage beyond what's allowed
  if (stage > userMaxAllowedStage) {
    // Redirect to their current allowed stage
    return <Navigate to={appFlow[userMaxAllowedStage]} replace />;
  }
  
  // Allow access to this stage and any stages below it
  return <Outlet />;
};