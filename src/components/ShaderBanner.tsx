import { useMemo, MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

interface ShaderBannerProps {
  spinRef: MutableRefObject<number>;
}

const ShaderBanner: React.FC<ShaderBannerProps> = ({ spinRef }) => {
  const uniforms = useMemo(
    () => ({
      u_time: { value: 1.0 },
      u_spin: { value: 0 },
      // Sun direction is updated per-frame in useFrame (45s cycle).
      u_sunDir: { value: new Vector3(0.5, 0.85, 0.3).normalize() },
      // Distance-fog parameters. Foreground stays crisp; back of terrain fades.
      u_fogColor: { value: new Vector3(0.10, 0.13, 0.18) },
      u_fogNear: { value: 8.0 },
      u_fogFar: { value: 32.0 },
    }),
    []
  );

  useFrame((_, delta) => {
    uniforms.u_time.value += delta;
    uniforms.u_spin.value = spinRef.current;

    // Non-uniform sun cycle:
    //   • 80% of the 45 s cycle: slow east-to-west arc — sun is visibly moving,
    //     this is the part the viewer notices.
    //   • 20%: fast "snap back" west-to-east return at constant high altitude
    //     so the loop closes without a discontinuity.
    // Sun is constrained to the −Z half-space (in front of the viewer, in the
    // direction the camera is looking) so the reflective glint on water can
    // actually reach the camera at most positions in the cycle.
    const t = uniforms.u_time.value;
    const period = 45;
    const slowFraction = 0.8;
    const phase = (((t / period) % 1) + 1) % 1;  // safe positive mod, 0..1

    let cycleParam: number;
    if (phase < slowFraction) {
      cycleParam = phase / slowFraction;                                 // 0 → 1 slowly
    } else {
      cycleParam = 1 + (phase - slowFraction) / (1 - slowFraction);      // 1 → 2 quickly
    }
    const angle = cycleParam * Math.PI;  // 0 → 2π over the cycle

    uniforms.u_sunDir.value
      .set(
        Math.sin(angle) * 0.60,                  // east-west sweep
        0.60 + Math.cos(angle) * 0.20,           // altitude: 0.40 → 0.80 (higher overall)
        -0.55,                                   // in front of viewer (−Z)
      )
      .normalize();
  });

  return (
    <shaderMaterial
      attach="material"
      extensions={{ derivatives: true } as unknown as never}
      vertexShader={`
        varying vec3 vWorldPos;
        out float perlinNoise;
        uniform float u_time;
        uniform float u_spin;


        float random (in vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

        float noise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                  -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        float multiOctave(vec2 st) {
          // st.x += 10.0;
          float frequency = 0.1;
          float amplitude = 1.0;
          float totalNoise = 0.0;
          float possibleAmplitude = 0.0;
          for (int i = 0; i < 5; i++) {
            frequency *= 2.0;
            amplitude *= 0.5;
            totalNoise += noise(st * frequency) * amplitude;
            possibleAmplitude += amplitude;
          }
          totalNoise /= possibleAmplitude;  // Normalize to [−1, 1]
          totalNoise = totalNoise * 0.5 + 0.5;  // Shift to [0, 1]
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
          // Static noise frequency — terrain shape is fixed.
          float perlin = multiOctave(position.xy * 3.0);
          // Water is flat: clamp height at the water-color threshold.
          newPosition.z = perlin;
          if (perlin < 0.46) {
            newPosition.z = 0.44;
          }

          // World-space position. The fragment shader uses this for lighting,
          // view direction (for specular), and distance fog. Computing world
          // space here means we can use the built-in cameraPosition uniform.
          vec4 worldPos = modelMatrix * rotationXConst2 * rotationY * rotationXConst * vec4(newPosition, 1.0);
          vWorldPos = worldPos.xyz;

          gl_Position = projectionMatrix * viewMatrix * worldPos;
          perlinNoise = perlin;
        }
      `}
      fragmentShader={`
        varying vec3 vWorldPos;
        in float perlinNoise;

        uniform vec3 u_sunDir;
        uniform vec3 u_fogColor;
        uniform float u_fogNear;
        uniform float u_fogFar;

        void main() {
          // ----- Biome color from elevation -----
          vec3 baseColor = vec3(0.9);                                            // snow
          if (perlinNoise < 0.67) baseColor = vec3(0.4);                         // rock
          if (perlinNoise < 0.55) baseColor = vec3(61.0, 121.0, 111.0) / 255.0;  // grass
          if (perlinNoise < 0.48) baseColor = vec3(222.0, 205.0, 180.0) / 255.0; // sand
          if (perlinNoise < 0.44) baseColor = vec3(71.0,  164.0, 204.0) / 255.0; // shallow water
          if (perlinNoise < 0.32) baseColor = vec3(39.0,  128.0, 150.0) / 255.0; // deep water

          // ----- Per-fragment normal via screen-space derivatives -----
          vec3 N = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
          // Force the normal into the upper hemisphere (terrain faces up).
          N *= sign(N.y);

          // ----- View + light directions -----
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 L = normalize(u_sunDir);

          // ----- Lambertian (warm sun + cool ambient) -----
          vec3 sunColor     = vec3(1.00, 0.88, 0.70);
          vec3 ambientColor = vec3(0.42, 0.45, 0.55);
          float diffuse     = max(dot(N, L), 0.0);
          vec3 illumination = ambientColor + sunColor * diffuse;
          vec3 litColor     = baseColor * illumination;

          // ----- Blinn-Phong specular highlight on water only -----
          // Tight, hot pinpoint: exponent 64 → small bright glint where the
          // sun reflects off the flat water surface toward the camera.
          vec3 H = normalize(L + V);
          float specTerm = pow(max(dot(N, H), 0.0), 64.0);
          // Smooth fade across the water-shore boundary so the highlight
          // doesn't cut off at the sand edge.
          float waterMask = 1.0 - smoothstep(0.37, 0.40, perlinNoise);
          vec3 specular = sunColor * specTerm * 2.5 * waterMask;

          vec3 surfaceColor = litColor + specular;

          // ----- Atmospheric perspective (distance fog) -----
          // Distant terrain hazes toward the background sky color. Subtle at
          // close range, stronger as the camera reaches its rest position.
          float dist = length(cameraPosition - vWorldPos);
          float fogFactor = smoothstep(u_fogNear, u_fogFar, dist);
          vec3 finalColor = mix(surfaceColor, u_fogColor, fogFactor);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `}
      uniforms={uniforms}
    />
  );
};

export default ShaderBanner;
