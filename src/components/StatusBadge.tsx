import { cn } from '@/lib/utils';
import type { Project } from '@/data/projects';

// "in progress" is being worked on now, so it gets the accent. "on hold" is
// unfinished but parked, so it is deliberately quieter.
const badges: Record<NonNullable<Project['status']>, { label: string; className: string }> = {
  'in-progress': { label: 'in progress', className: 'border-brand/45 text-brand' },
  'on-hold': { label: 'on hold', className: 'border-foreground/30 text-foreground/55' },
};

type Props = {
  status: Project['status'];
  className?: string;
};

/** The small label next to a project title. Renders nothing for finished projects. */
export default function StatusBadge({ status, className }: Props) {
  if (!status) return null;
  const badge = badges[status];
  return (
    <span
      className={cn(
        'inline-block border px-1.5 py-1 align-middle font-mono text-[10px] font-medium uppercase leading-none tracking-[0.12em]',
        badge.className,
        className
      )}
    >
      {badge.label}
    </span>
  );
}
