import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PrimaryNav from '../../../components/PrimaryNav';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { devlogPosts } from '../../../data/devlog';

/** Pre-render a static page for every (non-draft) post slug at build time. */
export async function generateStaticParams() {
  return devlogPosts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}

async function loadPost(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'devlog', `${slug}.md`);
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = devlogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Not found' };
  return { title: post.title, description: post.excerpt };
}

export default async function DevlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = devlogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const body = await loadPost(slug);

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <PrimaryNav />
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="font-mono text-xs tracking-[0.2em] text-foreground/50">{post.date}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-foreground/30 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-foreground/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {post.title}
          </h1>
        </header>

        {body ? (
          <article className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {body}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="border border-foreground/20 p-6 font-mono text-sm text-foreground/60">
            Couldn&apos;t load the body for this post. Make sure{' '}
            <code className="text-foreground/80">src/content/devlog/{slug}.md</code> exists.
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            href="/devlog"
            className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
          >
            <ChevronLeft className="h-4 w-4" />
            back to devlog
          </Link>
        </div>
      </main>
    </div>
  );
}
