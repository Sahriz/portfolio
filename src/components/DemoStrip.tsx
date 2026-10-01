import Image from 'next/image';
import Link from 'next/link';
import type { Demo } from '@/data/demos';

type Props = { demos: Demo[] };

/** A row of demo thumbnails. Only demos with a poster can appear here. */
export default function DemoStrip({ demos }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {demos.map((demo) => (
        <article key={demo.id} className="glow-card glow-card-demo group border border-foreground/30 bg-card/40">
          {/* Invisible link covering the whole card. */}
          <Link
            href={`/demos/${demo.id}`}
            aria-label={`Open ${demo.title} demo`}
            className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
          />
          <div className="relative aspect-video overflow-hidden bg-muted/20">
            <Image src={demo.poster!} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
          </div>
          <p className="glow-icon px-3.5 py-3 font-mono text-xs text-foreground/75">{demo.title} ↗</p>
        </article>
      ))}
    </div>
  );
}
