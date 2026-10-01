import { FileText, Joystick } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Paper } from '../data/papers';

type Props = { paper: Paper };

// No stretched link here, unlike the project and demo cards: a paper has two
// equal targets (the PDF and the project), so neither owns the whole card.
export default function PaperCard({ paper }: Props) {
  return (
    <article className="group relative flex h-full flex-col border border-foreground/30 surface p-6 glow-card glow-card-paper">
      <div className="absolute top-4 right-4 text-foreground/20 glow-icon">
        <FileText className="h-6 w-6" />
      </div>

      <h3 className="pr-8 text-xl font-bold tracking-tight text-foreground">{paper.title}</h3>
      <p className="mt-1 font-mono text-sm text-foreground/60">{paper.authors}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">{paper.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {paper.paperUrl && (
          <a
            href={paper.paperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-follow')}
          >
            <FileText className="h-3.5 w-3.5" />
            view paper
          </a>
        )}
        {paper.projectUrl && (
          <a
            href={paper.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-project glow-cta-follow')}
          >
            <Joystick className="h-3.5 w-3.5" />
            view project
          </a>
        )}
      </div>
    </article>
  );
}
