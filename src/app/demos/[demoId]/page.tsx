import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import DemoViewer from '@/components/demos/DemoViewer';
import { demos, getDemo } from '@/data/demos';

// Server component, unlike projects/[projectId]: nothing here needs client
// state, so metadata, static params, and the 404 can all live in this one
// file (the projects route needs its layout.tsx only because its page is
// 'use client'). The client boundary starts at <DemoViewer>.

interface DemoPageProps {
  params: Promise<{ demoId: string }>;
}

/** Pre-render a page per registered demo at build time. */
export function generateStaticParams() {
  return demos.map((d) => ({ demoId: d.id }));
}

export async function generateMetadata(props: DemoPageProps): Promise<Metadata> {
  const { demoId } = await props.params;
  const demo = getDemo(demoId);
  if (!demo) {
    return { title: 'Demo Not Found' };
  }
  return { title: demo.title, description: demo.description };
}

export default async function DemoPage(props: DemoPageProps) {
  const { demoId } = await props.params;
  const demo = getDemo(demoId);
  if (!demo) notFound();

  return (
    <div className="relative h-svh w-full">
      <DemoViewer demoId={demo.id} />

      {/* Overlays float above the canvas; pointer-events-none keeps them
          from stealing mouse interaction from the demo. */}
      <div className="fixed top-6 left-6 z-50 flex gap-3">
        <Button asChild variant="ghost" className="border bg-background/80 backdrop-blur">
          <Link href="/demos">&#8592; All Demos</Link>
        </Button>
        <Button asChild variant="ghost" className="border bg-background/80 backdrop-blur">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-6 z-40 mx-auto max-w-xl px-4 text-center">
        <h1 className="font-mono text-lg text-foreground/90">{demo.title}</h1>
        <p className="mt-1 font-mono text-xs text-foreground/60">{demo.description}</p>
      </div>
    </div>
  );
}
