export interface Project {
  id: string;
  title: string;
  /**
   * Shown on the card under a `line-clamp-3`. At the narrowest card width
   * (3-column grid, ~285px of text) three lines is about 95 characters, so
   * anything longer gets silently cut off. Keep new entries under that.
   */
  description: string;
  image: string;
  link: string;
  /** If true, the project appears on the landing page. Otherwise only on /projects. */
  featured?: boolean;
}

export const projects: Project[] = [
  // ===== Featured on landing page (in display order) =====
  {
    title: "WIP: Cloud Sim",
    description:
      "Real-time volumetric clouds in C++ and OpenGL, raymarched from a compute-built 3D texture.",
    image: "/images/CloudSim/cloudsim.webm",
    link: "https://github.com/Sahriz/FluidSim",
    id: "CloudSim",
    featured: true,
  },
  {
    title: "Minecraft Terrain Engine",
    description:
      "GPU-driven voxel terrain in C++20. Compute shaders build it, indirect draws render it.",
    image: "/images/MinecraftTerrain/Mountains.png",
    link: "https://github.com/Sahriz/MinecraftTerrain",
    id: "MinecraftTerrain",
    featured: true,
  },
  {
    title: "WIP: DroneSim",
    description:
      "Autonomous drone flying through procedural terrain, meshed on the fly with marching cubes.",
    image: "/images/DroneSim/marchingCubesImproved.webm",
    link: "https://github.com/Sahriz/DroneSim",
    id: "DroneSim",
    featured: true,
  },
  {
    title: "Gesture Controller",
    description:
      "Hand gestures drive a Godot game over WebSocket, via MediaPipe and a Keras CNN.",
    image: "/images/TNM114/confusion_matrix.png",
    link: "https://github.com/Sahriz/TNM114",
    id: "TNM114",
    featured: true,
  },
  {
    title: "Pathtracer on GPU",
    description: "Path tracer running entirely in a fragment shader, accelerated by a CPU-built BVH.",
    image: "/PathTracerFront.webm",
    link: "https://github.com/eLdOchLagor/TSBK07-Raytracer",
    id: "TSBK07",
    featured: true,
  },
  {
    title: "Solar system simulation",
    description: "Blender add-on that simulates a solar system and animates it with generated materials.",
    image: "/RedoVisning4.png",
    link: "https://github.com/Sahriz/BlenderSolarsystemSim?tab=readme-ov-file",
    id: "SolarSystem",
    featured: true,
  },

  // ===== Only on /projects page =====
  {
    title: "Elemental Clash",
    description: "Unity 1v1 RTS where physical ArUco cards place your units. Built for my bachelor thesis.",
    image: "/spel.png",
    link: "https://github.com/eLdOchLagor/Digital-cardgame-with-physical-aruco-cards",
    id: "ElementalClash",
  },
  {
    title: "WIP: Terrain Library",
    description:
      "C++ terrain library: heightmaps, marching cubes and voxel worlds, all on the GPU.",
    image: "/VoxelCubes2.webm",
    link: "https://github.com/Sahriz/TerrainLibrary",
    id: "TerrainLibrary",
  },
  {
    title: "WIP: Portals",
    description: "Unity portal experiment with smooth traversal. Visuals and mechanics still in progress.",
    image: "/PortalGif.gif",
    link: "https://github.com/Sahriz/PortalDevice",
    id: "Portals",
  },
  {
    title: "Planet generator",
    description: "Unity planet generator that layers gradient and Voronoi noise into procedural worlds.",
    image: "/PlanetProgress17.png",
    link: "",
    id: "PlanetGenerator",
  },
];
