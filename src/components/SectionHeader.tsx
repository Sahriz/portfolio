import Link from 'next/link';

type Props = {
  /** Small mono label above the title, e.g. "/ selected work". */
  eyebrow?: string;
  title: string;
  /** Optional right-aligned link, e.g. "all 10 projects →". */
  link?: { label: string; href: string };
};

export default function SectionHeader({ eyebrow, title, link }: Props) {
  return (
    <div className="mb-9 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-title mt-2.5 text-foreground">{title}</h2>
      </div>
      {link && (
        <Link href={link.href} className="shrink-0 pb-2.5 font-mono text-[13px] text-brand hover:text-foreground">
          {link.label}
        </Link>
      )}
    </div>
  );
}
