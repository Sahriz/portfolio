export type CourseCategory =
  | 'Computer Graphics'
  | 'Machine Learning & AI'
  | 'Automatic Control'
  | 'Other';

/** LiU course level: 'A' = Avancerad nivå (Master's), 'G' = Grundnivå (Bachelor's). */
export type CourseLevel = 'A' | 'G';

export interface Course {
  name: string;
  credits: number;
  /** '5' / '4' / '3' for graded courses, 'G' for pass/fail. */
  grade: string;
  category: CourseCategory;
  level: CourseLevel;
  /** Completion date as YYYY-MM. Used for differentiating same-name courses and chronology. */
  date: string;
  /** If true, the course appears in the curated landing-page section. */
  featured?: boolean;
}

/** Display order for category groups and filter chips. */
export const CATEGORY_ORDER: CourseCategory[] = [
  'Computer Graphics',
  'Machine Learning & AI',
  'Automatic Control',
  'Other',
];

// Sourced from LiU official transcript (print date 2026-02-18). 264 HP total across 42 courses.
// Levels (A vs G) are inferred from course names + standard LiU classifications — verify against Ladok.
export const courses: Course[] = [
  { name: 'Foundation Course in Mathematics',                        credits:  6, grade: '3', category: 'Other',                 level: 'G', date: '2021-10' },
  { name: 'Programming',                                             credits:  6, grade: '4', category: 'Other',                 level: 'G', date: '2021-10' },
  { name: 'Digital Media',                                           credits:  6, grade: 'G', category: 'Other',                 level: 'G', date: '2022-01' },
  { name: 'Electronic Publishing',                                   credits:  6, grade: '5', category: 'Other',                 level: 'G', date: '2022-01', featured: true },
  { name: 'Object-Oriented Programming',                             credits:  6, grade: '3', category: 'Other',                 level: 'G', date: '2022-03' },
  { name: 'Applied Mathematics in Science and Technology',           credits:  6, grade: 'G', category: 'Other',                 level: 'G', date: '2022-05' },
  { name: 'Computer Graphics',                                       credits:  6, grade: '3', category: 'Computer Graphics',     level: 'G', date: '2022-06' },
  { name: 'Calculus I',                                              credits:  6, grade: '3', category: 'Other',                 level: 'G', date: '2022-06' },
  { name: 'Linear Algebra',                                          credits:  6, grade: '4', category: 'Other',                 level: 'G', date: '2022-08' },
  { name: 'Mechanics and Wave Physics',                              credits:  6, grade: '3', category: 'Other',                 level: 'G', date: '2022-11' },
  { name: 'Communication and User Interfaces',                       credits:  6, grade: '5', category: 'Other',                 level: 'G', date: '2022-12', featured: true },
  { name: 'Calculus III',                                            credits:  6, grade: '3', category: 'Other',                 level: 'G', date: '2023-01' },
  { name: 'Programming in C++',                                      credits:  6, grade: '3', category: 'Other',                 level: 'G', date: '2023-03' },
  { name: 'Graphic Arts',                                            credits:  6, grade: '5', category: 'Computer Graphics',     level: 'G', date: '2023-03' },
  { name: 'Applied Transform Theory',                                credits:  6, grade: '5', category: 'Automatic Control',     level: 'G', date: '2023-03', featured: true },
  { name: 'Calculus II',                                             credits:  6, grade: '5', category: 'Other',                 level: 'G', date: '2023-06', featured: true },
  { name: 'Statistics',                                              credits:  6, grade: '5', category: 'Other',                 level: 'G', date: '2023-06', featured: true },
  { name: '3D Computer Graphics',                                    credits:  6, grade: '4', category: 'Computer Graphics',     level: 'G', date: '2023-06', featured: true },
  { name: 'Signals and Systems',                                     credits:  6, grade: '5', category: 'Automatic Control',     level: 'G', date: '2023-06', featured: true },
  { name: 'Vector Analysis',                                         credits:  6, grade: '3', category: 'Other',                 level: 'G', date: '2023-08' },
  { name: 'Automatic Control',                                       credits:  6, grade: '5', category: 'Automatic Control',     level: 'G', date: '2023-10', featured: true },
  { name: 'Physics of Sound',                                        credits:  6, grade: '3', category: 'Automatic Control',     level: 'G', date: '2023-11' },
  { name: 'Image Processing and Analysis',                           credits:  6, grade: '4', category: 'Computer Graphics',     level: 'A', date: '2024-01' },
  { name: 'Practical Data Visualization and Virtual Reality',        credits:  6, grade: 'G', category: 'Computer Graphics',     level: 'G', date: '2024-01' },
  { name: 'Modelling Project',                                       credits:  6, grade: '5', category: 'Computer Graphics',     level: 'A', date: '2024-04', featured: true },
  { name: 'Data Structures',                                         credits:  6, grade: '3', category: 'Other',                 level: 'G', date: '2024-05' },
  { name: 'Media Technology — Bachelor Project',                     credits: 18, grade: 'G', category: 'Other',                 level: 'G', date: '2024-06' },
  { name: 'Design and Programming of Computer Games',                credits:  6, grade: '4', category: 'Other',                 level: 'A', date: '2024-11' },
  { name: 'Advanced Image Processing',                               credits:  6, grade: '4', category: 'Computer Graphics',     level: 'A', date: '2024-12' },
  { name: 'Procedural Methods for Images',                           credits:  6, grade: '3', category: 'Computer Graphics',     level: 'A', date: '2025-01' },
  { name: 'Advanced Global Illumination and Rendering',              credits:  6, grade: '5', category: 'Computer Graphics',     level: 'A', date: '2025-01', featured: true },
  { name: 'Machine Learning for Social Media',                       credits:  6, grade: '5', category: 'Machine Learning & AI', level: 'A', date: '2025-02', featured: true },
  { name: 'Physical Interaction and Game Programming',               credits:  6, grade: '4', category: 'Other',                 level: 'A', date: '2025-04' },
  { name: 'Computer Graphics (Advanced)',                            credits:  6, grade: '4', category: 'Computer Graphics',     level: 'A', date: '2025-05', featured: true },
  { name: 'Artificial Intelligence — Principles and Techniques',     credits:  6, grade: '5', category: 'Machine Learning & AI', level: 'A', date: '2025-05', featured: true },
  { name: 'Modelling and Simulation',                                credits:  6, grade: '4', category: 'Automatic Control',     level: 'A', date: '2025-08', featured: true },
  { name: 'Neural Networks and Learning Systems',                    credits:  6, grade: '3', category: 'Machine Learning & AI', level: 'A', date: '2025-08' },
  { name: 'Scientific Method',                                       credits:  6, grade: 'G', category: 'Other',                 level: 'A', date: '2026-01' },
  { name: 'Modelling and Animation',                                 credits:  6, grade: '3', category: 'Computer Graphics',     level: 'A', date: '2026-01' },
  { name: 'Artificial Intelligence for Interactive Media, Project',  credits:  6, grade: 'G', category: 'Machine Learning & AI', level: 'A', date: '2026-01', featured: true },
  { name: 'Software Entrepreneurship',                               credits:  6, grade: '4', category: 'Other',                 level: 'A', date: '2026-01' },
  { name: 'Advanced Project Course — Game, App and Web Development', credits:  6, grade: 'G', category: 'Other',                 level: 'A', date: '2026-01' },
];
