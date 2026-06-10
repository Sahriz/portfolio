/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ProjectCard from '../components/ProjectCard';
import PaperCard from '../components/PaperCard';
import ExperienceTimeline from '../components/ExperienceTimeline';
import ScrollReveal from '../components/ScrollReveal';
import { ThemeToggle } from '../components/ThemeToggle';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { projects } from '../data/projects';
import { papers } from '../data/papers';
import { experience } from '../data/experience';
import { courses, CATEGORY_ORDER } from '../data/courses';

// Dust trail behind the shooting star: 10 small bright particles staggered behind it.
// Each has a slight vertical offset and varying size for a "cloud" feel rather than a line.

const HeroScene = dynamic(() => import('../components/HeroScene'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: 'var(--background)' }} />,
});

export default function Portfolio() {
  const [sceneReady, setSceneReady] = useState(false);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  const [navHidden, setNavHidden] = useState(false);

  // On refresh, reset to the hero — and stop the browser from restoring scroll on this tab.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;
        if (currentY < 80) {
          setNavHidden(false);
        } else if (delta > 4) {
          setNavHidden(true);
        } else if (delta < -4) {
          setNavHidden(false);
        }
        lastY = currentY;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const skillIcons = [
    // Languages
    { name: 'C++',          src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
    { name: 'C#',           src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-plain.svg' },
    { name: 'Python',       src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
    { name: 'TypeScript',   src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
    // Graphics / rendering
    { name: 'OpenGL',       src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opengl/opengl-original.svg' },
    { name: 'Three.js',     src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg' },
    // Game engines
    { name: 'Unity',        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg' },
    { name: 'Godot',        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/godot/godot-original.svg' },
    // 3D / DCC
    { name: 'Blender',      src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/blender/blender-original.svg' },
    // ML / CV
    { name: 'TensorFlow',   src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg' },
    { name: 'OpenCV',       src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg' },
    // Math / engineering
    { name: 'MATLAB',       src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg' },
    // Web
    { name: 'React',        src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
    { name: 'Next.js',      src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
    { name: 'Tailwind CSS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    // Tooling
    { name: 'Git',          src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
  ];
  const aboutBackground = 'color-mix(in srgb, var(--primary) 18%, var(--background) 82%)';

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <div className={`page-blackout ${sceneReady ? 'page-blackout-open' : ''}`} aria-hidden>
        <div className="page-blackout-bar page-blackout-bar-top" />
        <div className="page-blackout-bar page-blackout-bar-bottom" />
      </div>
      {sceneReady && (
        <div
          className="star-effects"
          aria-hidden
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10001,
            pointerEvents: 'none',
            isolation: 'isolate',
          }}
        >
          <div className="shooting-star-trail" />
          <div className="shooting-star" />
        </div>
      )}
      <nav
        aria-label="Primary"
        className={`fixed top-4 left-1/2 z-50 border border-foreground/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 px-3 py-2.5 font-mono text-sm transition-transform duration-300 ease-out ${navHidden ? '-translate-x-1/2 -translate-y-[200%]' : '-translate-x-1/2 translate-y-0'}`}
        style={{ opacity: 0, animation: 'fadeIn 1.5s ease-out 1.9s forwards' }}
      >
        <ul className="flex items-center gap-1 text-foreground/70">
          <li>
            <a href="#scroll-target-projects" className="nav-link inline-block px-3 py-1.5 hover:bg-foreground hover:text-background">
              projects
            </a>
          </li>
          <li>
            <a href="#scroll-target-aboutme" className="nav-link inline-block px-3 py-1.5 hover:bg-foreground hover:text-background">
              about
            </a>
          </li>
          <li>
            <a href="#scroll-target-contactme" className="nav-link inline-block px-3 py-1.5 hover:bg-foreground hover:text-background">
              contact
            </a>
          </li>
        </ul>
      </nav>
      <div
        className="relative w-full overflow-hidden"
        style={{ zIndex: 9, height: '75vh', pointerEvents: 'auto' }}
      >
        <div className="absolute right-4 top-4 z-20">
          <ThemeToggle />
        </div>
        <HeroScene onReady={handleSceneReady} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          style={{ opacity: 0, animation: 'fadeIn 1.5s ease-out 1.9s forwards' }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground [text-shadow:_0_2px_18px_rgba(0,0,0,0.6)]">
            Jonatan Ebenholm&apos;s Portfolio
          </h1>
          <p className="mt-4 max-w-3xl text-lg sm:text-xl md:text-2xl font-semibold text-foreground/90 [text-shadow:_0_1px_10px_rgba(0,0,0,0.55)]">
            5th year student as Master of Science in Media Technology and Engineering
          </p>
        </div>
        <div
          className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-foreground/80"
          style={{ opacity: 0, animation: 'fadeIn 1.2s ease-out 2.6s forwards' }}
        >
          <span className="mb-2 text-[0.65rem] uppercase tracking-[0.35em] [text-shadow:_0_1px_4px_rgba(0,0,0,0.55)]">
            Scroll
          </span>
          <ChevronDown className="h-5 w-5 scroll-hint [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.55))]" />
        </div>
      </div>

      <>
        <section
          id="scroll-target-now"
          className="relative z-10 mx-auto mt-[18vh] w-full max-w-6xl px-4 sm:px-6 lg:px-8"
        >
          <header className="mb-6">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-foreground/50">
              / status
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Now
            </h2>
          </header>
          <dl className="grid gap-x-12 gap-y-4 font-mono text-sm sm:grid-cols-[10rem_1fr]">
            <dt className="text-foreground/50">Working on</dt>
            <dd className="text-foreground/90">
              MSc thesis on inverse rendering for industrial inspection — at SICK IVP, Linköping.
            </dd>
            <dt className="text-foreground/50">Graduating</dt>
            <dd className="text-foreground/90">June 2026.</dd>
            <dt className="text-foreground/50">Looking for</dt>
            <dd className="text-foreground/90">
              Software or systems engineering roles starting summer / fall 2026 — C++, C#, Python.
              Especially keen on graphics, GPU, computer vision, or simulation work.
            </dd>
            <dt className="text-foreground/50">Based in</dt>
            <dd className="text-foreground/90">
              Norrköping, Sweden — open to roles across Östergötland, not relocating.
            </dd>
          </dl>
        </section>

        <section id="scroll-target-projects" className="relative z-10 mt-32">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter((p) => p.featured)
                .map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
            </div>
            <div className="mt-14 flex justify-center">
              <Link
                href="/projects"
                className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
              >
                view all projects
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <section
            id="scroll-target-papers"
            className="relative z-10 mx-auto mt-32 w-full max-w-6xl px-4 sm:px-6 lg:px-8"
          >
            <header className="mb-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                Papers
              </h2>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                Research papers and writeups.
              </p>
            </header>
            <div className="grid gap-6 sm:grid-cols-2">
              {papers
                .filter((p) => p.featured)
                .map((paper, index) => (
                  <ScrollReveal key={paper.id} delay={(index % 2) * 100} className="h-full">
                    <PaperCard paper={paper} />
                  </ScrollReveal>
                ))}
            </div>
            <div className="mt-14 flex justify-center">
              <Link
                href="/papers"
                className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
              >
                view all papers
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <section
            id="scroll-target-experience"
            className="relative z-10 mx-auto mt-32 w-full max-w-6xl px-4 sm:px-6 lg:px-8"
          >
            <header className="mb-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                Education &amp; Experience
              </h2>
            </header>
            <ExperienceTimeline items={experience} />
          </section>

          <section
            id="scroll-target-coursework"
            className="relative z-10 mx-auto mt-32 w-full max-w-6xl px-4 sm:px-6 lg:px-8"
          >
            <header className="mb-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                Coursework
              </h2>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                Selected highlights from my MSc program.
              </p>
            </header>
            <div className="grid gap-10 md:grid-cols-2">
              {CATEGORY_ORDER.map((category, catIndex) => {
                const list = courses.filter((c) => c.featured && c.category === category);
                if (list.length === 0) return null;
                return (
                  <ScrollReveal key={category} delay={(catIndex % 2) * 100}>
                    <h3 className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-foreground/50">
                      {category}
                    </h3>
                    <ul className="space-y-1.5">
                      {list.map((course) => (
                        <li
                          key={`${course.name}-${course.date}`}
                          className="grid grid-cols-[1.25rem_1fr_3.5rem_2rem] items-baseline gap-3 font-mono text-sm"
                        >
                          <span
                            className="text-xs text-foreground/40"
                            title={course.level === 'A' ? 'Avancerad nivå (Master’s)' : 'Grundnivå (Bachelor’s)'}
                          >
                            {course.level}
                          </span>
                          <span className="text-foreground/90">{course.name}</span>
                          <span className="text-right text-foreground/60 tabular-nums">
                            {course.credits} HP
                          </span>
                          <span className="text-right font-bold text-foreground tabular-nums">
                            {course.grade}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>
                );
              })}
            </div>
            <div className="mt-14 flex justify-center">
              <Link
                href="/courses"
                className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
              >
                view all coursework
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <div
            aria-hidden
            className="relative z-10 mt-32 h-14 w-full"
            style={{
              backgroundImage:
                `linear-gradient(180deg, var(--background) 0%, ${aboutBackground} 100%)`,
            }}
          />

          <section
            id="scroll-target-aboutme"
            className="relative w-full px-4 py-20"
            style={{ backgroundColor: aboutBackground }}
          >
            <div className="mx-auto max-w-3xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                About
              </h2>
              <div className="mt-8 flex flex-col gap-5 text-base sm:text-lg leading-relaxed text-foreground/80">
                <p>
                  I&apos;m finishing an MSc in Media Technology and Engineering at Linköping University, with the
                  focus pulled hard toward computer graphics, GPU programming, and applied machine learning. My
                  master&apos;s thesis is hosted at SICK IVP in Linköping, where I&apos;m working on inverse rendering for
                  industrial inspection — recovering scene geometry and materials from imagery to support automated
                  quality assessment.
                </p>
                <p>
                  I came at graphics through art — years of figure and gesture studies, then a media technology
                  degree for the practicality plus the graphics angle I&apos;d been curious about as a gamer. Code
                  turned out to be a way to build worlds the way drawing built faces and figures.{' '}
                  <strong className="font-semibold text-foreground">
                    TNCG15 — Advanced Global Illumination
                  </strong>{' '}
                  is what made me a graphics programmer proper, and{' '}
                  <strong className="font-semibold text-foreground">TSBK07 — Computer Graphics</strong> the semester
                  after dropped me into parallel programming. I haven&apos;t really left.
                </p>
                <p>
                  Most of what I build lives on the line between graphics and systems: GPU-driven voxel engines,
                  fragment-shader path tracers, procedurally generated worlds. I like the work that asks you to think
                  at two levels at once — the high-level structure of what&apos;s being rendered, and the low-level
                  mechanics of how the GPU is actually executing it. The projects above are mostly me chasing that.
                </p>
                <p>
                  After graduation I&apos;m looking for strong engineering work — systems, graphics, vision, or
                  simulation. Graphics and GPU work is where I&apos;m strongest, and industry-adjacent work in the same
                  space as my thesis — vision, simulation, perception — is just as compelling. A full-time research
                  role would tempt me too, if the project is the right kind of strange.
                </p>
              </div>
            </div>
          </section>

          <div
            aria-hidden
            className="relative z-10 h-14 w-full"
            style={{
              backgroundImage:
                `linear-gradient(180deg, ${aboutBackground} 0%, var(--background) 100%)`,
            }}
          />

          <section className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
            <header className="mb-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                Skills
              </h2>
            </header>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <TooltipProvider>
                  {skillIcons.map((skill, index) => (
                    <ScrollReveal key={skill.name} delay={index * 60}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <img className="h-16 w-16 sm:h-20 sm:w-20" src={skill.src} alt={skill.name} />
                        </TooltipTrigger>
                        <TooltipContent side="top">{skill.name}</TooltipContent>
                      </Tooltip>
                    </ScrollReveal>
                  ))}
                </TooltipProvider>
              </div>
          </section>
      </>

      <footer className="mt-14 border-t border-border bg-card text-card-foreground" id="scroll-target-contactme">
        <div className="mx-auto flex flex-wrap items-center justify-center gap-4 px-4 py-5 text-sm sm:text-base">
          <span className="flex items-center gap-1">
            <strong>LinkedIn:</strong>
            <a className="underline" href="https://www.linkedin.com/in/jonatan-ebenholm-904222343/" target="_blank" rel="noopener noreferrer">Jonatan Ebenholm</a>
          </span>
          <span className="flex items-center gap-1">
            <strong>Phone:</strong>
            <span>+46 70 7789107</span>
          </span>
          <span className="flex items-center gap-1">
            <strong>Email:</strong>
            <a className="underline" href="mailto:ebenholmdev@gmail.com">ebenholmdev@gmail.com</a>
          </span>
          <span className="flex items-center gap-1">
            <strong>CV:</strong>
            <a className="underline" href="/CV_JonatanEbenholm.pdf" target="_blank" rel="noopener noreferrer">Download PDF</a>
          </span>
          <span className="flex items-center gap-1">
            <strong>GitHub:</strong>
            <a className="underline" href="https://github.com/Sahriz" target="_blank" rel="noopener noreferrer">Sahriz</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
