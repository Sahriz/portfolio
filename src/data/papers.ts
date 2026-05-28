export interface Paper {
  id: string;
  title: string;
  authors: string;
  description: string;
  paperUrl?: string;
  projectUrl?: string;
  /** If true, the paper appears on the landing page. Otherwise only on /papers. */
  featured?: boolean;
}

export const papers: Paper[] = [
  {
    id: 'gesture-recognition',
    title: 'Gesture Recognition for Video Game Controllers',
    authors: 'Jonatan Ebenholm',
    description:
      'Compares two approaches to real-time gesture recognition for game input: a custom CNN trained on the HaGRID dataset plus self-collected images, versus a Feed Forward Neural Network operating on 21 3D hand landmarks extracted with MediaPipe. The MediaPipe + FFNN hybrid reached 100% validation accuracy with sub-second per-epoch training, outperforming the CNN on both accuracy and rotation robustness.',
    paperUrl: '/papers/gesture-recognition-tnm114.pdf',
    projectUrl: 'https://github.com/Sahriz/TNM114',
    featured: true,
  },
  {
    id: 'pathtracer-gpu',
    title: 'Simple Path Tracer with BVH Acceleration Structure',
    authors: 'Ludwig Boge, Jonatan Ebenholm',
    description:
      'A path tracer implemented entirely in a fragment shader (C++/OpenGL), targeting near real-time rendering of diffuse, specular, glossy, and transmissive materials. Accelerated with a CPU-built Bounding Volume Hierarchy traversed in the shader via Shader Storage Buffer Objects.',
    paperUrl: '/papers/pathtracer-bvh-tsbk07.pdf',
    projectUrl: 'https://github.com/eLdOchLagor/TSBK07-Raytracer',
    featured: true,
  },
  {
    id: 'monte-carlo-raytracer',
    title: 'Monte Carlo Raytracer in C++',
    authors: 'Ludwig Boge, Jonatan Ebenholm',
    description:
      'A Monte Carlo raytracer written from scratch in C++ for the TNCG15 Advanced Global Illumination course. Solves the rendering equation via Monte Carlo estimation across Lambertian reflectors, perfect mirrors, transparent surfaces, and area light sources; benchmarks the effect of shadow ray count and sample count on render quality.',
    paperUrl: '/papers/monte-carlo-raytracer-tncg15.pdf',
    featured: true,
  },
  {
    id: 'animatch',
    title: 'AniMatch: A Content-Based Anime Recommendation System',
    authors: 'Berkay Orhan, Jonatan Ebenholm',
    description:
      'A content-based recommendation system that suggests anime titles from intrinsic metadata using BERT embeddings and cosine similarity. Avoids the cold-start and privacy concerns of collaborative filtering — built around a quick "use and leave" web flow with no user accounts.',
    paperUrl: '/papers/animatch.pdf',
    featured: true,
  },
  {
    id: 'face-recognition',
    title: 'Face Recognition — Methods and Applications',
    authors: 'Andrea Åstrand, Jesper Larsson, Jonatan Ebenholm, Tobias Svensson',
    description:
      'A complete face recognition pipeline (TNM034 — Advanced Image Processing): white-balance correction via Gray World / White Patch, YCbCr-based skin segmentation, Hough-transform eye localization, face normalization, and identity matching against a database. Written in Swedish.',
    paperUrl: '/papers/face-recognition-tnm034.pdf',
  },
  {
    id: 'solar-system-simulator',
    title: 'Solar System Simulator',
    authors: 'Ludwig Boge, Nikita Sidarovich, Jonatan Ebenholm, Berkay Orhan',
    description:
      'A Blender add-on that simulates a customizable solar system via Euler integration of Newtonian gravity and auto-animates planets with procedurally generated materials. Custom Blender UI lets users construct their own solar systems from scratch.',
    paperUrl: '/papers/solar-system-simulator.pdf',
    projectUrl: 'https://github.com/Sahriz/BlenderSolarsystemSim',
  },
  {
    id: 'elemental-clash',
    title: 'Elemental Clash — Bachelor Thesis',
    authors:
      'Emil Larsgärde, Ludwig Boge, Jonatan Ebenholm, Gayathri Naranath, Gustaf Kronholm, Armen Abedi, Mirijam Björn',
    description:
      'Bachelor thesis (18 HP, LiU): a Unity card game played on a large touchscreen mixing physical and digital cards. ArUco markers + OpenCV read card placement from a top-down camera; user studies with 12 participants measured how physical cards affect tempo and perceived stress versus pure digital play. Written in Swedish.',
    paperUrl: '/papers/elemental-clash-bachelor-thesis.pdf',
    projectUrl: 'https://github.com/eLdOchLagor/Digital-cardgame-with-physical-aruco-cards',
  },
];
