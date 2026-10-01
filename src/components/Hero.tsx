'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { profile } from '@/data/profile';

// The terrain demo's first frame, captured wide (2.8:1) so that on any
// narrower hero `object-cover` crops it exactly the way the live camera
// frames the scene. Recapture it if the terrain's look or start pose changes.
const HERO_POSTER = '/images/hero-terrain-first-frame.webp';

// No loading placeholder: the poster is already on screen behind it.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

type Props = {
  /** Fires once the scene (or its poster) is on screen; opens the page's curtain. */
  onReady: () => void;
};

export default function Hero({ onReady }: Props) {
  return (
    <div className="relative z-[9] h-[78vh] w-full overflow-hidden sm:h-[70vh]">
      {/* The poster is in the server-rendered HTML, so the hero is never an
          empty box: it shows while the three.js bundle downloads and the
          shaders compile, and the live canvas then fades in on top of it.
          It also opens the page's curtain, which no longer waits for WebGL. */}
      <Image
        src={HERO_POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        onLoad={onReady}
        onError={onReady}
      />
      <div className="absolute inset-0">
        <HeroScene onReady={onReady} />
      </div>
      {/* Scrim instead of a text-shadow halo: the canvas ignores the site
          theme, so the text gets its own dark backing. */}
      <div className="hero-scrim pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      {/* `dark` on purpose, whatever the site theme: this block always sits on
          the dark scrim, so it uses the dark tokens (white text and borders,
          cyan accent). */}
      <div
        className="dark intro-fade pointer-events-none absolute inset-0 z-20 flex flex-col items-start justify-center pt-[60px] text-left"
        style={{ paddingInline: 'var(--column-edge)' }}
      >
        <p className="eyebrow">{profile.hero.eyebrow}</p>
        <h1 className="mt-[18px] text-[46px] font-[650] leading-[0.98] tracking-[-0.045em] text-white sm:text-[76px]">
          {profile.name}
        </h1>
        <p className="mt-3.5 text-[21px] font-medium leading-[1.2] tracking-[-0.02em] text-white/90 sm:text-[28px]">
          {profile.hero.role}
        </p>
        <p className="mt-3.5 max-w-[34rem] text-[16.5px] leading-[1.6] text-white/65">{profile.hero.sentence}</p>
        <div className="pointer-events-auto mt-7 flex gap-2.5">
          <Button asChild variant="primary" className="bg-black/35">
            <a href="#scroll-target-projects">view projects ↓</a>
          </Button>
          <Button asChild variant="outline" className="bg-black/35 text-foreground">
            <a href={profile.cv} target="_blank" rel="noopener noreferrer">
              download cv
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
