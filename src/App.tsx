import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useIsFetching } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import Lottie from 'lottie-react';
import loadingAnimation from './assets/Loading.json';
import { authService } from './services/authService';
import { handleAuthError } from '@/services/apiClient';

// Lazy load Lottie component for performance
const LottieAnimation = lazy(() => import('./components/LottieAnimation'));

// Pages (lazy for code-splitting)
const Home = lazy(() => import("./pages/Home"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Register = lazy(() => import("./pages/Register"));
const Express = lazy(() => import("./pages/Express"));
const Release = lazy(() => import("./pages/Release"));
const Rebuild = lazy(() => import("./pages/Rebuild"));
const Ending = lazy(() => import("./pages/Ending"));
const NotFound = lazy(() => import("./pages/NotFound"));
const GrowthOnboarding = lazy(() => import('./pages/growth/GrowthOnboarding'));
const CoursesPage = lazy(() => import('./pages/growth/CoursesPage'));
import { ScrollToTop } from './components/ScrollToTop';

// Session Context
import { SessionProvider } from "./contexts/SessionContext";

const queryClient = new QueryClient();

// Reusable overlay
function LoaderOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-32 h-32"> {/* Adjust size as needed */}
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
}

// Add session check component
function SessionChecker({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const result = await authService.checkSession();
      setIsAuthenticated(result.authenticated);
    } catch (error) {
      // For session check, don't redirect immediately - just set as not authenticated
      console.error('Session check failed:', error);
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return <LoaderOverlay />;
  }

  return <>{children}</>;
}

// Show overlay only for real loading (queries in-flight), with debounce and min visible duration
function GlobalLoader() {
  const isFetching = useIsFetching();
  const location = useLocation();

  // Preserve original skip logic
  const skipLoader = location.pathname === '/release' && (location.state as any)?.fromExpress;

  const SHOW_DELAY_MS = 120; // debounce to avoid flash
  const MIN_VISIBLE_MS = 250; // keep visible briefly to avoid jitter

  const [visible, setVisible] = useState(false);
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const shownAtRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (showTimer.current) window.clearTimeout(showTimer.current);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    if (skipLoader) {
      if (showTimer.current) { window.clearTimeout(showTimer.current); showTimer.current = null; }
      if (hideTimer.current) { window.clearTimeout(hideTimer.current); hideTimer.current = null; }
      setVisible(false);
      return;
    }

    if (isFetching > 0) {
      if (hideTimer.current) { window.clearTimeout(hideTimer.current); hideTimer.current = null; }
      if (visible) return; // already visible
      if (showTimer.current) return; // already scheduled
      showTimer.current = window.setTimeout(() => {
        shownAtRef.current = Date.now();
        setVisible(true);
        showTimer.current = null;
      }, SHOW_DELAY_MS);
    } else {
      if (showTimer.current) { window.clearTimeout(showTimer.current); showTimer.current = null; }
      if (!visible) return; // nothing to hide
      const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : MIN_VISIBLE_MS;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => {
        setVisible(false);
        hideTimer.current = null;
      }, remaining);
    }
  }, [isFetching, skipLoader, visible]);

  if (!visible) return null;
  return <LoaderOverlay />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SessionProvider>
        <SessionChecker>
          <BrowserRouter>
            <ScrollToTop />
            {/* Global loader driven by real network activity */}
            <GlobalLoader />
            {/* Suspense fallback shows overlay only while route chunks load */}
            <Suspense fallback={<LoaderOverlay />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/register" element={<Register />} />
                <Route path="/express" element={<Express />} />
                <Route path="/release" element={<Release />} />
                <Route path="/rebuild" element={<Rebuild />} />
                <Route path="/growth" element={<GrowthOnboarding />} />
                <Route path="/growth/courses" element={<CoursesPage />} />
                <Route path="/ending" element={<Ending />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SessionChecker>
        <Toaster />
      </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
