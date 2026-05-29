'use client';

import { memo, useRef, MutableRefObject, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import ShaderBanner from './ShaderBanner';
import Background from './Background';

interface TerrainProps {
  spinRef: MutableRefObject<number>;
  timeSpinDirRef: MutableRefObject<number>;
  isDraggingRef: MutableRefObject<boolean>;
  spinVelocityRef: MutableRefObject<number>;
  onReady: () => void;
}

// Camera reveal parameters — used by Terrain's useFrame.
const REVEAL_DURATION = 8;   // seconds
const START_Z = 6;            // close foreground view
const END_Z   = 12;           // resting wide view
const START_Y = 1.5;          // slightly lower at the start
const END_Y   = 2.0;          // standard height

const Terrain = ({ spinRef, timeSpinDirRef, isDraggingRef, spinVelocityRef, onReady }: TerrainProps) => {
  const readyFired = useRef(false);
  const revealElapsedRef = useRef(0);
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!readyFired.current) {
      readyFired.current = true;
      onReady();
    }

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
    <mesh position={[0, 2, -2]}>
      {/* Reduced from 600,600 to 300,300 for 4x fewer vertices while maintaining detail */}
      <planeGeometry args={[25, 25, 300, 300]} />
      <ShaderBanner spinRef={spinRef} />
    </mesh>
  );
};

interface HeroSceneProps {
  spinRef: MutableRefObject<number>;
  timeSpinDirRef: MutableRefObject<number>;
  isDraggingRef: MutableRefObject<boolean>;
  spinVelocityRef: MutableRefObject<number>;
  onReady: () => void;
}

function HeroScene(props: HeroSceneProps) {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', transform: 'translateZ(0)' }}>
      <Canvas
        gl={{ alpha: false, antialias: false, stencil: false, depth: true }}
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, START_Y, START_Z], fov: 20, near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
        // Pause the rendering loop when not visible
        frameloop={isVisible ? 'always' : 'never'}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={0.7} />
        <mesh position={[0, 0, -25]}>
          <planeGeometry args={[250, 250]} />
          <Background />
        </mesh>
        <Terrain {...props} />
      </Canvas>
    </div>
  );
}

export default memo(HeroScene);
