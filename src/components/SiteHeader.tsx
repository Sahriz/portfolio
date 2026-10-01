'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { profile } from '@/data/profile';

// `match` is the sub-page each link owns, used to mark it active there.
const links = [
  { label: 'projects', href: '/#scroll-target-projects', match: '/projects' },
  { label: 'research', href: '/#scroll-target-research', match: '/papers' },
  { label: 'about', href: '/#scroll-target-aboutme', match: null },
  { label: 'contact', href: '/#scroll-target-contactme', match: null },
];

/** The top bar on every page: name, section links, CV and the theme toggle. */
export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-base font-semibold tracking-[-0.01em] text-foreground hover:text-foreground">
          {profile.name}
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav aria-label="Primary" className="hidden items-center gap-6 font-mono text-[13px] md:flex">
            {links.map((link) => {
              const active = link.match !== null && pathname.startsWith(link.match);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'nav-link transition-colors hover:text-foreground',
                    active ? 'text-brand' : 'text-foreground/70'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <a href={profile.cv} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: 'sm' })}>
            cv ↓
          </a>
          <ThemeToggle />
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(buttonVariants({ size: 'icon' }), 'md:hidden')}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Phone menu: the section links, tucked under the bar. */}
      {menuOpen && (
        <nav
          id="site-menu"
          aria-label="Primary"
          className="border-t border-foreground/10 bg-background/95 px-4 py-2 font-mono text-sm md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-foreground/80 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
