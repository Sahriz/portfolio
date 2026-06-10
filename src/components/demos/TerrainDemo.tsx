'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import ShaderBanner from '../ShaderBanner';
import Background from '../Background';

// Camera reveal parameters — used by the useFrame below.
const REVEAL_DURATION = 8;   // seconds
const START_Z = 6;            // close foreground view
const END_Z   = 12;           // resting wide view
const START_Y = 1.5;          // slightly lower at the start
const END_Y   = 2.0;          // standard height

/**
 * The procedural terrain — flagship demo. Fully self-contained per the demo
 * contract: brings its own camera (the hero's telephoto framing), lights,
 * background plane, and drag-to-spin interaction. Works identically inside
 * the hero rotation and on its standalone /demos/terrain page.
 */
export default function TerrainDemo() {
  const spinRef = useRef(0);
  const timeSpinDirRef = useRef(1);
  const isDraggingRef = useRef(false);
  const spinVelocityRef = useRef(0);
  const revealElapsedRef = useRef(0);
  const { camera, gl } = useThree();

  // Drag-to-spin, attached to the canvas element itself so the interaction
  // travels with the demo. Pointer events cover mouse, touch, and pen —
  // touch-action: pan-y keeps vertical scrolling working on phones while
  // horizontal drags rotate the terrain.
  useEffect(() => {
    const el = gl.domElement;
    const prevTouchAction = el.style.touchAction;
    el.style.touchAction = 'pan-y';

    let dragStartX = 0;
    let dragStartSpin = 0;
    let dragLastX = 0;
    let dragLastTime = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      dragStartX = e.clientX;
      dragStartSpin = spinRef.current;
      dragLastX = e.clientX;
      dragLastTime = performance.now();
      spinVelocityRef.current = 0;
      document.body.style.userSelect = 'none';
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      spinRef.current = dragStartSpin - (e.clientX - dragStartX) * 0.005;

      const now = performance.now();
      const dt = (now - dragLastTime) / 1000;
      if (dt > 0) {
        const velocity = -(e.clientX - dragLastX) * 0.005 / dt;
        spinVelocityRef.current = velocity;
        if (Math.abs(velocity) > 0.001 && Math.sign(velocity) !== timeSpinDirRef.current) {
          timeSpinDirRef.current = Math.sign(velocity);
        }
      }
      dragLastX = e.clientX;
      dragLastTime = now;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      document.body.style.userSelect = '';
    };

    el.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      el.style.touchAction = prevTouchAction;
      document.body.style.userSelect = '';
    };
  }, [gl]);

  useFrame((_, delta) => {
    // Cinematic dolly-back + small Y lift. Cubic ease-out — decelerates into the rest pose.
    if (revealElapsedRef.current < REVEAL_DURATION) {
      revealElapsedRef.current = Math.min(revealElapsedRef.current + delta, REVEAL_DURATION);
      const t = revealElapsedRef.current / REVEAL_DURATION;
      const eased = 1 - Math.pow(1 - t, 3);
      camera.position.z = START_Z + (END_Z - START_Z) * eased;
      camera.position.y = START_Y + (END_Y - START_Y) * eased;
    }

    if (isDraggingRef.current) return;
    const absVel = Math.abs(spinVelocityRef.current);
    const decay = Math.pow(0.96, delta * 60);
    if (absVel > 0.1) {
      spinRef.current += spinVelocityRef.current * delta;
      spinVelocityRef.current *= decay;
    } else if (absVel > 0.01) {
      const blend = (absVel - 0.01) / 0.09;
      spinRef.current += blend * spinVelocityRef.current * delta + (1 - blend) * delta * 0.125 * timeSpinDirRef.current;
      spinVelocityRef.current *= decay;
    } else {
      spinRef.current += delta * 0.125 * timeSpinDirRef.current;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, START_Y, START_Z]} fov={20} near={0.1} far={1000} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 10]} intensity={0.7} />
      <mesh position={[0, 0, -25]}>
        <planeGeometry args={[250, 250]} />
        <Background />
      </mesh>
      <mesh position={[0, 2, -2]}>
        {/* Reduced from 600,600 to 300,300 for 4x fewer vertices while maintaining detail */}
        <planeGeometry args={[25, 25, 300, 300]} />
        <ShaderBanner spinRef={spinRef} />
      </mesh>
    </>
  );
}
