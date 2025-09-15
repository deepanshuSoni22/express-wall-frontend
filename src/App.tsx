import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/Loading.json";

// Pages
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Express from "./pages/Express";
import Release from "./pages/Release";
import Balance from "./pages/Balance";
import Ending from "./pages/Ending";
import NotFound from "./pages/NotFound";
import GrowthOnboarding from './pages/growth/GrowthOnboarding';
import CoursesPage from './pages/growth/CoursesPage';
import CourseDetailPage from './pages/growth/CourseDetailPage';

// Session Context
import { SessionProvider } from "./contexts/SessionContext";

const queryClient = new QueryClient();

// Route-change loading overlay (1s on initial load and on each navigation)
function RouteChangeLoader() {
  const location = useLocation();
  const [visible, setVisible] = useState(true); // show on first mount
  const timerRef = useRef<number | null>(null);
  const firstRouteRef = useRef(true);
  const DURATION_MS = 1000;

  const skipLoader = location.pathname === '/release' && (location.state as any)?.fromExpress;

  // Initial mount handler
  useEffect(() => {
    if (skipLoader) { setVisible(false); return; }
    timerRef.current = window.setTimeout(() => setVisible(false), DURATION_MS);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route change handler
  useEffect(() => {
    if (firstRouteRef.current) { firstRouteRef.current = false; return; }
    if (skipLoader) { setVisible(false); return; }
    setVisible(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setVisible(false), DURATION_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (skipLoader || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-40 h-40">
        <Lottie
          animationData={loadingAnimation as unknown as object}
          loop
          autoplay
        />
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SessionProvider>
        <BrowserRouter>
          {/* Global 1s loader on mount and on every route change */}
          <RouteChangeLoader />
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/express" element={<Express />} />
            <Route path="/release" element={<Release />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/growth" element={<GrowthOnboarding />} />
            <Route path="/growth/courses" element={<CoursesPage />} />
            <Route path="/growth/:courseId" element={<CourseDetailPage />} />
            <Route path="/ending" element={<Ending />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
