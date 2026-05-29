import { useMemo, MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';

interface ShaderBannerProps {
  spinRef: MutableRefObject<number>;
}

const ShaderBanner: React.FC<ShaderBannerProps> = ({ spinRef }) => {
  const uniforms = useMemo(() => ({ u_time: { value: 1.0 }, u_spin: { value: 0 } }), []);

  useFrame((_, delta) => {
    uniforms.u_time.value += delta;
    uniforms.u_spin.value = spinRef.current;
  });

  return (
    <shaderMaterial
      attach="material"
      extensions={{ derivatives: true } as unknown as never}
      vertexShader={`
        varying vec2 vUv;
        varying vec3 vWorldPos;
        out float perlinNoise;
        uniform float u_time;
        uniform float u_spin;


        float random (in vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        // 2D Noise based on Morgan McGuire @morgan3d
        // https://www.shadertoy.com/view/4dS3Wd
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) +
                 (c - a) * u.y * (1.0 - u.x) +
                 (d - b) * u.x * u.y;
        }

        float multiOctave(vec2 st) {
          st.x += 10.0;
          float frequency = 0.3;
          float amplitude = 1.0;
          float totalNoise = 0.0;
          for (int i = 0; i < 5; i++) {
            frequency *= 2.0;
            amplitude *= 0.5;
            totalNoise += noise(st * frequency) * amplitude;
          }
          return totalNoise;
        }


        void main() {
          float rot = u_spin;
          mat4 rotationY = mat4(
            cos(rot), 0, sin(rot), 0,
            0, 1, 0, 0,
            -sin(rot), 0, cos(rot), 0,
            0, 0, 0, 1
          );
          mat4 rotationXConst = mat4(
            1, 0, 0, 0,
            0, cos(3.14 / 2.0), -sin(3.14 / 2.0), 0,
            0, sin(3.14 / 2.0), cos(3.14 / 2.0), 0,
            0, 0, 0, 1
          );
          mat4 rotationXConst2 = mat4(
            1, 0, 0, 0,
            0, cos(-3.14 / 8.0), -sin(-3.14 / 8.0), 0,
            0, sin(-3.14 / 8.0), cos(-3.14 / 8.0), 0,
            0, 0, 0, 1
          );

          vec3 newPosition = position;
          // Static noise frequency — terrain shape is fixed. The "reveal" comes from the camera
          // pulling back over time (see HeroScene), not from morphing geometry.
          float perlin = multiOctave(position.xy * 3.0);
          // Water is flat: anywhere the biome color is water (perlin < 0.39),
          // clamp the height so the surface stays level instead of following the noise.
          newPosition.z = perlin;
          if (perlin < 0.39) {
            newPosition.z = 0.39;
          }

          // Position after all object-space rotations — this is the space the lighting
          // uses, so the sun direction below stays consistent regardless of u_spin.
          vec4 rotatedPos = rotationXConst2 * rotationY * rotationXConst * vec4(newPosition, 1.0);
          vWorldPos = rotatedPos.xyz;

          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * rotatedPos;
          perlinNoise = perlin;
        }
      `}
      fragmentShader={`
        uniform float u_time;
        varying vec2 vUv;
        varying vec3 vWorldPos;
        in float perlinNoise;

        void main() {
          // ----- Biome color from elevation -----
          vec3 baseColor = vec3(0.9);                          // snow
          if (perlinNoise < 0.72) baseColor = vec3(0.4);       // rock
          if (perlinNoise < 0.55) baseColor = vec3(61.0, 121.0, 111.0) / 255.0;  // grass
          if (perlinNoise < 0.44) baseColor = vec3(222.0, 205.0, 180.0) / 255.0; // sand
          if (perlinNoise < 0.39) baseColor = vec3(71.0,  164.0, 204.0) / 255.0; // shallow water
          if (perlinNoise < 0.27) baseColor = vec3(39.0,  128.0, 150.0) / 255.0; // deep water

          // ----- Per-fragment normal via screen-space derivatives -----
          // dFdx/dFdy on a world-space varying give surface tangents, which cross to
          // the world-space surface normal. Flat-shaded per triangle — fits the voxel look.
          vec3 N = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
          // Heuristic: terrain faces upward, so force the normal into the upper hemisphere.
          N *= sign(N.y);

          // ----- Warm sun + cool ambient -----
          vec3 sunDir       = normalize(vec3(0.5, 0.85, 0.3));
          vec3 sunColor     = vec3(1.00, 0.88, 0.70);  // warm golden-white
          vec3 ambientColor = vec3(0.42, 0.45, 0.55);  // soft cool sky-bounce

          float diffuse     = max(dot(N, sunDir), 0.0);
          vec3 illumination = ambientColor + sunColor * diffuse;

          gl_FragColor = vec4(baseColor * illumination, 1.0);
        }
      `}
      uniforms={uniforms}
    />
  );
};

export default ShaderBanner;
