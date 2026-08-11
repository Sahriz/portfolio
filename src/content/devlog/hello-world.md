# Hello, devlog

This is the first entry. I'll use this space for technical writeups about the projects I'm working on: design decisions, performance work, things that didn't make it into a project README.

## What to expect

- **Short-form posts**, roughly 5 to 10 minute reads, not blog-length essays.
- **Code snippets where they help**, not where they're decoration.
- **Honest writeups**, including the dead ends and the reverts.

## How to add a new post

1. Create a new markdown file in `src/content/devlog/{your-slug}.md`.
2. Add a matching entry to `devlogPosts` in `src/data/devlog.ts` with the same `slug`, plus `title`, `date`, and `excerpt`.
3. The index page picks it up automatically. Sort order is newest-first by `date`.

First real post coming soon.
