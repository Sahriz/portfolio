import Link from 'next/link';
import { FileText, ExternalLink } from 'lucide-react';
import type { Paper } from '../data/papers';

type Props = { paper: Paper };

export default function PaperCard({ paper }: Props) {
  return (
    <article className="flex h-full flex-col border border-foreground/30 bg-card/40 p-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold tracking-tight text-foreground">{paper.title}</h3>
      <p className="mt-1 font-mono text-sm text-foreground/60">{paper.authors}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">{paper.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {paper.paperUrl && (
          <Link
            href={paper.paperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-3 py-1.5 font-mono text-xs text-foreground/80 hover:bg-foreground hover:text-background"
          >
            <FileText className="h-3.5 w-3.5" />
            view paper
          </Link>
        )}
        {paper.projectUrl && (
          <Link
            href={paper.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-3 py-1.5 font-mono text-xs text-foreground/80 hover:bg-foreground hover:text-background"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            view project
          </Link>
        )}
      </div>
    </article>
  );
}
