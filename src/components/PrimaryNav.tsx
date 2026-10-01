'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/** Top-of-page fixed nav pill. Slides up on scroll-down, slides back on scroll-up. */
export default function PrimaryNav() {
  const [navHidden, setNavHidden] = useState(false);

  // Pre-warm the home page's Three.js / HeroScene bundle in the background.
  // PrimaryNav only renders on sub-pages, so this guarantees that whenever the
  // user clicks "home", the dynamic import is already cached → sceneReady fires
  // fast → the intro flash, star, and bars stay in sync.
  useEffect(() => {
    import('./HeroScene').catch(() => {
      // Silent — this is a prefetch optimization, not critical functionality.
    });
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;
        if (currentY < 80) {
          setNavHidden(false);
        } else if (delta > 4) {
          setNavHidden(true);
        } else if (delta < -4) {
          setNavHidden(false);
        }
        lastY = currentY;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Below sm the pill sits left with tighter padding so it clears the theme
  // toggle on 360px phones. The phase-2 top bar replaces this.
  return (
    <nav
      aria-label="Primary"
      className={`fixed top-4 left-4 z-50 sm:left-1/2 sm:-translate-x-1/2 border border-foreground/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 px-1.5 py-1.5 font-mono text-xs sm:px-3 sm:py-2.5 sm:text-sm transition-transform duration-300 ease-out ${navHidden ? '-translate-y-[200%]' : 'translate-y-0'}`}
    >
      <ul className="flex items-center gap-1 text-foreground/70">
        <li>
          <Link href="/" className="nav-link inline-block px-2 py-1.5 sm:px-3 text-foreground/70 hover:bg-foreground hover:text-background">
            home
          </Link>
        </li>
        <li>
          <Link href="/#scroll-target-aboutme" className="nav-link inline-block px-2 py-1.5 sm:px-3 text-foreground/70 hover:bg-foreground hover:text-background">
            about
          </Link>
        </li>
        <li>
          <Link href="/#scroll-target-contactme" className="nav-link inline-block px-2 py-1.5 sm:px-3 text-foreground/70 hover:bg-foreground hover:text-background">
            contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
