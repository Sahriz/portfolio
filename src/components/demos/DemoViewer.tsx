'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { demoComponents } from './registry';

interface DemoViewerProps {
  demoId: string;
}

/**
 * Client host for a single demo. Owns the <Canvas> — one WebGL context per
 * page; the demo renders inside it. The canvas fills whatever container the
 * page provides. Kept deliberately bare (default camera, no lights): each
 * demo is responsible for everything inside the scene. The Suspense
 * boundary catches the demo's lazy-loading; nothing renders until its
 * chunk arrives.
 */
export default function DemoViewer({ demoId }: DemoViewerProps) {
  const Demo = demoComponents[demoId];

  if (!Demo) {
    // Metadata exists in data/demos.ts but no component was registered —
    // step 3 of the checklist in that file was missed.
    return (
      <div className="grid h-full w-full place-items-center font-mono text-sm text-foreground/60">
        Demo &quot;{demoId}&quot; has no registered component.
      </div>
    );
  }

  return (
    <Canvas style={{ width: '100%', height: '100%' }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <Demo />
      </Suspense>
    </Canvas>
  );
}
