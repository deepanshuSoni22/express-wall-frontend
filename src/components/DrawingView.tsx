import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Paintbrush, Eraser, ArrowRight, RotateCcw, ChevronRight, ChevronDown } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { HoldButton } from '@/components/ui/hold-button';
import wallBg from '@/assets/wallBG.jpg';
import { useScrollReset } from '@/hooks/useScrollReset';

interface DrawingViewProps {
  onContinue: () => void;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#F8C291', '#A8E6CF'
];

export const DrawingView = ({ onContinue }: DrawingViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [brushSize, setBrushSize] = useState<number>(6);
  const [showMobileHint, setShowMobileHint] = useState(true);
  const { updateSession } = useSession();
  
  // Reset scroll position when component mounts
  useScrollReset();

  // Compute responsive canvas size and scale for DPI
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    // Desired CSS size
    const width = container.clientWidth; // fill container width
    // Height: generous drawing space depending on viewport
    const targetVh = window.innerWidth < 640 ? 60 : 65; // mobile 60vh, desktop 65vh
    const height = Math.min(Math.round((targetVh / 100) * window.innerHeight), 720);

    // Preserve existing drawing by snapshot before resize
    let snapshot: string | null = null;
    if (canvas.width && canvas.height) {
      try { snapshot = canvas.toDataURL(); } catch { snapshot = null; }
    }

    // Apply CSS size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Set actual pixel size and scale context
    const pxWidth = Math.floor(width * dpr);
    const pxHeight = Math.floor(height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset backing store size
    canvas.width = pxWidth;
    canvas.height = pxHeight;

    // Reset transform then scale to map 1 unit = 1 CSS pixel
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Paint background and restore snapshot scaled to new size
    // Change from solid white to transparent
    ctx.clearRect(0, 0, width, height);

    if (snapshot) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = snapshot;
    }

    // Set common stroke styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  useEffect(() => {
    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasDrawn) setShowMobileHint(false);
  }, [hasDrawn]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) setShowMobileHint(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture?.(e.pointerId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(x, y);

    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    e.preventDefault();
  };

  const endStroke = (e?: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    if (e) e.preventDefault();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const handleContinue = () => {
    updateSession({ expressContent: 'Drawing created' });
    onContinue();
  };

  const brushSizes = [3, 6, 10, 16];

  return (
    <div className="page-shell relative overflow-hidden flex flex-col min-h-screen">
      <img src={wallBg} alt="Calming wall background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="mx-auto w-full max-w-3xl flex-1 flex flex-col p-4 sm:p-6 relative" ref={containerRef}>
        <div className="text-center mb-6 sm:mb-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-soft bg-gradient-to-br from-indigo-300 via-indigo-200 to-indigo-100">
            <Paintbrush className="w-9 h-9 text-white" />
          </div>
          <h2 className="header-title text-primary-foreground-dark mb-3">Drawing Wall</h2>
          <p className="header-subtitle text-primary-foreground-dark/80 text-sm sm:text-base">Sketch what your heart can't say</p>
        </div>

        {/* Toolbar */}
        <div className="wellness-card mb-3 sm:mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Right-side tools (appear first on mobile) */}
          <div className="order-1 sm:order-none flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              {brushSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => { setBrushSize(size); setIsEraser(false); }}
                  className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all ${
                    brushSize === size && !isEraser ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'
                  }`}
                  title={`Brush ${size}px`}
                >
                  <span
                    className="block rounded-full bg-current"
                    style={{ width: Math.max(4, size / 2), height: Math.max(4, size / 2) }}
                  />
                </button>
              ))}
            </div>

            <Button
              onClick={() => setIsEraser((v) => !v)}
              variant={isEraser ? 'default' : 'outline'}
              size="sm"
              className={`${isEraser ? '' : 'bg-background'} min-w-[40px] sm:min-w-[44px]`}
              title="Toggle eraser"
              aria-label="Toggle eraser"
            >
              <Eraser className="w-4 h-4" />
            </Button>

            <Button onClick={clearCanvas} variant="outline" size="sm">
              {/* Icon only on mobile to save space */}
              <RotateCcw className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>

          {/* Color palette */}
          <div className="order-2 sm:order-none w-full sm:w-auto">
            <div className="relative">
              {/* Mobile: scrollable with arrow hint */}
              <div className="flex sm:hidden overflow-x-auto overflow-y-hidden -mx-1 px-1 scrollbar-hide">
                <div className="flex items-center gap-2 sm:gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => { setCurrentColor(color); setIsEraser(false); }}
                      aria-label={`Select color ${color}`}
                      className={`shrink-0 w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                        !isEraser && currentColor === color ? 'border-foreground scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Small arrow hint on mobile */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 sm:hidden pointer-events-none">
                <ChevronRight className="w-4 h-4 text-muted-foreground animate-pulse" />
              </div>

              {/* Desktop: show all colors inline */}
              <div className="hidden sm:flex items-center gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => { setCurrentColor(color); setIsEraser(false); }}
                    aria-label={`Select color ${color}`}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      !isEraser && currentColor === color ? 'border-foreground scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area - Updated with transparent background and dashed border */}
        <div className="mb-6 relative">
          {/* Mobile hint overlay (disappears after draw / scroll) */}
          {showMobileHint && (
            <div className="absolute inset-x-0 bottom-0 pointer-events-none flex justify-end pr-2 pb-2 sm:hidden z-20">
              <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground/80 bg-background/70 backdrop-blur-sm rounded-full px-2 py-1 shadow-soft animate-pulse">
                <ChevronDown className="w-3 h-3" />
                Hold button below
              </div>
            </div>
          )}
          <div 
            className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-300/40"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-xl"
                 style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)' }} />
            <canvas
              ref={canvasRef}
              className="block w-full h-auto cursor-crosshair touch-none select-none rounded-xl bg-transparent"
              onPointerDown={(e) => { handlePointerDown(e); setShowMobileHint(false); }}
              onPointerMove={handlePointerMove}
              onPointerUp={endStroke}
              onPointerLeave={endStroke}
              onPointerCancel={endStroke}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* Desktop (>= sm) button stays inline */}
        <div className="hidden sm:block">
          <HoldButton 
            onComplete={handleContinue}
            disabled={!hasDrawn}
            progressClassName="bg-primary-foreground/30"
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">Hold to Release</span>
              <ArrowRight className="w-5 h-5" />
            </span>
          </HoldButton>
        </div>
      </div>

      {/* Mobile fixed action bar */}
      <div className="sm:hidden action-bar-mobile">
        <HoldButton 
          onComplete={handleContinue}
          disabled={!hasDrawn}
          progressClassName="bg-primary-foreground/30"
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