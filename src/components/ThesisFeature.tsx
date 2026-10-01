import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { thesis } from '@/data/thesis';
import { papers } from '@/data/papers';

/** The master's thesis as an evidence block: the claim on the left, the numbers on the right. */
export default function ThesisFeature() {
  return (
    <section id="scroll-target-research" className="relative z-10 mx-auto mt-32 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <p className="eyebrow">{thesis.eyebrow}</p>
      <h2 className="section-title mt-2.5 text-foreground">Research</h2>

      <div className="mt-9 grid gap-7 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div>
          <p className="text-[23px] font-medium leading-[1.25] tracking-[-0.02em] text-foreground sm:text-[30px]">
            {thesis.claim}
          </p>
          <p className="mt-3.5 text-base leading-[1.55] text-foreground/60">
            {thesis.title}: {thesis.question}
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {/* A paper, so it lights up green like the paper cards do. */}
            <Button asChild variant="primary" className="glow-cta glow-cta-paper">
              <a href={thesis.pdf} target="_blank" rel="noopener noreferrer">
                read the thesis ↗
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/papers">all papers ({papers.length})</Link>
            </Button>
          </div>
        </div>

        <div className="lg:border-l lg:border-foreground/10 lg:pl-7">
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/50">results</p>
          {thesis.stats.map((stat) => (
            <div key={stat.value} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-foreground/10 py-4">
              <b className="text-[30px] font-semibold leading-none tracking-[-0.02em] text-foreground">{stat.value}</b>
              <span className="text-sm leading-[1.5] text-foreground/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
