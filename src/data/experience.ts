export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  /** Path under /public, e.g. "/logos/liu.svg". Optional — falls back to first letter of organization. */
  logo?: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Ordered newest-first.
export const experience: ExperienceItem[] = [
  {
    id: 'msc-thesis',
    title: "Master's Thesis — Inverse Rendering for Industry Inspections",
    organization: 'Sick / Linköping University',
    logo: '/logos/Sick.png',
    startDate: 'Jan 2026',
    endDate: 'Jun 2026',
    description:
      "Master's thesis applying inverse rendering — recovering scene geometry, materials, and lighting from images — to industrial inspection workflows.",
  },
  {
    id: 'lithehack',
    title: 'Programming Assistant — LiTHeHack',
    organization: 'Linköping University',
    logo: '/logos/liu.png',
    startDate: 'Sep 2025',
    endDate: 'Jun 2026',
    description:
      'Paid programming assistance role under LiU\'s LiTHeHack initiative, supporting students with programming work.',
  },
  {
    id: 'transform-theory-ta',
    title: 'Laboratory Assistant — Applied Transform Theory',
    organization: 'Linköping University',
    logo: '/logos/liu.png',
    startDate: '2024',
    endDate: '2024',
    description:
      'Lab assistant for the Applied Transform Theory course — guided students through lab sessions on Fourier analysis, Laplace transforms, and signal/system analysis.',
  },
  {
    id: 'msc',
    title: "Master's Degree in Media Technology and Engineering",
    organization: 'Linköping University',
    logo: '/logos/liu.png',
    startDate: '2023',
    endDate: 'Present',
    description:
      'Specializing in Computer Graphics, GPU programming, video game systems programming, and machine learning / AI.',
  },
  {
    id: 'bsc',
    title: "Bachelor's Degree in Media Technology",
    organization: 'Linköping University',
    logo: '/logos/liu.png',
    startDate: '2020',
    endDate: '2023',
    description:
      'Foundations in programming, applied mathematics, and media technology.',
  },
];
