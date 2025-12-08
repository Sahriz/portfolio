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
    description: "A C++ library that generates terrain using several noise algorithms. The terrain currently supports both heightmap terrain and marching cubes terrain, as well as minecraft style Voxelcube terrain. The library is still a work in progress, but it is able to generate terrain in real-time using OpenGL and ComputeShaders.",
    image: "/VoxelCubes2.webm",
    link: "https://github.com/Sahriz/TerrainLibrary",
    id: "TerrainLibrary",
  },
  {
    title: "Pathtracer on GPU",
    description: "A photo-realistic pathtracer written in C++ using OpenGL. The pathtracer runs fully on the GPU using the fragment shader.",
    image: "/PathTracerFront.webm",
    link: "https://github.com/eLdOchLagor/TSBK07-Raytracer",
    id: "TSBK07",
  },
  {
    title: "Elemental Clash",
    description: "A 3D 1vs1 real time strategy game made with Unity. The game utilizes computer vision to place the units in the game using ArUco markers. This project was done as part of my bachelor thesis.",
    image: "/spel.png",
    link: "https://github.com/eLdOchLagor/Digital-cardgame-with-physical-aruco-cards",
    id: "ElementalClash",
  },
  {
    title: "Planet generator",
    description: "A planet generation system made in Unity. The planet is generated using several noise algorithms such as with gradient noise and voronoi noise.",
    image: "/PlanetProgress17.png",
    link: "",
    id: "PlanetGenerator",
  },
  {
    title: "Solar system simulation",
    description: "A Blender Python addon that adds an UI and allow the user to simulate and automatically animate a solar system. It also adds materials to the planets. Blender has a tendacy to update their API, so the code might not work with the latest version of Blender.",
    image: "/RedoVisning4.png",
    link: "https://github.com/Sahriz/BlenderSolarsystemSim?tab=readme-ov-file",
    id: "SolarSystem",
  },
  {
    title: "WIP: Portals",
    description: "A little side-project where I am trying to implement portals in Unity. It is still a work in progress, but you are currently able to enter the portals smoothly and they look really good.",
    image: "/PortalGif.gif",
    link: "https://github.com/Sahriz/BlenderSolarsystemSim?tab=readme-ov-file",
    id: "Portals",
  },
];
