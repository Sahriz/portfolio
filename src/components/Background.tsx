const Background: React.FC = () => {
  return (
    <shaderMaterial
      attach="material"
      vertexShader={`
        varying float vNdcY;
        void main() {
          vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          // Normalized device y: -1 at the bottom of the screen, +1 at the top.
          // The plane faces the camera head-on (constant w across it), so
          // interpolating this varying matches per-fragment screen position.
          vNdcY = clipPos.y / clipPos.w;
          gl_Position = clipPos;
        }
      `}
      fragmentShader={`
        varying float vNdcY;
        void main() {
          // Vertical luminance ramp: overdriven white at the bottom of the
          // viewport fading to near-black at the top. Screen-relative (NDC),
          // so it renders identically at every viewport size and DPR —
          // gl_FragCoord.y, used previously, is in physical pixels and made
          // the gradient depend on window height and devicePixelRatio.
          float t = vNdcY * 0.5 + 0.5;
          float lum = clamp(mix(1.7, 0.08, t), 0.0, 1.0);
          gl_FragColor = vec4(vec3(lum), 1.0);
        }
      `}
    />
  );
};

export default Background;
