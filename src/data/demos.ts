export interface Demo {
  id: string;
  title: string;
  description: string;
  /** If true, eligible for the hero rotation on the landing page. */
  featured?: boolean;
}

// Adding a demo is three steps:
//   1. Create the scene component in src/components/demos/<Name>Demo.tsx
//      (copy SpinningCubeDemo.tsx — it documents the contract).
//   2. Add its metadata here. The id becomes the URL: /demos/<id>.
//   3. Register the component in src/components/demos/registry.ts.
//
// This file deliberately contains no component imports: it is read by server
// code (generateMetadata, generateStaticParams), while component loaders are
// client-only and cannot cross the server/client boundary. The two sides
// meet on the shared `id` string.
export const demos: Demo[] = [
  {
    id: 'terrain',
    title: 'Procedural Terrain',
    description:
      'Multi-octave simplex terrain with elevation biomes, water specular and distance fog. Drag to spin.',
    featured: true,
  },
  {
    id: 'spinning-cube',
    title: 'Spinning Cube',
    description: 'The minimal template every other demo is built from.',
    featured: false,
  },
  {
    id: 'cube-demo',
    title: 'Cube Demo',
    description: 'Five thousand cubes in a single instanced draw call. Hover one to pick it out.',
    featured: true,
  },
  {
    id: 'wave',
    title: 'Wave Experiment',
    description: 'A quarter of a million points rolling on a wave, animated entirely in a vertex shader.',
    featured: true,
  },
  {
    id: 'particle-wall-interactive',
    title: 'Particle Wall',
    description: 'Ten thousand points on a grid, pushed around by the cursor in a vertex shader.',
    featured: true,
  },
  {
    id: 'hole',
    title: 'Hole Demo',
    description: 'Clipping planes cut a crater that follows your cursor, with balls rolling into it.',
    featured: true,
  }
];

export function getDemo(id: string): Demo | undefined {
  return demos.find((d) => d.id === id);
}
