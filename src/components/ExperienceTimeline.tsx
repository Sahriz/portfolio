'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import type { ExperienceItem } from '../data/experience';

type Props = { items: ExperienceItem[] };

export default function ExperienceTimeline({ items }: Props) {
  // Descriptions start collapsed, so the timeline reads as a list of roles
  // and dates; each one opens on its own.
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="relative space-y-9 pl-20">
      {/* Vertical spine running through the logos */}
      <div className="absolute left-6 top-3 bottom-3 w-px bg-foreground/30" aria-hidden />

      {items.map((item, index) => {
        const expanded = open.has(item.id);
        return (
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

            <div className="flex flex-col gap-1.5">
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
              {expanded && (
                <p id={`experience-${item.id}`} className="max-w-3xl text-sm leading-relaxed text-foreground/75">
                  {item.description}
                </p>
              )}
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={expanded}
                aria-controls={`experience-${item.id}`}
                className="self-start font-mono text-xs text-brand hover:text-foreground"
              >
                {expanded ? 'show less −' : 'show more +'}
              </button>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
