import { useRef } from 'react';
import { ShaderMaterial } from 'three';

const Background: React.FC = () => {
  const materialRef = useRef<ShaderMaterial>(null);

  // No uniforms needed for this simple gradient

  return (
    <shaderMaterial
      ref={materialRef}
      attach="material"
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4((850.0-gl_FragCoord.y) / 500.0, (850.0-gl_FragCoord.y) / 500.0, (850.0-gl_FragCoord.y) / 500.0, 1.0); // Simple gradient based on UV coordinates
        }
      `}
    />
  );
};

export default Background;
