import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectReaderProps {
  projectId: string;
}

export default function ProjectReader({ projectId }: ProjectReaderProps): React.ReactElement<any> {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!projectId) return;
    const fetchUrl = `/projects/${projectId}/README.md`;
    let cancelled = false;

    setLoading(true);

    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        return response.text();
      })
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch((error) => {
        console.error('Error fetching README:', error);
        if (!cancelled) setContent(`# Error\nCould not load README for ${projectId}.`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [projectId]);

  return (
    <Card className="mx-auto max-w-4xl border bg-card text-card-foreground shadow-sm">
      <CardContent className="prose prose-slate dark:prose-invert max-w-none px-4 py-6 sm:px-8">
        {loading ? (
          <div className="grid gap-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-9/12" />
          </div>
        ) : (
          <ReactMarkdown
            className="prose prose-slate dark:prose-invert max-w-none"
            children={content}
            remarkPlugins={[remarkGfm]}
          />
        )}
      </CardContent>
    </Card>
  );
}
