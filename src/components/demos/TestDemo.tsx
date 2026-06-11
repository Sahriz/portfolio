'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/**
 * WIP experiment: instanced rendering. A single draw call renders `count`
 * cubes — per-instance transforms and colors are written once into the
 * InstancedMesh's buffers on mount.
 */
export default function TestDemo() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const count = 5000;

  const hoverRef = useRef<{ id: number; savedHex: number } | null>(null);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const tempObject = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      tempObject.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
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

  useFrame((state) => {
    const cam = camRef.current;
    const mesh = meshRef.current;
    if (!cam || !mesh) return;

    const angle = state.clock.elapsedTime * 0.015;
    const radius = 30;

    cam.position.x = Math.sin(angle) * radius;
    cam.position.z = Math.cos(angle) * radius;
    cam.position.y = 15;
    cam.lookAt(0, 0, 0);

    cam.updateMatrixWorld();

    state.raycaster.setFromCamera(state.pointer, cam);
    const hits = state.raycaster.intersectObject(mesh, false);
    const id = hits[0]?.instanceId;

    const prev = hoverRef.current;
    if (prev?.id === id) {return;}

    if(prev) {
      mesh.setColorAt(prev.id, tempColor.setHex(prev.savedHex));
    }

    if(id !== undefined) {
      mesh.getColorAt(id, tempColor);
      hoverRef.current = { id, savedHex: tempColor.getHex() };
      mesh.setColorAt(id, tempColor.setHex(0x00ff00));
    }
    else{
      hoverRef.current = null;
    }

    if(mesh.instanceColor) {mesh.instanceColor.needsUpdate = true};
    
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={camRef}
        position={[0, 15, 30]} fov={50} near={0.1} far={300} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={10} />
      <color attach="background" args={['hsl(0, 0%, 48%)']} />
      <instancedMesh ref={meshRef}
        args={[undefined, undefined, count]} onClick={(e) => {
          e.stopPropagation();
          if(e.delta > 2 ||e.instanceId === undefined) return;
          if(e.object) {
            const id = e.instanceId;
            meshRef.current!.getColorAt(id, tempColor);
            console.log(`Clicked instance ${id} with color #${tempColor.getHexString()}`);
            const mesh = meshRef.current;
            if(mesh){
              const tempMatrix = new THREE.Matrix4();
              const tempPosition = new THREE.Vector3();
              const tempQuaternion = new THREE.Quaternion();
              const tempScale = new THREE.Vector3();
              
              mesh.getMatrixAt(id, tempMatrix);
              tempMatrix.decompose(tempPosition, tempQuaternion, tempScale);
              tempScale.multiplyScalar(2.0);
              tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
              mesh.setMatrixAt(id, tempMatrix);
              mesh.instanceMatrix.needsUpdate = true;
            }
            
          }
        }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </instancedMesh>
    </>
  );
}
