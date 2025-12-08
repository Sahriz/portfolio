export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export const projects: Project[] = [
  {
    title: "WIP: Terrain Library",
    description: "C++ terrain library with heightmaps, marching cubes, and voxel worlds rendered in real time via OpenGL/compute shaders.",
    image: "/VoxelCubes2.webm",
    link: "https://github.com/Sahriz/TerrainLibrary",
    id: "TerrainLibrary",
  },
  {
    title: "Pathtracer on GPU",
    description: "GPU path tracer in C++/OpenGL with fragment-shader rendering for photoreal frames.",
    image: "/PathTracerFront.webm",
    link: "https://github.com/eLdOchLagor/TSBK07-Raytracer",
    id: "TSBK07",
  },
  {
    title: "Elemental Clash",
    description: "Unity 3D 1v1 RTS using ArUco cards for unit placement; built for my bachelor thesis.",
    image: "/spel.png",
    link: "https://github.com/eLdOchLagor/Digital-cardgame-with-physical-aruco-cards",
    id: "ElementalClash",
  },
  {
    title: "Planet generator",
    description: "Unity planet generator combining gradient and Voronoi noise for procedural worlds.",
    image: "/PlanetProgress17.png",
    link: "",
    id: "PlanetGenerator",
  },
  {
    title: "Solar system simulation",
    description: "Blender add-on to simulate and auto-animate solar systems with generated materials.",
    image: "/RedoVisning4.png",
    link: "https://github.com/Sahriz/BlenderSolarsystemSim?tab=readme-ov-file",
    id: "SolarSystem",
  },
  {
    title: "WIP: Portals",
    description: "Unity portal experiment with smooth traversal; visuals and mechanics still in progress.",
    image: "/PortalGif.gif",
    link: "https://github.com/Sahriz/BlenderSolarsystemSim?tab=readme-ov-file",
    id: "Portals",
  },
];
