import { useMemo, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

// The sun's path, described in the terrain's own frame (y is up, before the
// terrain is spun or tilted): one steady lap around the terrain, on a circle
// that is tipped so the sun rides higher on one side than the other. It never
// sets, so the hero is never dark, and it never jumps.
const SUN_PERIOD = 80; // seconds for one lap around the terrain
const SUN_START = -Math.PI / 3; // azimuth at load: ahead of the camera, off to the right
const SUN_ELEVATION = (40 * Math.PI) / 180; // average height above the horizon
const SUN_ELEVATION_SWING = (12 * Math.PI) / 180; // how much higher/lower it gets over a lap
// Must match rotationXConst2 in the vertex shader: the terrain's tilt toward the camera.
const TERRAIN_TILT = -Math.PI / 8;

interface ShaderBannerProps {
  spinRef: RefObject<number>;
}

const ShaderBanner: React.FC<ShaderBannerProps> = ({ spinRef }) => {
  const uniforms = useMemo(
    () => ({
      u_time: { value: 1.0 },
      u_spin: { value: 0 },
      // World-space sun direction, updated every frame in useFrame.
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

    // The sun belongs to the terrain, not to the screen. Its position is
    // worked out in the terrain's frame and then put through the same spin
    // and tilt the vertex shader applies to the terrain. So spinning the
    // terrain (by itself or by dragging) carries the light with it, like
    // walking around a landscape, and the shading on a slope changes only
    // because the sun itself has moved.
    const azimuth = SUN_START + ((uniforms.u_time.value - 1) / SUN_PERIOD) * Math.PI * 2;
    const elevation = SUN_ELEVATION + SUN_ELEVATION_SWING * Math.sin(azimuth);
    const lx = Math.cos(elevation) * Math.cos(azimuth);
    const ly = Math.sin(elevation);
    const lz = Math.cos(elevation) * Math.sin(azimuth);

    // Spin about the terrain's up axis (rotationY in the vertex shader)...
    const cs = Math.cos(spinRef.current);
    const sn = Math.sin(spinRef.current);
    const sx = cs * lx - sn * lz;
    const sz = sn * lx + cs * lz;
    // ...then the fixed tilt toward the camera (rotationXConst2).
    const ct = Math.cos(TERRAIN_TILT);
    const st = Math.sin(TERRAIN_TILT);
    uniforms.u_sunDir.value.set(sx, ct * ly + st * sz, -st * ly + ct * sz).normalize();
  });

  return (
    <shaderMaterial
      attach="material"
      vertexShader={`
        varying vec3 vWorldPos;
        varying float perlinNoise;
        uniform float u_time;
        uniform float u_spin;

        const float PI = 3.141592653589793;


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
            0, cos(PI / 2.0), -sin(PI / 2.0), 0,
            0, sin(PI / 2.0), cos(PI / 2.0), 0,
            0, 0, 0, 1
          );
          mat4 rotationXConst2 = mat4(
            1, 0, 0, 0,
            0, cos(-PI / 8.0), -sin(-PI / 8.0), 0,
            0, sin(-PI / 8.0), cos(-PI / 8.0), 0,
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
        varying float perlinNoise;

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
