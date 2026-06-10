import Link from 'next/link';
import PrimaryNav from '../../components/PrimaryNav';
import ScrollReveal from '../../components/ScrollReveal';
import { ThemeToggle } from '../../components/ThemeToggle';
import { devlogPosts } from '../../data/devlog';

export const metadata = {
  title: 'Devlog',
};

export default function DevlogIndex() {
  // Newest first, drafts hidden.
  const posts = devlogPosts
    .filter((p) => !p.draft)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <PrimaryNav />
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <main className="mx-auto max-w-4xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <header className="mb-12">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-foreground/50">
            / writeups
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Devlog
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            Technical writeups, design decisions, and notes from work in progress.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="border border-foreground/20 p-6 font-mono text-sm text-foreground/60">
            No posts published yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {posts.map((post, index) => (
              <ScrollReveal key={post.slug} delay={index * 80}>
                <li>
                  <Link
                    href={`/devlog/${post.slug}`}
                    className="group block border border-foreground/30 bg-card/40 p-6 backdrop-blur-sm transform-gpu transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground hover:bg-foreground/[0.02] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.28),0_0_24px_rgba(255,255,255,0.06)]"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-mono text-xs tracking-[0.2em] text-foreground/50">
                        {post.date}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
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
                    </div>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                      {post.excerpt}
                    </p>
                    <p className="mt-4 font-mono text-xs text-foreground/50 transition-colors group-hover:text-foreground">
                      read →
                    </p>
                  </Link>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
          >
            ← back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
