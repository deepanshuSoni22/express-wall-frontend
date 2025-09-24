import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';

export const ProtectedRoute = () => {
  const { sessionData } = useSession();
  
  // Check if user is authenticated
  if (!sessionData.user) {
    // Redirect to registration if not authenticated
    return <Navigate to="/register" replace />;
  }
  
  // Render the child routes
  return <Outlet />;
};