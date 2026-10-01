import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import { projects } from '@/data/projects';
import { papers } from '@/data/papers';

// Server component: the README is read from disk at build time, so the page
// ships as static HTML with no client fetch and no spinner.

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

// Project ids whose README folder under public/projects/ has a different name.
const README_FOLDERS: Record<string, string> = {
  TerrainLibrary: 'TerrainLib',
  Portals: 'Portal',
};

/** Pre-render a page per project; any other id is a 404. */
export function generateStaticParams() {
  return projects.map((p) => ({ projectId: p.id }));
}
export const dynamicParams = false;

export async function generateMetadata(props: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await props.params;
  const project = projects.find((p) => p.id === projectId);
  if (!project) return { title: 'Project not found' };
  return { title: project.title, description: project.description };
}

async function loadReadme(projectId: string): Promise<string | null> {
  const folder = README_FOLDERS[projectId] ?? projectId;
  try {
    const file = path.join(process.cwd(), 'public', 'projects', folder, 'README.md');
    const text = await fs.readFile(file, 'utf-8');
    // The page prints the title from projects.ts, so drop the README's own
    // first H1 (usually the repo name, e.g. "MinecraftTerrain").
    return text.replace(/^\s*#\s+.*\r?\n/, '');
  } catch {
    return null;
  }
}

export default async function ProjectPage(props: ProjectPageProps) {
  const { projectId } = await props.params;
  const project = projects.find((p) => p.id === projectId);
  if (!project) notFound();

  const readme = await loadReadme(project.id);
  // A paper belongs to this project when it points at the same repo.
  const paper = project.link
    ? papers.find((p) => p.paperUrl && p.projectUrl && project.link.startsWith(p.projectUrl))
    : undefined;
  const facts = [
    { label: 'year', value: project.year },
    { label: 'role', value: project.role },
    { label: 'team', value: project.team },
  ].filter((fact) => fact.value);
  const isVideo = project.image.endsWith('.webm');

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
      <Link href="/projects" className="font-mono text-[13px] text-brand hover:text-foreground">
        ← all projects
      </Link>

      <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl">
        {project.title}
        <StatusBadge status={project.status} className="ml-3" />
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-[1.5] text-foreground/70">{project.description}</p>

      <div className="relative mt-8 aspect-video w-full overflow-hidden border border-foreground/15 bg-muted/20">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={project.poster}
            className="h-full w-full object-cover"
          >
            <source src={project.image} type="video/webm" />
          </video>
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
        {readme ? (
          <article className="markdown-content min-w-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                // README videos are written as bare <video src>; without
                // controls they would just be a frozen first frame.
                video: ({ node, ...props }) => <video controls {...props} />,
                // Wide tables scroll inside their own box instead of the page.
                table: ({ node, ...props }) => (
                  <div className="w-full overflow-x-auto">
                    <table {...props} />
                  </div>
                ),
              }}
            >
              {readme}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="border border-foreground/20 p-6 font-mono text-sm text-foreground/60">
            No writeup for this project yet.
          </div>
        )}

        <aside className="order-first flex flex-col gap-6 lg:order-none lg:sticky lg:top-24 lg:self-start">
          {facts.length > 0 && (
            <dl className="grid grid-cols-[4.5rem_1fr] gap-x-3.5 gap-y-2 font-mono text-[12.5px] leading-[1.5]">
              {facts.map((fact) => (
                <div key={fact.label} className="contents">
                  <dt className="text-foreground/45">{fact.label}</dt>
                  <dd className="text-foreground/85">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div>
            <p className="mb-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/50">
              stack
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-foreground/15 px-[7px] py-[5px] font-mono text-[11px] leading-none text-foreground/70"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          {(project.link || paper || project.demo) && (
            <div>
              <p className="mb-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                links
              </p>
              <div className="flex flex-wrap gap-2">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-source')}
                  >
                    source ↗
                  </a>
                )}
                {paper && (
                  <a
                    href={paper.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-paper')}
                  >
                    paper ↗
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-demo')}
                  >
                    demo ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
