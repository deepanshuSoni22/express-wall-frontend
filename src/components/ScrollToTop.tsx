import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    // If the route has a hash, we want to scroll to that element
    // Otherwise, scroll to top
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // In all other cases, scroll to top with a slight delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' instead of 'auto' for more consistent behavior
      });
      
      // Also reset any scrollable containers that might exist in the app
      document.querySelectorAll('.scrollable-container').forEach(container => {
        if (container instanceof HTMLElement) {
          container.scrollTop = 0;
        }
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname, hash, state]); // Also trigger on state changes, which can happen during navigation

  return null;
};