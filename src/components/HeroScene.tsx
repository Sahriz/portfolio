'use client';

import { memo, useRef, MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import ShaderBanner from './ShaderBanner';
import Background from './Background';

interface TerrainProps {
  spinRef: MutableRefObject<number>;
  timeSpinDirRef: MutableRefObject<number>;
  isDraggingRef: MutableRefObject<boolean>;
  spinVelocityRef: MutableRefObject<number>;
  onReady: () => void;
}

const Terrain = ({ spinRef, timeSpinDirRef, isDraggingRef, spinVelocityRef, onReady }: TerrainProps) => {
  const readyFired = useRef(false);

  useFrame((_, delta) => {
    if (!readyFired.current) {
      readyFired.current = true;
      onReady();
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
      <planeGeometry args={[25, 25, 600, 600]} />
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
  return (
    <div style={{ width: '100%', height: '100%', transform: 'translateZ(0)' }}>
      <Canvas
        gl={{ alpha: false, antialias: false }}
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 2, 12], fov: 20, near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
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
