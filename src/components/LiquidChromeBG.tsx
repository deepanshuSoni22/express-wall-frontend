import React, { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

interface LiquidChromeProps extends React.HTMLAttributes<HTMLDivElement> {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
}

export const LiquidChrome: React.FC<LiquidChromeProps> = ({
  baseColor = [0.1, 0.1, 0.1],
  speed = 0.2,
  amplitude = 0.5,
  frequencyX = 3,
  frequencyY = 2,
  interactive = true,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const interactiveRef = useRef(interactive);

  // INIT (runs once)
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const renderer = new Renderer({ antialias: true, dpr: Math.min(window.devicePixelRatio, 2) });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    // Use darker clear color to avoid white flashes during frame gaps
    gl.clearColor(baseColor[0] * 0.25, baseColor[1] * 0.25, baseColor[2] * 0.25, 1);

    const vertexShader = `
      attribute vec2 position; attribute vec2 uv; varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,0.0,1.0); }
    `;

    const fragmentShader = `
      precision highp float; uniform float uTime; uniform vec3 uResolution; uniform vec3 uBaseColor; uniform float uAmplitude; uniform float uFrequencyX; uniform float uFrequencyY; uniform vec2 uMouse; varying vec2 vUv;
      vec4 renderImage(vec2 uvCoord){ vec2 fragCoord = uvCoord * uResolution.xy; vec2 uv = (2.0*fragCoord - uResolution.xy)/min(uResolution.x,uResolution.y); for(float i=1.0;i<10.0;i++){ uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159); uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159); } vec2 diff = (uvCoord - uMouse); float dist = length(diff); float falloff = exp(-dist * 20.0); float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03; uv += (diff / (dist + 0.0001)) * ripple * falloff; vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x)); return vec4(color,1.0); }
      void main(){ vec4 col = vec4(0.0); int samples = 0; for(int i=-1;i<=1;i++){ for(int j=-1;j<=1;j++){ vec2 offset = vec2(float(i),float(j)) * (1.0 / min(uResolution.x,uResolution.y)); col += renderImage(vUv + offset); samples++; } } gl_FragColor = col / float(samples); }
    `;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Float32Array([gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height]) },
        uBaseColor: { value: new Float32Array(baseColor) },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
        uMouse: { value: new Float32Array([0, 0]) }
      }
    });
    programRef.current = program;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    function resize() {
      if (!rendererRef.current || !containerRef.current) return;
      rendererRef.current.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
      const p = programRef.current; if (!p) return;
      const res = p.uniforms.uResolution.value as Float32Array;
      res[0] = gl.canvas.width; res[1] = gl.canvas.height; res[2] = gl.canvas.width / gl.canvas.height;
    }
    window.addEventListener('resize', resize);
    resize();

    function handlePointer(x: number, y: number) {
      const p = programRef.current; if (!p || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (x - rect.left) / rect.width; const ny = 1 - (y - rect.top) / rect.height;
      const mouseUniform = p.uniforms.uMouse.value as Float32Array;
      mouseUniform[0] = nx; mouseUniform[1] = ny;
    }
    function onMouse(e: MouseEvent) { if (interactiveRef.current) handlePointer(e.clientX, e.clientY); }
    function onTouch(e: TouchEvent) { if (interactiveRef.current && e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY); }

    container.addEventListener('mousemove', onMouse);
    container.addEventListener('touchmove', onTouch);

    function loop(t: number) {
      animationIdRef.current = requestAnimationFrame(loop);
      const p = programRef.current; const r = rendererRef.current; const m = meshRef.current; if (!p || !r || !m) return;
      p.uniforms.uTime.value = t * 0.001 * speedRef.current;
      r.render({ scene: m });
    }
    animationIdRef.current = requestAnimationFrame(loop);

    container.appendChild(gl.canvas);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', onMouse);
      container.removeEventListener('touchmove', onTouch);
      if (gl.canvas.parentElement) gl.canvas.parentElement.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  // UPDATE uniforms when props change (no re-init)
  useEffect(() => {
    const p = programRef.current; if (!p) return;
    const base = p.uniforms.uBaseColor.value as Float32Array;
    base[0] = baseColor[0]; base[1] = baseColor[1]; base[2] = baseColor[2];
    p.uniforms.uAmplitude.value = amplitude;
    p.uniforms.uFrequencyX.value = frequencyX;
    p.uniforms.uFrequencyY.value = frequencyY;
    speedRef.current = speed;
    interactiveRef.current = interactive;
  }, [baseColor, amplitude, frequencyX, frequencyY, speed, interactive]);

  return <div ref={containerRef} className="w-full h-full" style={{ position: 'absolute', inset: 0 }} {...props} />;
};

export default LiquidChrome;
