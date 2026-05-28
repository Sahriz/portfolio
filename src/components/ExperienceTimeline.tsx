import ScrollReveal from './ScrollReveal';
import type { ExperienceItem } from '../data/experience';

type Props = { items: ExperienceItem[] };

export default function ExperienceTimeline({ items }: Props) {
  return (
    <div className="relative space-y-12 pl-20">
      {/* Vertical spine running through the logos */}
      <div className="absolute left-6 top-3 bottom-3 w-px bg-foreground/30" aria-hidden />

      {items.map((item, index) => (
        <ScrollReveal key={item.id} delay={index * 120} className="relative">
          {/* Logo (or initial fallback) sitting on the spine */}
          <div className="absolute -left-20 top-0 flex size-12 items-center justify-center border border-zinc-300 bg-white">
            {item.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.logo} alt={`${item.organization} logo`} className="size-8 object-contain" />
            ) : (
              <span className="font-mono text-base font-bold text-foreground/70" aria-hidden>
                {item.organization.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
              <span className="inline-flex shrink-0 items-center border border-foreground/40 px-3 py-1 font-mono text-xs text-foreground/80">
                {item.startDate === item.endDate
                  ? item.startDate
                  : `${item.startDate} – ${item.endDate}`}
              </span>
            </div>
            <p className="font-mono text-sm text-foreground/60">{item.organization}</p>
            <p className="text-sm leading-relaxed text-foreground/80">{item.description}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
