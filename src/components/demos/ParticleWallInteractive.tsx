'  client';

import { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

/**
 * WIP experiment: instanced rendering. A single draw call renders `count`
 * cubes — per-instance transforms and colors are written once into the
 * InstancedMesh's buffers on mount.
 */
export default function ParticleWallInteractiveDemo() {
  const camRef = useRef<THREE.OrthographicCamera>(null);
  const wallPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);

  const separation = 20;
  const amountX = 100;
  const amountY = 100;
  const numOfParticles = amountX * amountY;
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
  }), []);

  useLayoutEffect(() => {
    const cam = camRef.current;
    if (!cam) return;
    cam.rotateZ(Math.PI/2);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  });


  const positions = useMemo(() => {
    const arr = new Float32Array(numOfParticles * 3);

    let i = 0;
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        arr[i] = ix * separation - ((amountX * separation) / 2); // x
        arr[i + 1] = iy * separation - ((amountY * separation) / 2);; // y
        arr[i + 2] =  0;// z

        i += 3;
      }
    }

    return arr;
  }, []);



  useFrame((state, delta) => {
    state.raycaster.setFromCamera(state.pointer, state.camera);
    state.raycaster.ray.intersectPlane(wallPlane, mouseWorld);
    uniforms.uMouse.value.copy(mouseWorld);
    uniforms.uTime.value += delta;
  });

  return (
    <>
      <OrthographicCamera makeDefault ref={camRef}
        position={[0, 0, 1]} near={0.1} far={1000} />
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
          uniform vec2 uMouse;
          varying float vHeight;
          varying float uInfluence;


          
          void main() {
            vec3 pos = position;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            float dist = distance(pos.xy, uMouse);
            float influence = 1.0 - smoothstep(0.0, 500.0, dist);
            pos.z += influence * 0.5;
            
            vec2 dir = normalize(uMouse-pos.xy);
            pos.xy += dir * influence * 5.0;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

            vHeight = influence*25.0;
            uInfluence = influence;
            gl_PointSize = influence * 5.0;
          }
        `}
        fragmentShader={`
          varying float vHeight;
          varying float uInfluence;
          vec3 palette(float t) {
            return vec3(0.5) + vec3(0.5) * cos(6.28318 * (vec3(1.0) * t + vec3(0.0, 0.33, 0.67)));
          }
          void main() {
            if(uInfluence < 0.01) {
              discard;
            }
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
