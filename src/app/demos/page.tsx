import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import DemoCard from '../../components/DemoCard';
import PrimaryNav from '../../components/PrimaryNav';
import ScrollReveal from '../../components/ScrollReveal';
import { ThemeToggle } from '../../components/ThemeToggle';
import { demos } from '../../data/demos';

export const metadata = {
  title: 'Demos',
};

export default function AllDemosPage() {
  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <PrimaryNav />
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <main className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Demos
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            {demos.length} {demos.length === 1 ? 'demo' : 'demos'}. Interactive 3D experiments.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {demos.map((demo, index) => (
            <ScrollReveal key={demo.id} delay={(index % 2) * 100} className="h-full">
              <DemoCard demo={demo} />
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
