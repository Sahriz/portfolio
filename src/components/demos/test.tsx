'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
export default function testDemo() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 100;

    useEffect(() => {
      if(!meshRef.current) {
        return
      }
      const tempObject = new THREE.Object3D();
      const tempColor = new THREE.Color();

      for(let i = 0; i < count; i++) {
        tempObject.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
        );
        tempObject.rotation.set(
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI
        );
        tempObject.scale.setScalar(Math.random() * 0.5 + 0.5);
        tempObject.updateMatrix();

        meshRef.current!.setMatrixAt(i, tempObject.matrix);

        tempColor.set(Math.random() * 0xffffff);
        meshRef.current!.setColorAt(i, tempColor);
      }

      meshRef.current.instanceMatrix.needsUpdate = true;
      if(meshRef.current.instanceColor) {meshRef.current.instanceColor.needsUpdate = true};
    }, []);


  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={10} />
      <color attach="background" args={['#ffffff']} />
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]}/>
        <meshStandardMaterial color="#ffffff" />
      </instancedMesh>
    </>
  );
}
