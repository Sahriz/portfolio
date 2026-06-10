'use client';

import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

// Maps demo id (see src/data/demos.ts) → lazily-loaded scene component.
//
// Why this lives apart from data/demos.ts: these loaders are client-only
// (three.js needs a browser), and functions cannot be passed across Next's
// server/client boundary. Metadata stays server-safe over there; components
// register here. The two sides meet on the shared id.
//
// React.lazy (rather than next/dynamic) is deliberate: lazy components
// suspend, so the hosts can wrap them in <Suspense> and know exactly when
// a demo's code has loaded — the hero uses this to keep the page's blackout
// curtain closed until the chosen demo is actually rendering. The import()
// only executes in the browser, when the component first renders inside a
// <Canvas>, so each page downloads only the demo it shows.
export const demoComponents: Record<string, LazyExoticComponent<ComponentType>> = {
  'spinning-cube': lazy(() => import('./SpinningCubeDemo')),
  'terrain': lazy(() => import('./TerrainDemo')),
  'test-demo': lazy(() => import('./test')),
};
