# Handoff

## Context

Portfolio site in Next.js app router. The conversation started with UI polish across the hero demo and card surfaces, then moved into a codebase-wide refactor review focused on duplication, shallow modules, and coupled logic.

## Completed Work

- Hero demo title in `src/components/HeroScene.tsx` links to the active demo route.
- Card hover behavior was unified across project, paper, demo, and devlog surfaces.
- Project cards use the joystick icon and a `view project` CTA.
- Paper cards keep a green `view paper` hover state and a blue `view project` CTA.
- Demo cards use a purple `view demo` hover state.
- Project detail pages now have two fixed buttons:
  - `Back to All Projects` -> `/projects`
  - `Home` -> `/`
- Validation was run on the touched files after the recent fixes; no parse errors were found.

## Code Areas Changed Recently

- `src/app/projects/[projectId]/page.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/PaperCard.tsx`
- `src/components/DemoCard.tsx`
- `src/app/globals.css`

## Refactor Candidates Identified

1. Shared page chrome for the main sections.
   - Files: `src/components/PrimaryNav.tsx`, `src/app/page.tsx`, `src/app/projects/page.tsx`, `src/app/papers/page.tsx`, `src/app/demos/page.tsx`, `src/app/courses/page.tsx`
   - Problem: repeated scroll-hide behavior and fixed nav/theme-toggle placement.
   - Value: one seam for navigation behavior, less drift.

2. Shared markdown content host.
   - Files: `src/app/projects/[projectId]/page.tsx`, `src/components/ProjectReader.tsx`, `src/app/devlog/[slug]/page.tsx`
   - Problem: markdown loading, parsing, and loading/error states are duplicated.
   - Value: centralize content loading policy and reduce duplication.

3. Unified content registry.
   - Files: `src/data/projects.ts`, `src/data/papers.ts`, `src/data/demos.ts`, `src/data/devlog.ts`, `src/components/demos/registry.ts`, `src/app/demos/[demoId]/page.tsx`, `src/app/devlog/[slug]/page.tsx`, `src/app/projects/[projectId]/layout.tsx`
   - Problem: IDs, metadata, static params, and lookup rules are expressed in several different shapes.
   - Value: tighter locality for content routing and metadata.

4. Shared collection-page shell.
   - Files: `src/app/projects/page.tsx`, `src/app/papers/page.tsx`, `src/app/demos/page.tsx`, `src/app/devlog/page.tsx`
   - Problem: repeated outer page layout and CTA placement.
   - Value: easier to add or restyle sections consistently.

5. Shared card frame.
   - Files: `src/components/ProjectCard.tsx`, `src/components/PaperCard.tsx`, `src/components/DemoCard.tsx`, `src/components/ui/card.tsx`
   - Problem: outer card frame, hover treatment, icon badge, and action area are implemented separately.
   - Value: fewer styling drift bugs and a clearer visual contract.

## Next Session Recommendation

If continuing architecture work, start with the shared markdown content host or the shared page chrome. Those two look highest leverage and would remove the most repeated logic with the least risk.

## Suggested Skills

- `improve-codebase-architecture`
- `tdd` if the next pass includes behavior changes that need regression coverage
