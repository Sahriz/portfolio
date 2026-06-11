'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * WIP experiment: instanced rendering. A single draw call renders `count`
 * cubes — per-instance transforms and colors are written once into the
 * InstancedMesh's buffers on mount.
 */
export default function TestDemo() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 100;

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const tempObject = new THREE.Object3D();
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
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

      mesh.setMatrixAt(i, tempObject.matrix);

      tempColor.set(Math.random() * 0xffffff);
      mesh.setColorAt(i, tempColor);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={10} />
      <color attach="background" args={['#ffffff']} />
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </instancedMesh>
    </>
  );
}
