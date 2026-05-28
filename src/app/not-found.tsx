import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import PrimaryNav from '../components/PrimaryNav';
import { ThemeToggle } from '../components/ThemeToggle';

export const metadata = {
  title: 'Not found',
};

export default function NotFound() {
  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <PrimaryNav />
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <main className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-foreground/50">
          / 404 — not_found
        </p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
          Route not found.
        </h1>

        <p className="max-w-xl font-mono text-sm leading-relaxed text-foreground/70">
          The URL you tried doesn&apos;t map to anything on this site. Either it was never shipped,
          got renamed during a refactor, or someone typo&apos;d the link. Sorry about that — here
          are the places you probably wanted instead.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/"
            className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
          >
            <ChevronLeft className="h-4 w-4" />
            back to home
          </Link>
          <Link
            href="/projects"
            className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
          >
            projects
          </Link>
          <Link
            href="/papers"
            className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
          >
            papers
          </Link>
          <Link
            href="/courses"
            className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
          >
            coursework
          </Link>
        </div>
      </main>
    </div>
  );
}
