'  client';

import { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/**
 * WIP experiment: instanced rendering. A single draw call renders `count`
 * cubes — per-instance transforms and colors are written once into the
 * InstancedMesh's buffers on mount.
 */
export default function HoleDemo
  () {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ballRef = useRef<THREE.InstancedMesh>(null);
  const wallPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const ballCount = 750;

  let CRATER_RADIUS = 2;
  const CRATER_DEPTH = 2;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uCraterRadius: { value: CRATER_RADIUS },
    uCraterDepth: { value: CRATER_DEPTH },
  }), []);

const balls = useMemo(() =>
  Array.from({ length: ballCount }, () => ({
    pos: new THREE.Vector3((Math.random() - 0.5) * 100, Math.random() * 40 + 15, (Math.random() - 0.5) * 100),
    vel: new THREE.Vector3(0, 0, 0),
    radius: Math.random() * 0.5 + 0.4,
  })), []);

  useLayoutEffect(() => {
    const mesh = ballRef.current;
    if (!mesh) return;
    for (let i = 0; i < ballCount; i++) {
      tempColor.setHSL(Math.random(), 0.75, 0.5);
      mesh.setColorAt(i, tempColor);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);
  useFrame((state, delta) => {

    state.raycaster.setFromCamera(state.pointer, state.camera);
    state.raycaster.ray.intersectPlane(wallPlane, mouseWorld);
    uniforms.uMouse.value.set(mouseWorld.x, mouseWorld.z);
    uniforms.uTime.value += delta;

    const cam = camRef.current;
    if (cam) {
      const angle = uniforms.uTime.value * 0.035;
      const radius = 30;
      
      cam.position.x = Math.sin(angle) * radius;
      cam.position.z = Math.cos(angle) * radius;

      cam.lookAt(0, 0, 0);
      
      cam.updateProjectionMatrix();
    }

    const mesh = ballRef.current;
    if (mesh) {

    const dt = Math.min(delta, 0.05);
    balls.forEach((ball, i) => {
      const prevVelY = ball.vel.y;
      ball.vel.y -= 20.0 * dt;
      ball.pos.addScaledVector(ball.vel, dt);
      const floor = 0 + ball.radius;
      const mousePos = new THREE.Vector2(mouseWorld.x, mouseWorld.z);
      if(ball.pos.y <= floor && mousePos.distanceTo(new THREE.Vector2(ball.pos.x, ball.pos.z)) < CRATER_RADIUS) {
        const dir = new THREE.Vector3().subVectors(mouseWorld, ball.pos).setY(0).normalize();
        if(mousePos.distanceTo(new THREE.Vector2(ball.pos.x, ball.pos.z)) > CRATER_RADIUS * 0.5 && prevVelY === 0) {
          ball.vel.addScaledVector(dir, 1.5);
        }
      }
      else if(ball.pos.y < floor-15.0) {
        ball.pos.set((Math.random() - 0.5) * 100, Math.random() * 40 + 5, (Math.random() - 0.25) * 25);
        ball.vel.set(0, 0, 0);
        if(CRATER_RADIUS < 10) {
          CRATER_RADIUS += 0.25;
          uniforms.uCraterRadius.value = CRATER_RADIUS;
        }
      }
      else if(ball.pos.y < floor && ball.pos.y > floor - 1.5) {
        ball.pos.y = floor;
        ball.vel.y *= -0.6;
        if(Math.abs(ball.vel.y) < 0.3) {
          ball.vel.y = 0;
        }
      }
      tempObject.position.copy(ball.pos);
        tempObject.scale.setScalar(ball.radius);
        tempObject.updateMatrix();
        mesh.setMatrixAt(i, tempObject.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }});

  return (
    <>
      <PerspectiveCamera makeDefault ref={camRef}
        position={[0, 15, 30]} near={0.1} far={1000} onUpdate={(cam) => cam.lookAt(0,0,0)}/>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={10} />
      <color attach="background" args={['hsl(0, 0%, 100%)']} />
      <instancedMesh ref={ballRef} args={[undefined, undefined, ballCount]} frustumCulled={false} castShadow receiveShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial />
      </instancedMesh>
      <mesh position={[0, 0, -50]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
      <mesh rotation={[0, Math.PI/2, 0]} position={[-50, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
      <mesh rotation={[0, -Math.PI/2, 0]} position={[50, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
      <mesh rotation={[0, 0, Math.PI]} position={[0,0,50]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100, 400, 400]} ref={meshRef} />
        <shaderMaterial attach="material"
          vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uCraterRadius;
          uniform float uCraterDepth;
          varying float vHeight;
          varying float uInfluence;
          varying vec3 vNormal;

          

          

          float influenceAt(vec2 p) {
            return 1.0 - smoothstep(0.0, uCraterRadius, distance(p, uMouse));
          }

          float heightAt(vec2 pos) {
            return -uCraterDepth * influenceAt(pos);
          }
          void main() {
            vec3 pos = position;

            vec4 worldPos = modelMatrix * vec4(pos, 1.0);

            float dist = distance(worldPos.xz, uMouse);
            float influence = influenceAt(worldPos.xz);

            
            float e = 0.5;
            float dhdx = (heightAt(worldPos.xz + vec2(e, 0.0)) - heightAt(worldPos.xz - vec2(e, 0.0))) / (2.0 * e);
            float dhdz = (heightAt(worldPos.xz + vec2(0.0, e)) - heightAt(worldPos.xz - vec2(0.0, e))) / (2.0 * e);
            vec3 normal = normalize(vec3(-dhdx, 1.0, -dhdz));

            vec2 dir = normalize(uMouse-pos.xz);

            vHeight = influence*25.0;
            worldPos.y += heightAt(worldPos.xz);
            uInfluence = influence;

            vNormal = normal;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
          fragmentShader={`
          varying float vHeight;
          varying float uInfluence;
          varying vec3 vNormal;
          vec3 palette(float t) {
            return vec3(0.5) + vec3(0.5) * cos(6.28318 * (vec3(1.0) * t + vec3(0.0, 0.33, 0.67)));
          }
          void main() {

            if(uInfluence > 0.25) {
              discard;
            }
            
            float light = dot(normalize(vNormal), normalize(vec3(0.5, 1.0, 0.5))) * 0.5 + 0.5;

            vec3 color = vec3(0.7);

            gl_FragColor = vec4(vec3(light) * color, 1.0);
          }
      `}
          uniforms={uniforms} />

      </mesh>

    </>
  );
}
