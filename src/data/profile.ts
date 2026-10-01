// Who the site is about: the hero copy, the About text and the contact links.
// Everything marked PLACEHOLDER is waiting on Jonatan (handoff-frontend.md §7).
export const profile = {
  name: 'Jonatan Ebenholm',
  email: 'ebenholmdev@gmail.com',
  cv: '/CV_JonatanEbenholm.pdf',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jonatan-ebenholm-904222343/' },
    { label: 'GitHub', href: 'https://github.com/Sahriz' },
  ],

  hero: {
    eyebrow: '/ open to roles from late 2026 · Norrköping, SE',
    // PLACEHOLDER (§7.1): final role line and sentence.
    role: 'Graphics & GPU programmer',
    sentence:
      'Real-time renderers and GPU-driven engines in C++ and OpenGL. Finishing an MSc in Media Technology at Linköping University.',
  },

  // PLACEHOLDER (§7.2): path under /public to a 4:5 headshot, e.g. '/images/jonatan.webp'.
  photo: null as string | null,

  // PLACEHOLDER: a ~150-word cut of the longer About text that used to be on
  // the home page. The sentences are Jonatan's; the selection is not.
  bio: [
    "I'm finishing an MSc in Media Technology and Engineering at Linköping University, with the focus pulled hard toward computer graphics, GPU programming, and applied machine learning. My thesis, hosted at SICK IVP, is done. One 6 HP course stands between me and the degree, so November 2026.",
    'I came at graphics through art: years of figure and gesture studies, until code turned out to be a way to build worlds the way drawing built faces and figures. Most of what I build lives on the line between graphics and systems: GPU-driven voxel engines, fragment-shader path tracers and, lately, a volumetric cloud renderer.',
    "The next things are further down the stack: a physics engine in C++, Vulkan after a few years of OpenGL, and .NET. I'm looking for strong engineering work in systems, graphics, vision, or simulation.",
  ],

  now: [
    { label: 'working on', value: 'cloud renderer · Vulkan · C++ physics engine' },
    { label: 'looking for', value: 'graphics, GPU, vision or simulation roles, late 2026' },
    { label: 'based in', value: 'Norrköping · hybrid OK' },
  ],
};
