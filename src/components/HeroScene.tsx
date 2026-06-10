'use client';

import { memo, useCallback, useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { demoComponents } from './demos/registry';
import { demos } from '@/data/demos';

interface HeroSceneProps {
  onReady: () => void;
}

// Demos eligible for the hero rotation: flagged featured in data/demos.ts
// AND registered in the component registry.
const heroDemos = demos.filter((d) => d.featured && d.id in demoComponents);

// Auto-advance to the next demo after this long without user interaction.
const AUTO_ADVANCE_MS = 20_000;

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
  const containerRef = useRef<HTMLDivElement>(null);
  // Random pick in the state initializer is safe from hydration mismatch
  // only because page.tsx loads HeroScene with ssr: false — this component
  // never renders on the server. If that ever changes, move the pick into
  // a useEffect.
  const [demoIndex, setDemoIndex] = useState(() =>
    Math.floor(Math.random() * Math.max(heroDemos.length, 1))
  );
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

  // Auto-advance. Armed only while idle and on screen, so a manual switch
  // (leaving idle) clears it and a fresh countdown starts once the new demo
  // settles. Pointer activity over the hero restarts the countdown — it
  // would be rude to swap the terrain out from under a drag.
  useEffect(() => {
    if (phase !== 'idle' || !isVisible || heroDemos.length < 2) return;
    const el = containerRef.current;
    let timer = window.setTimeout(() => cycle(1), AUTO_ADVANCE_MS);
    const defer = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => cycle(1), AUTO_ADVANCE_MS);
    };
    el?.addEventListener('pointerdown', defer);
    el?.addEventListener('pointermove', defer);
    return () => {
      window.clearTimeout(timer);
      el?.removeEventListener('pointerdown', defer);
      el?.removeEventListener('pointermove', defer);
    };
  }, [phase, isVisible, cycle]);

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

  return (
    // No transform here on purpose: a transform creates a CSS stacking
    // context, which would flatten this subtree and let the page's overlay
    // gradients paint over the demo switcher regardless of its z-index.
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
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
      {/* Demo switcher, centered at the hero's bottom edge (carousel-control
          idiom). z-30: above the swap cover (z-10) and the page's hero
          overlays (gradients at z-auto, title at z-20) so it stays crisp
          during transitions. min 40px buttons for touch. */}
      {heroDemos.length > 1 && demo && (
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-stretch gap-1 font-mono text-xs">
          <button
            aria-label="Previous demo"
            onClick={() => cycle(-1)}
            disabled={phase !== 'idle'}
            className="flex min-h-10 min-w-10 items-center justify-center border border-foreground/60 bg-background/60 text-foreground/70 backdrop-blur hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="flex items-center whitespace-nowrap border border-foreground/60 bg-background/60 px-4 text-foreground/70 backdrop-blur">
            {demo.title}
          </span>
          <button
            aria-label="Next demo"
            onClick={() => cycle(1)}
            disabled={phase !== 'idle'}
            className="flex min-h-10 min-w-10 items-center justify-center border border-foreground/60 bg-background/60 text-foreground/70 backdrop-blur hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(HeroScene);
