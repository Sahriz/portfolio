'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

/**
 * Reference demo — the template every demo follows.
 *
 * The contract:
 *   - Default-export a component with no required props.
 *   - Return scene content only (meshes, lights, etc.) — never a <Canvas>.
 *     The host (DemoViewer today, the hero rotation later) owns the canvas,
 *     because WebGL contexts are scarce: one per page, demos share it.
 *   - Own everything inside the scene, lights included, so each demo is
 *     self-contained and host-agnostic.
 *   - Per-frame animation goes in useFrame; mutate refs, never setState.
 *   - Teardown is automatic: react-three-fiber disposes GPU resources
 *     (geometry, materials, textures) when the component unmounts.
 */
export default function SpinningCubeDemo() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * 0.9;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#47a4cc" flatShading />
      </mesh>
    </>
  );
}
