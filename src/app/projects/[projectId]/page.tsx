'use client'

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function ProjectPage(props0: ProjectPageProps) {
  const params = use(props0.params);
  const { projectId } = params;

  // README keyed by the project it belongs to. `loading` is derived from
  // whether the loaded id matches the current route, so the effect never
  // needs a synchronous setState, and a slow response for a previous
  // project can never clobber the current one.
  const [loaded, setLoaded] = useState<{ id: string; text: string } | null>(null);
  const loading = loaded?.id !== projectId;
  const content = loaded?.id === projectId ? loaded.text : '';

  // Mapping for project IDs to README folder names
  const getReadmePath = (id: string): string => {
    const mapping: Record<string, string> = {
      TerrainLibrary: 'TerrainLib',
      Portals: 'Portal',
    };

    const folderName = mapping[id] || id;
    return `/projects/${folderName}/README.md`;
  };

  useEffect(() => {
    let cancelled = false;
    fetch(getReadmePath(projectId))
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then((text) => {
        if (!cancelled) setLoaded({ id: projectId, text });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ id: projectId, text: '# Error\nCould not load README.' });
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return (
    <>
      <div className="fixed top-6 left-6 z-50 flex gap-2">
        <Button asChild variant="ghost" className="border bg-background/80 backdrop-blur">
          <Link href="/projects">&#8592; Back to All Projects</Link>
        </Button>
        <Button asChild variant="ghost" className="border bg-background/80 backdrop-blur">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-20">
        {loading ? (
          <div className="grid min-h-[240px] place-items-center rounded-2xl border bg-card text-card-foreground shadow-sm">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : (
          <ReactMarkdown
            className="prose prose-slate dark:prose-invert max-w-none rounded-2xl border bg-card p-6 text-card-foreground shadow-sm"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ node, ...props }) => <h1 className="mb-6 text-center text-3xl font-bold" {...props} />,
              h2: ({ node, ...props }) => <h2 className="mt-10 mb-4 text-center text-2xl font-semibold text-primary" {...props} />,
              h3: ({ node, ...props }) => <h3 className="mt-6 mb-3 text-center text-xl font-semibold" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 text-base leading-7 text-muted-foreground" {...props} />,
              ul: ({ node, ...props }) => <ul className="mb-4 ml-5 list-disc space-y-2 text-muted-foreground" {...props} />,
              li: ({ node, ...props }) => <li className="text-base leading-6" {...props} />,
              a: ({ node, ...props }) => <a className="text-primary underline" {...props} />,
              // eslint-disable-next-line @next/next/no-img-element -- markdown images have arbitrary sources/sizes; next/image needs known dimensions
              img: ({ node, ...props }) => <img alt="" className="mx-auto my-6 w-full max-w-3xl rounded-xl shadow" {...props} />,
              video: ({ node, ...props }) => <video className="mx-auto my-6 w-full max-w-3xl rounded-xl shadow" controls {...props} />,
              code: ({ node, ...props }) => <code className="rounded bg-muted px-2 py-1 text-sm" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="my-6 border-l-4 border-primary/70 bg-muted/50 px-4 py-2 text-muted-foreground" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </>
  );
}
