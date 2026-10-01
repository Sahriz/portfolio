'use client';

import { Component, memo, useCallback, useRef, useState, useEffect, Suspense } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { demoComponents } from './demos/registry';
import { demos } from '@/data/demos';

interface HeroSceneProps {
  onReady: () => void;
}

// Demos the hero can show: flagged featured in data/demos.ts AND registered
// in the component registry.
const heroDemos = demos.filter((d) => d.featured && d.id in demoComponents);

// The hero always opens on the terrain: it is the one demo that matches the
// dark page. There is no random pick and no auto-advance; a hero that differs
// every visit and swaps itself out mid-scroll reads as instability rather
// than variety. On desktop the arrows still let a visitor flip through the
// others by hand; phones (below Tailwind's `sm`) get the terrain only.
const MOBILE_QUERY = '(max-width: 640px)';
const HERO_DEMO = 'terrain';

function isMobileViewport() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function heroDemoIndex() {
  const i = heroDemos.findIndex((d) => d.id === HERO_DEMO);
  return i === -1 ? 0 : i; // survives terrain being unfeatured or renamed later
}

// Still of the terrain demo, shown whenever a WebGL canvas can't be.
const HERO_POSTER = '/images/hero-terrain.webp';

// Decided up front, before a <Canvas> is ever mounted: three r184 needs WebGL2.
function hasWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/** The no-WebGL hero. Reports ready on mount so the page's curtain still opens. */
function HeroPoster({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fills the hero at any size; a plain img needs no dimensions
    <img src={HERO_POSTER} alt="" className="h-full w-full object-cover" />
  );
}

/**
 * Catches a <Canvas> that throws (context creation can still fail after the
 * up-front check, e.g. a blocklisted GPU) and tells the host to fall back.
 */
class CanvasErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Fires onReady on the first rendered frame. Lives inside the same
 * <Suspense> boundary as the demo, so it only mounts once the demo's code
 * has loaded and the scene has real content. The host keys this component
 * by demo id so each swap gets a fresh instance (and a fresh one-shot).
 */
function ReadyNotifier({ onReady }: { onReady: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      onReady();
    }
  });
  return null;
}

/**
 * Demo-swap transition state machine:
 *
 *   idle → (arrow click) → covering   — overlay fades to opaque, old demo
 *                                       still live underneath
 *        → (overlay transitionend) → swap demo, enter waiting
 *   waiting → (new demo's first frame, via ReadyNotifier) → revealing
 *   revealing → (overlay transitionend) → idle
 *
 * The swap happens only while fully covered, and the reveal starts only
 * once the new demo is actually rendering — so a slow chunk load just
 * holds the cover a little longer instead of flashing an empty canvas.
 * Arrows are disabled outside idle; interrupted transitions can't happen.
 */
type SwapPhase = 'idle' | 'covering' | 'waiting' | 'revealing';

function HeroScene({ onReady }: HeroSceneProps) {
  const [isVisible, setIsVisible] = useState(true);
  // False means: no WebGL2, or the canvas threw. Either way, show the poster.
  const [canvasOk, setCanvasOk] = useState(hasWebGL2);
  const handleCanvasError = useCallback(() => setCanvasOk(false), []);
  const containerRef = useRef<HTMLDivElement>(null);
  // Touching window (matchMedia) in a state initializer is safe from
  // hydration mismatch only because page.tsx loads HeroScene with
  // ssr: false, so this component never renders on the server.
  //
  // The viewport check is evaluated once at mount by design: rotating a
  // phone mid-session shouldn't add controls the visitor didn't have.
  const [isMobile] = useState(isMobileViewport);
  const [demoIndex, setDemoIndex] = useState(heroDemoIndex);
  const [phase, setPhase] = useState<SwapPhase>('idle');
  const pendingIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const demo = heroDemos.length > 0 ? heroDemos[demoIndex % heroDemos.length] : undefined;
  const Demo = demo ? demoComponents[demo.id] : null;

  const cycle = useCallback((dir: number) => {
    if (phase !== 'idle' || heroDemos.length < 2) return;
    pendingIndexRef.current = (demoIndex + dir + heroDemos.length) % heroDemos.length;
    setPhase('covering');
  }, [phase, demoIndex]);

  // The page-level blackout consumes onReady on first load (idempotent
  // afterwards); the swap machine consumes it on every later demo change.
  const handleDemoReady = useCallback(() => {
    onReady();
    setPhase((p) => (p === 'waiting' ? 'revealing' : p));
  }, [onReady]);

  const handleCoverTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'opacity') return;
    if (phase === 'covering' && pendingIndexRef.current !== null) {
      setDemoIndex(pendingIndexRef.current);
      pendingIndexRef.current = null;
      setPhase('waiting');
    } else if (phase === 'revealing') {
      setPhase('idle');
    }
  };

  const covered = phase === 'covering' || phase === 'waiting';
  // On phones the demo can't change, so the arrows would be controls that do
  // nothing. The title link stays, since it's the way into /demos/<id>.
  const showArrows = !isMobile && heroDemos.length > 1;

  if (!canvasOk) {
    return (
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        <HeroPoster onReady={onReady} />
      </div>
    );
  }

  return (
    // No transform here on purpose: a transform creates a CSS stacking
    // context, which would flatten this subtree and let the page's overlay
    // gradients paint over the demo switcher regardless of its z-index.
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <CanvasErrorBoundary onError={handleCanvasError}>
      <Canvas
        gl={{ alpha: false, antialias: false, stencil: false, depth: true }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
        // Pause the rendering loop when not visible
        frameloop={isVisible ? 'always' : 'never'}
      >
        {/* No camera or lights here on purpose: per the demo contract
            (see demos/SpinningCubeDemo.tsx) each demo brings its own. */}
        <Suspense fallback={null}>
          {Demo ? <Demo /> : null}
          <ReadyNotifier key={demo?.id ?? 'none'} onReady={handleDemoReady} />
        </Suspense>
      </Canvas>
      </CanvasErrorBoundary>
      {/* Swap cover. Inline transition (not a stylesheet class) so its
          duration can't be zeroed by a media query — a 0s transition never
          fires transitionend, which would wedge the state machine. */}
      <div
        aria-hidden
        onTransitionEnd={handleCoverTransitionEnd}
        className="pointer-events-none absolute inset-0 z-10 bg-background"
        style={{
          opacity: covered ? 1 : 0,
          transition: `opacity ${covered ? 250 : 450}ms ease`,
        }}
      />
      {/* Demo switcher: centred on phones, bottom right of the content column
          from sm up, clear of the hero text. z-30: above the swap cover (z-10)
          and the page's hero overlays (scrim at z-auto, text at z-20) so it
          stays crisp during transitions. min 40px buttons for touch. */}
      {heroDemos.length > 1 && demo && (
        <div className="hero-switcher absolute bottom-6 z-30 flex items-stretch gap-1 font-mono text-xs">
          {showArrows && (
            <button
              aria-label="Previous demo"
              onClick={() => cycle(-1)}
              disabled={phase !== 'idle'}
              className="flex min-h-10 min-w-10 items-center justify-center border border-foreground/60 bg-background/60 text-foreground/70 backdrop-blur hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <Link
            href={`/demos/${demo.id}`}
            aria-label={`Open ${demo.title} demo`}
            className="flex items-center whitespace-nowrap border border-foreground/60 bg-background/60 px-4 text-foreground/70 backdrop-blur transition-colors hover:bg-foreground hover:text-background"
          >
            {demo.title}
          </Link>
          {showArrows && (
            <button
              aria-label="Next demo"
              onClick={() => cycle(1)}
              disabled={phase !== 'idle'}
              className="flex min-h-10 min-w-10 items-center justify-center border border-foreground/60 bg-background/60 text-foreground/70 backdrop-blur hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(HeroScene);
