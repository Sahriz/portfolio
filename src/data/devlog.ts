export interface DevlogPost {
  /** URL slug — must match the filename in src/content/devlog/{slug}.md */
  slug: string;
  title: string;
  /** YYYY-MM-DD. Used for sorting and display. */
  date: string;
  /** One-line summary shown on the index page. */
  excerpt: string;
  /** Optional tags for filtering / future use. */
  tags?: string[];
  /** Optional path to a cover image under /public. */
  cover?: string;
  /** If true, hidden from the index page. */
  draft?: boolean;
}

// Add new posts here. The index page automatically sorts by date desc and filters out drafts.
export const devlogPosts: DevlogPost[] = [
  {
    slug: 'hello-world',
    title: 'Hello, devlog',
    date: '2026-05-28',
    excerpt: 'Kicking off this devlog. What I plan to write about and how to read it.',
    tags: ['meta'],
  },
];
