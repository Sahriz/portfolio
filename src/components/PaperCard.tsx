import { FileText, Joystick } from 'lucide-react';
import type { Paper } from '../data/papers';

type Props = { paper: Paper };

export default function PaperCard({ paper }: Props) {
  return (
    <article className="paper-card-wrapper group relative flex h-full flex-col overflow-hidden rounded-xl paper-card-custom">
      {/* Animated gradient border background */}
      <div className="card-gradient-border absolute inset-0 -z-10 opacity-0 group-hover:opacity-100" />
      
      {/* Main card content */}
      <div className="flex h-full flex-col border border-foreground/30 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 group-hover:border-emerald-400/60 group-hover:bg-card/60 group-hover:shadow-lg group-hover:shadow-emerald-500/10">
        {/* Top-right animated icon */}
        <div className="paper-card-top-icon absolute top-4 right-4 text-foreground/20 transition-colors duration-300 group-hover:text-foreground/40">
          <FileText className="h-6 w-6 animate-icon-pulse" />
        </div>
        
        <h3 className="text-xl font-bold tracking-tight text-foreground">{paper.title}</h3>
        <p className="mt-1 font-mono text-sm text-foreground/60">{paper.authors}</p>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">{paper.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {paper.paperUrl && (
            <a
              href={paper.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="paper-paper-link nav-link inline-flex items-center gap-2 border border-foreground/60 px-3 py-1.5 font-mono text-xs text-foreground/80 transition-all duration-300 hover:scale-105"
            >
              <FileText className="paper-paper-link-icon h-3.5 w-3.5" />
              view paper
            </a>
          )}
          {paper.projectUrl && (
            <a
              href={paper.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="paper-project-link nav-link inline-flex items-center gap-2 border border-foreground/60 px-3 py-1.5 font-mono text-xs text-foreground/80 transition-all duration-300 hover:scale-105"
            >
              <Joystick className="paper-project-link-icon h-3.5 w-3.5" />
              view project
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
