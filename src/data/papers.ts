export interface Paper {
  id: string;
  title: string;
  authors: string;
  /** Shown in full on the card (no clamp). Two to four lines reads best. */
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
      'Compares a CNN trained on HaGRID against a feed-forward network fed 21 hand landmarks from MediaPipe. The landmark version reached 100% validation accuracy, trained in under a second per epoch, and held up far better under rotation.',
    paperUrl: '/papers/gesture-recognition-tnm114.pdf',
    projectUrl: 'https://github.com/Sahriz/TNM114',
    featured: true,
  },
  {
    id: 'pathtracer-gpu',
    title: 'Simple Path Tracer with BVH Acceleration Structure',
    authors: 'Ludwig Boge, Jonatan Ebenholm',
    description:
      'A path tracer written entirely in a fragment shader, handling diffuse, specular, glossy and transmissive materials at near real-time rates. The BVH is built on the CPU and traversed in the shader through SSBOs.',
    paperUrl: '/papers/pathtracer-bvh-tsbk07.pdf',
    projectUrl: 'https://github.com/eLdOchLagor/TSBK07-Raytracer',
    featured: true,
  },
  {
    id: 'monte-carlo-raytracer',
    title: 'Monte Carlo Raytracer in C++',
    authors: 'Ludwig Boge, Jonatan Ebenholm',
    description:
      'A Monte Carlo raytracer built from scratch in C++ for TNCG15. Solves the rendering equation across Lambertian, mirror and transparent surfaces lit by area lights, and benchmarks how shadow ray and sample counts affect quality.',
    paperUrl: '/papers/monte-carlo-raytracer-tncg15.pdf',
    featured: true,
  },
  {
    id: 'animatch',
    title: 'AniMatch: A Content-Based Anime Recommendation System',
    authors: 'Berkay Orhan, Jonatan Ebenholm',
    description:
      'A content-based anime recommender using BERT embeddings and cosine similarity over title metadata. No accounts and no collaborative filtering, which sidesteps both cold-start and privacy problems.',
    paperUrl: '/papers/animatch.pdf',
    featured: true,
  },
  {
    id: 'face-recognition',
    title: 'Face Recognition: Methods and Applications',
    authors: 'Andrea Åstrand, Jesper Larsson, Jonatan Ebenholm, Tobias Svensson',
    description:
      'A full face recognition pipeline for TNM034: Gray World and White Patch white balancing, YCbCr skin segmentation, Hough-transform eye location, then matching against a database. Written in Swedish.',
    paperUrl: '/papers/face-recognition-tnm034.pdf',
  },
  {
    id: 'solar-system-simulator',
    title: 'Solar System Simulator',
    authors: 'Ludwig Boge, Nikita Sidarovich, Jonatan Ebenholm, Berkay Orhan',
    description:
      'A Blender add-on that simulates a solar system by Euler-integrating Newtonian gravity, then animates the planets with procedurally generated materials. Custom UI for building systems from scratch.',
    paperUrl: '/papers/solar-system-simulator.pdf',
    projectUrl: 'https://github.com/Sahriz/BlenderSolarsystemSim',
  },
  {
    id: 'elemental-clash',
    title: 'Elemental Clash: Bachelor Thesis',
    authors:
      'Emil Larsgärde, Ludwig Boge, Jonatan Ebenholm, Gayathri Naranath, Gustaf Kronholm, Armen Abedi, Mirijam Björn',
    description:
      'Bachelor thesis (18 HP, LiU): a Unity card game on a large touchscreen where ArUco markers and OpenCV read physical card placement. User studies with 12 participants measured the effect on tempo and stress. Written in Swedish.',
    paperUrl: '/papers/elemental-clash-bachelor-thesis.pdf',
    projectUrl: 'https://github.com/eLdOchLagor/Digital-cardgame-with-physical-aruco-cards',
  },
];
