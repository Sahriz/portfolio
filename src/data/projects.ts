export interface Project {
  id: string;
  title: string;
  /**
   * Shown on the card under a `line-clamp-3`. At the narrowest card width
   * (3-column grid, ~285px of text) three lines is about 95 characters, so
   * anything longer gets silently cut off. Keep new entries under that.
   */
  description: string;
  /** Card media: an image, or a short muted .webm loop. */
  image: string;
  /** Still shown before a video plays (and reusable as an og:image later). */
  poster?: string;
  /** Source repo. Empty when there is none to show. */
  link: string;
  /** Only real, runnable demos. Never a GitHub link. */
  demo?: string;
  /** Stack chips on the card, e.g. ['C++20', 'OpenGL 4.3']. */
  tags: string[];
  /**
   * Drives the badge next to the title: 'in-progress' for work that is
   * active now, 'on-hold' for unfinished work that is parked. Leave it out
   * for finished projects.
   */
  status?: 'in-progress' | 'on-hold';
  year?: string;
  role?: string;
  team?: string;
  /** If true, the project appears on the landing page. Otherwise only on /projects. */
  featured?: boolean;
}

export const projects: Project[] = [
  // ===== Featured on landing page (in display order) =====
  {
    title: "Cloud Sim",
    description:
      "Real-time volumetric clouds in C++ and OpenGL, raymarched from a compute-built 3D texture.",
    image: "/images/CloudSim/cloudsim.webm",
    poster: "/images/cards/CloudSim.webp",
    tags: ['C++', 'OpenGL 4.6', 'compute', 'raymarching'],
    status: 'in-progress',
    link: "https://github.com/Sahriz/FluidSim",
    id: "CloudSim",
    featured: true,
  },
  {
    title: "Minecraft Terrain Engine",
    description:
      "GPU-driven voxel terrain in C++20. Compute shaders build it, indirect draws render it.",
    image: "/images/cards/MinecraftTerrain.webp",
    tags: ['C++20', 'OpenGL 4.3', 'compute', 'indirect draw'],
    link: "https://github.com/Sahriz/MinecraftTerrain",
    id: "MinecraftTerrain",
    featured: true,
  },
  {
    title: "DroneSim",
    description:
      "Autonomous drone flying through procedural terrain, meshed on the fly with marching cubes.",
    image: "/images/cards/DroneSim.webm",
    poster: "/images/cards/DroneSim.webp",
    tags: ['C++', 'OpenGL', 'marching cubes'],
    status: 'on-hold',
    link: "https://github.com/Sahriz/DroneSim",
    id: "DroneSim",
    featured: true,
  },
  {
    title: "Gesture Controller",
    description:
      "Hand gestures drive a Godot game over WebSocket, via MediaPipe and a Keras CNN.",
    image: "/images/TNM114/confusion_matrix.png",
    tags: ['Python', 'TensorFlow', 'MediaPipe', 'Godot'],
    link: "https://github.com/Sahriz/TNM114",
    id: "TNM114",
    featured: true,
  },
  {
    title: "Pathtracer on GPU",
    description: "Path tracer running entirely in a fragment shader, accelerated by a CPU-built BVH.",
    image: "/images/cards/TSBK07.webm",
    poster: "/images/cards/TSBK07.webp",
    tags: ['C++', 'GLSL', 'BVH', 'SSBO'],
    link: "https://github.com/eLdOchLagor/TSBK07-Raytracer",
    id: "TSBK07",
    featured: true,
  },
  {
    title: "Solar system simulation",
    description: "Blender add-on that simulates a solar system and animates it with generated materials.",
    image: "/images/SolarSystem/RedoVisning4.png",
    tags: ['Python', 'Blender API'],
    link: "https://github.com/Sahriz/BlenderSolarsystemSim?tab=readme-ov-file",
    id: "SolarSystem",
    featured: true,
  },

  // ===== Only on /projects page =====
  {
    title: "Elemental Clash",
    description: "Unity 1v1 RTS where physical ArUco cards place your units. Built for my bachelor thesis.",
    image: "/images/ElementalClash/spel.png",
    tags: ['Unity', 'C#', 'OpenCV', 'ArUco'],
    link: "https://github.com/eLdOchLagor/Digital-cardgame-with-physical-aruco-cards",
    id: "ElementalClash",
  },
  {
    title: "Terrain Library",
    description:
      "C++ terrain library: heightmaps, marching cubes and voxel worlds, all on the GPU.",
    image: "/images/cards/TerrainLibrary.webm",
    poster: "/images/cards/TerrainLibrary.webp",
    tags: ['C++', 'OpenGL', 'compute', 'marching cubes'],
    status: 'on-hold',
    link: "https://github.com/Sahriz/TerrainLibrary",
    id: "TerrainLibrary",
  },
  {
    title: "Portals",
    description: "Unity portal experiment with smooth traversal. Visuals and mechanics still in progress.",
    image: "/images/cards/Portals.webm",
    poster: "/images/cards/Portals.webp",
    tags: ['Unity', 'C#'],
    status: 'on-hold',
    link: "https://github.com/Sahriz/PortalDevice",
    id: "Portals",
  },
  {
    title: "Planet generator",
    description: "Unity planet generator that layers gradient and Voronoi noise into procedural worlds.",
    image: "/images/PlanetGenerator/PlanetProgress17.png",
    tags: ['Unity', 'C#', 'procedural noise'],
    link: "",
    id: "PlanetGenerator",
  },
];
