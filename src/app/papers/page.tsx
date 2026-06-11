import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import PaperCard from '../../components/PaperCard';
import PrimaryNav from '../../components/PrimaryNav';
import ScrollReveal from '../../components/ScrollReveal';
import { ThemeToggle } from '../../components/ThemeToggle';
import { papers } from '../../data/papers';

export const metadata = {
  title: 'Papers',
};

export default function AllPapersPage() {
  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <PrimaryNav />
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <main className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Papers
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            {papers.length} {papers.length === 1 ? 'paper' : 'papers'} — research, course writeups, and the bachelor thesis.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {papers.map((paper, index) => (
            <ScrollReveal key={paper.id} delay={(index % 2) * 100} className="h-full">
              <PaperCard paper={paper} />
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
          >
            <ChevronLeft className="h-4 w-4" />
            back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
