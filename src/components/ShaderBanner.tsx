import { useRef, MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial } from 'three';

interface ShaderBannerProps {
  spinRef: MutableRefObject<number>;
}

const ShaderBanner: React.FC<ShaderBannerProps> = ({ spinRef }) => {
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
      materialRef.current.uniforms.u_spin.value = spinRef.current;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      attach="material"
      vertexShader={`
        varying vec2 vUv;
        varying vec3 vNormal;
        out float perlinNoise;
  uniform float u_time;
  uniform float u_spin;


        float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                            vec2(12.9898,78.233)))
                    * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth Interpolation

        // Cubic Hermine Curve.  Same as SmoothStep()
        vec2 u = f*f*(3.0-2.0*f);
        // u = smoothstep(0.,1.,f);
        // Mix 4 coorners percentages
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    float multiOctave(vec2 st){
        st.x += 10.0f;
        float frequency = 0.5f;
        float amplitude = 1.0f;

        float totalNoise = 0.0f;

        for(int i = 0; i < 5; i++){
            frequency *= 2.0f;
            amplitude *= 0.5f;
            totalNoise += noise(st*frequency)*amplitude;
        }

        return totalNoise;
    }


        void main() {
            float rot = u_spin;
            mat4 rotationY = mat4(cos(rot), 0, sin(rot), 0,
                                0, 1, 0, 0,
                                -sin(rot), 0, cos(rot), 0,
                                0, 0, 0, 1);
            mat4 rotationYConst = mat4(cos(35.0), 0, sin(5.0), 0,
                                0, 1, 0, 0,
                                -sin(35.0), 0, cos(35.0), 0,
                                0, 0, 0, 1);
            mat4 rotationZConst = mat4(cos(90.0), -sin(90.0), 0, 0,
                                sin(90.0), cos(90.0), 0, 0,
                                0, 0, 1, 0,
                                0, 0, 0, 1);
                                mat4 rotationXConst = mat4(1, 0, 0, 0,
                                0, cos(3.14/2.0), -sin(3.14/2.0), 0,
                                0, sin(3.14/2.0), cos(3.14/2.0), 0,
                                0, 0, 0, 1);
                                 mat4 rotationXConst2 = mat4(1, 0, 0, 0,
                                0, cos(-3.14/8.0), -sin(-3.14/8.0), 0,
                                0, sin(-3.14/8.0), cos(-3.14/8.0), 0,
                                0, 0, 0, 1);
          vec3 newPosition = position;
          float perlin = 0.0;
          if(u_time > 12.0){
          perlin = multiOctave(position.xy* 12.0 *0.25);
          }
          else{
           perlin = multiOctave(position.xy* u_time *0.25);
          }


          newPosition.z =  perlin;
          if(perlin < 0.35){
            newPosition.z = 0.35;
        }
          vUv = uv;
          gl_Position =  projectionMatrix * modelViewMatrix * rotationXConst2 * rotationY * rotationXConst * vec4(newPosition, 1.0);
          perlinNoise = perlin;
        }
      `}
      fragmentShader={`
          uniform float u_time;
          varying vec2 vUv;
          in float perlinNoise;
          varying vec3 vNormal;

          void main() {
             gl_FragColor = vec4(vec3(0.9), 1.0);
            if(perlinNoise < 0.72){
              gl_FragColor = vec4(vec3(0.4), 1.0);
            }
            if(perlinNoise < 0.55){
              gl_FragColor = vec4(vec3(61.0,121.0,111.0)/255.0, 1.0);
            }
              if(perlinNoise < 0.44){
              gl_FragColor = vec4(vec3(222.0,205.0,180.0)/255.0, 1.0);
              }
            if(perlinNoise < 0.39){
              gl_FragColor = vec4(vec3(71.0,164.0,204.0)/255.0, 1.0);
              }
            if(perlinNoise < 0.27){
              gl_FragColor = vec4(vec3(39.0,128.0,150.0)/255.0, 1.0);
            }

          }
        `}
  uniforms={{ u_time: { value: 0 }, u_spin: { value: 0 } }}
    />
  );
};

export default ShaderBanner;
