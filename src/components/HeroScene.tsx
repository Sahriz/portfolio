'use client';

import { memo, useCallback, useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import Link from 'next/link';
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

// Phones get a fixed hero: the terrain demo, and only the terrain demo. No
// random starting pick, no auto-advance, no arrows. The hero is the first
// thing a visitor sees, and on a phone it's most of the first screen; a demo
// that differs every visit and then swaps itself out mid-scroll reads as
// instability rather than variety. Desktop keeps the full rotation.
//
// 640px is Tailwind's `sm`, which the rest of the page already keys its
// layout off (`sm:grid-cols-2` etc.). globals.css separately uses 600px in a
// few places; 640 is the better anchor for "is this a phone".
const MOBILE_QUERY = '(max-width: 640px)';
const FIXED_MOBILE_DEMO = 'terrain';

function isMobileViewport() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function fixedMobileIndex() {
  const i = heroDemos.findIndex((d) => d.id === FIXED_MOBILE_DEMO);
  return i === -1 ? 0 : i; // survives terrain being unfeatured or renamed later
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
  const containerRef = useRef<HTMLDivElement>(null);
  // Touching window (matchMedia) and Math.random in state initializers is
  // safe from hydration mismatch only because page.tsx loads HeroScene with
  // ssr: false — this component never renders on the server. If that ever
  // changes, both of these have to move into a useEffect together.
  //
  // The viewport check is evaluated once at mount by design: rotating a
  // phone mid-session shouldn't start a rotation the visitor didn't ask for.
  const [isMobile] = useState(isMobileViewport);
  const [demoIndex, setDemoIndex] = useState(() => {
    if (heroDemos.length === 0) return 0;
    if (isMobile) return fixedMobileIndex();
    return Math.floor(Math.random() * heroDemos.length);
  });
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
  // would be rude to swap the terrain out from under a drag. Never armed on
  // phones, where the hero is deliberately fixed to a single demo.
  useEffect(() => {
    if (phase !== 'idle' || !isVisible || isMobile || heroDemos.length < 2) return;
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
  }, [phase, isVisible, isMobile, cycle]);

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
