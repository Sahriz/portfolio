export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  /** If true, the project appears on the landing page. Otherwise only on /projects. */
  featured?: boolean;
}

export const projects: Project[] = [
  // ===== Featured on landing page (in display order) =====
  {
    title: "Minecraft Terrain Engine",
    description:
      "High-performance GPU-driven voxel terrain engine in C++20 with OpenGL 4.3+ compute shaders, indirect drawing, spline-based terrain shaping, and a multi-threaded chunking architecture.",
    image: "/images/MinecraftTerrain/Mountains.png",
    link: "https://github.com/Sahriz/MinecraftTerrain",
    id: "MinecraftTerrain",
    featured: true,
  },
  {
    title: "WIP: DroneSim",
    description:
      "Autonomous drone navigating procedurally generated terrain in C++/OpenGL — control loop steers the drone through the simulated environment in real time.",
    image: "/images/DroneSim/marchingCubesImproved.webm",
    link: "https://github.com/Sahriz/DroneSim",
    id: "DroneSim",
    featured: true,
  },
  {
    title: "Gesture Controller",
    description:
      "Real-time gesture recognition driving a Godot game over WebSocket — MediaPipe hand tracking, a TensorFlow/Keras CNN classifier, and an OpenCV webcam pipeline.",
    image: "/images/TNM114/confusion_matrix.png",
    link: "https://github.com/Sahriz/TNM114",
    id: "TNM114",
    featured: true,
  },
  {
    title: "Pathtracer on GPU",
    description: "GPU path tracer in C++/OpenGL with fragment-shader rendering for photoreal frames.",
    image: "/PathTracerFront.webm",
    link: "https://github.com/eLdOchLagor/TSBK07-Raytracer",
    id: "TSBK07",
    featured: true,
  },
  {
    title: "Elemental Clash",
    description: "Unity 3D 1v1 RTS using ArUco cards for unit placement; built for my bachelor thesis.",
    image: "/spel.png",
    link: "https://github.com/eLdOchLagor/Digital-cardgame-with-physical-aruco-cards",
    id: "ElementalClash",
    featured: true,
  },
  {
    title: "Solar system simulation",
    description: "Blender add-on to simulate and auto-animate solar systems with generated materials.",
    image: "/RedoVisning4.png",
    link: "https://github.com/Sahriz/BlenderSolarsystemSim?tab=readme-ov-file",
    id: "SolarSystem",
    featured: true,
  },

  // ===== Only on /projects page =====
  {
    title: "WIP: Terrain Library",
    description:
      "C++ terrain library with heightmaps, marching cubes, and voxel worlds rendered in real time via OpenGL/compute shaders.",
    image: "/VoxelCubes2.webm",
    link: "https://github.com/Sahriz/TerrainLibrary",
    id: "TerrainLibrary",
  },
  {
    title: "WIP: Portals",
    description: "Unity portal experiment with smooth traversal; visuals and mechanics still in progress.",
    image: "/PortalGif.gif",
    link: "https://github.com/Sahriz/PortalDevice",
    id: "Portals",
  },
  {
    title: "Planet generator",
    description: "Unity planet generator combining gradient and Voronoi noise for procedural worlds.",
    image: "/PlanetProgress17.png",
    link: "",
    id: "PlanetGenerator",
  },
];
