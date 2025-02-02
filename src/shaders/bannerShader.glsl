uniform float u_time;
void main() {
  gl_FragColor = vec4(0.5 + 0.5 * cos(u_time), 0.0, 1.0, 1.0);
}