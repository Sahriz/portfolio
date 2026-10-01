export interface Skill {
  name: string;
  /** File name under public/icons/skills/, without ".svg". Leave out when there is no logo. */
  icon?: string;
  /** Set for black or grey logos, so they are inverted on the dark theme. */
  mono?: boolean;
}

// Skills shown as grouped lists in the About section. The logos are devicon
// SVGs (MIT), copied into public/icons/skills/ so nothing loads from a CDN.
export const skillGroups: { title: string; items: Skill[] }[] = [
  {
    title: 'Languages',
    items: [
      { name: 'C++', icon: 'cplusplus' },
      { name: 'C#', icon: 'csharp' },
      { name: '.NET', icon: 'dotnetcore' },
      { name: 'Python', icon: 'python' },
      { name: 'TypeScript', icon: 'typescript' },
    ],
  },
  {
    title: 'Graphics & GPU',
    items: [
      { name: 'OpenGL · GLSL', icon: 'opengl' },
      { name: 'Compute shaders' },
      { name: 'Vulkan (learning)', icon: 'vulkan' },
      { name: 'Three.js / WebGL', icon: 'threejs', mono: true },
    ],
  },
  {
    title: 'Engines & tools',
    items: [
      { name: 'Unity', icon: 'unity', mono: true },
      { name: 'Godot', icon: 'godot' },
      { name: 'Blender', icon: 'blender' },
      { name: 'CMake', icon: 'cmake' },
      { name: 'Git', icon: 'git' },
    ],
  },
  {
    title: 'ML & vision',
    items: [
      { name: 'TensorFlow', icon: 'tensorflow' },
      { name: 'OpenCV', icon: 'opencv' },
      { name: 'MediaPipe' },
      { name: 'MATLAB', icon: 'matlab' },
    ],
  },
];
