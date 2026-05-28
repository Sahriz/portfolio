'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/** Top-of-page fixed nav pill. Slides up on scroll-down, slides back on scroll-up. */
export default function PrimaryNav() {
  const [navHidden, setNavHidden] = useState(false);

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

  return (
    <nav
      aria-label="Primary"
      className={`fixed top-4 left-1/2 z-50 border border-foreground/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 px-3 py-2.5 font-mono text-sm transition-transform duration-300 ease-out ${navHidden ? '-translate-x-1/2 -translate-y-[200%]' : '-translate-x-1/2 translate-y-0'}`}
    >
      <ul className="flex items-center gap-1 text-foreground/70">
        <li>
          <Link href="/" className="nav-link inline-block px-3 py-1.5 hover:bg-foreground hover:text-background">
            home
          </Link>
        </li>
        <li>
          <Link href="/#scroll-target-aboutme" className="nav-link inline-block px-3 py-1.5 hover:bg-foreground hover:text-background">
            about
          </Link>
        </li>
        <li>
          <Link href="/#scroll-target-contactme" className="nav-link inline-block px-3 py-1.5 hover:bg-foreground hover:text-background">
            contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
