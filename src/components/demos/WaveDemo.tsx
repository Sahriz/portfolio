'  client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/**
 * WIP experiment: instanced rendering. A single draw call renders `count`
 * cubes — per-instance transforms and colors are written once into the
 * InstancedMesh's buffers on mount.
 */
export default function WaveDemo() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const separation = 1;
  const amountX = 500;
  const amountY = 500;
  const numOfParticles = amountX * amountY;
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);


  const positions = useMemo(() => {
    const arr = new Float32Array(numOfParticles * 3);

    let i = 0;
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        arr[i] = ix * separation - ((amountX * separation) / 2); // x
        arr[i + 1] = 0; // y
        arr[i + 2] = iy * separation - ((amountY * separation) / 2); // z

        i += 3;
      }
    }

    return arr;
  }, []);



  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    const cam = camRef.current;
    if (!cam) return;
    
    const angle = uniforms.uTime.value * 0.035;
    const radius = 30;
    
    cam.position.x = Math.sin(angle) * radius;
    cam.position.z = Math.cos(angle) * radius;

    cam.lookAt(0, 0, 0);

    cam.updateProjectionMatrix();


  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={camRef}
        position={[0, 15, 70]} fov={70} near={0.1} far={1000} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={10} />
      <color attach="background" args={['hsl(0, 0%, 100%)']} />
      <points>
        <bufferGeometry >
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <shaderMaterial attach="material"
          vertexShader={`
        uniform float uTime;
            varying float vHeight;
        
        void main() {
          vec3 pos = position;

          pos.y = 0.0;
          pos.y += sin((pos.x + uTime*8.0) * 0.2) * 2.0;
          pos.y += cos((pos.z + uTime*8.0) * 0.2) * 2.0;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          vHeight = pos.y;

          gl_PointSize = 5.0;
        }
        `}
          fragmentShader={`
          varying float vHeight;

          vec3 palette(float t) {
            return vec3(0.5) + vec3(0.5) * cos(6.28318 * (vec3(1.0) * t + vec3(0.0, 0.33, 0.67)));
          }
        void main() {
          if(distance(gl_PointCoord, vec2(0.5)) > 0.5) {
            discard;
          }
          vec3 color = palette(vHeight * 0.1);
          gl_FragColor = vec4(color, 1.0);
        }
      `}
          uniforms={uniforms} />
      </points>
    </>
  );
}
