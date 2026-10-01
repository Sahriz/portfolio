import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { profile } from '@/data/profile';
import type { Paper } from '@/data/papers';

type Props = { papers: Paper[] };

/** Everyone on the paper except the site's owner. */
function coAuthors(paper: Paper) {
  return paper.authors
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name !== profile.name);
}

/** Compact rows for the home page. /papers keeps the full PaperCard grid. */
export default function PapersList({ papers }: Props) {
  return (
    <ul className="flex flex-col gap-3">
      {papers.map((paper) => {
        const others = coAuthors(paper);
        return (
          <li
            key={paper.id}
            className="glow-card glow-card-paper flex flex-col gap-3 border border-foreground/30 bg-card/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="min-w-0">
              <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground">{paper.title}</h3>
              <p className="mt-1 font-mono text-xs leading-[1.5] text-foreground/55">
                {[paper.type, paper.year].filter(Boolean).join(' · ')}
                {others.length > 0 && ` · with ${others.join(', ')}`}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {paper.paperUrl && (
                <a
                  href={paper.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-follow')}
                >
                  pdf ↗
                </a>
              )}
              {paper.projectUrl && (
                <a
                  href={paper.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-project glow-cta-follow')}
                >
                  project →
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
