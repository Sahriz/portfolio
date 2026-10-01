'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  /** Stagger delay in milliseconds before the reveal animation starts. */
  delay?: number;
  className?: string;
};

/**
 * Wraps content in a div that fades + slides up the first time it enters the viewport.
 * Uses IntersectionObserver and disconnects after firing once, so it never re-runs.
 * The motion itself lives in globals.css (.scroll-reveal) so that
 * prefers-reduced-motion can switch it off; inline styles would win over that.
 */
export default function ScrollReveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('scroll-reveal', visible && 'scroll-reveal-visible', className)}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
