import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import DemoCard from '../../components/DemoCard';
import ScrollReveal from '../../components/ScrollReveal';
import { listedDemos as demos } from '../../data/demos';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'Demos',
};

export default function AllDemosPage() {
  return (
    <div className="relative w-full min-h-screen text-foreground">
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
            className={buttonVariants()}
          >
            <ChevronLeft className="h-4 w-4" />
            back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
