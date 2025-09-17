import { useEffect } from 'react';

/**
 * A custom hook that resets scroll position to top when a component is mounted
 * @param dependencies - Optional array of dependencies that will trigger a scroll reset when changed
 */
export const useScrollReset = (dependencies: any[] = []) => {
  useEffect(() => {
    // Reset scroll position to top with a slight delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' instead of 'auto' for more consistent behavior
      });
      
      // Also reset any scrollable containers that might exist in the component
      document.querySelectorAll('.scrollable-container').forEach(container => {
        if (container instanceof HTMLElement) {
          container.scrollTop = 0;
        }
      });
    }, 10);

    return () => clearTimeout(timeoutId);
  }, dependencies); // Re-run when dependencies change
};