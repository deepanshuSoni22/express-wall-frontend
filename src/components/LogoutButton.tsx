import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

export const LogoutButton = () => {
  const { resetSession } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      resetSession(); // Clear session context
      navigate('/register');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      className="text-muted-foreground hover:text-foreground"
    >
      Sign Out
    </Button>
  );
};