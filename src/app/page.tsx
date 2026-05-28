/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

const HeroScene = dynamic(() => import('../components/HeroScene'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: 'var(--background)' }} />,
});

export default function Portfolio() {
  const [sceneReady, setSceneReady] = useState(false);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  const [navHidden, setNavHidden] = useState(false);

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

  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const spinRef = useRef<number>(0);
  const dragStartSpin = useRef<number>(0);
  const dragLastX = useRef<number>(0);
  const dragLastTime = useRef<number>(0);
  const spinVelocity = useRef<number>(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const timeSpinDir = useRef<number>(1);

  const skillIcons = [
    { name: 'C++', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
    { name: 'OpenGL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opengl/opengl-original.svg' },
    { name: 'C#', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-plain.svg' },
    { name: 'Unity', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg' },
    { name: 'MATLAB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg' },
    { name: 'Python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
    { name: 'Godot', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/godot/godot-original.svg' },
  ];
  const aboutBackground = 'color-mix(in srgb, var(--primary) 18%, var(--background) 82%)';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerDown = (e: PointerEvent | TouchEvent) => {
      if ((e.target as HTMLElement).closest('.hero-outline-btn')) return;
      isDragging.current = true;
      const clientX = 'clientX' in e ? e.clientX : (e.touches && e.touches[0].clientX) || 0;
      dragStartX.current = clientX;
      dragStartSpin.current = spinRef.current;
      dragLastX.current = clientX;
      dragLastTime.current = performance.now();
      spinVelocity.current = 0;
      document.body.style.userSelect = 'none';
    };

    const handlePointerMove = (e: PointerEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = 'clientX' in e ? e.clientX : (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - dragStartX.current;
      spinRef.current = dragStartSpin.current - deltaX * 0.005;

      const dragVel = -(clientX - dragLastX.current) * 0.005 / ((performance.now() - dragLastTime.current) / 1000 || 1);
      if (Math.abs(dragVel) > 0.001 && Math.sign(dragVel) !== timeSpinDir.current) {
        timeSpinDir.current = Math.sign(dragVel);
      }

      const now = performance.now();
      const dt = (now - dragLastTime.current) / 1000;
      if (dt > 0) {
        spinVelocity.current = -(clientX - dragLastX.current) * 0.005 / dt;
      }
      dragLastX.current = clientX;
      dragLastTime.current = now;
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = '';
    };

    canvas.addEventListener('pointerdown', handlePointerDown as EventListener);
    window.addEventListener('pointermove', handlePointerMove as EventListener);
    window.addEventListener('pointerup', handlePointerUp as EventListener);
    canvas.addEventListener('touchstart', handlePointerDown as EventListener);
    window.addEventListener('touchmove', handlePointerMove as EventListener);
    window.addEventListener('touchend', handlePointerUp as EventListener);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown as EventListener);
      window.removeEventListener('pointermove', handlePointerMove as EventListener);
      window.removeEventListener('pointerup', handlePointerUp as EventListener);
      canvas.removeEventListener('touchstart', handlePointerDown as EventListener);
      window.removeEventListener('touchmove', handlePointerMove as EventListener);
      window.removeEventListener('touchend', handlePointerUp as EventListener);
      document.body.style.userSelect = '';
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <div className={`page-blackout ${sceneReady ? 'page-blackout-open' : ''}`} aria-hidden>
        <div className="page-blackout-flash" />
        <div className="page-blackout-bar page-blackout-bar-top" />
        {sceneReady && <div className="shooting-star" />}
        <div className="page-blackout-bar page-blackout-bar-bottom" />
      </div>
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
        ref={canvasRef}
        style={{ zIndex: 9, height: '75vh', pointerEvents: 'auto' }}
      >
        <div className="absolute right-4 top-4 z-20">
          <ThemeToggle />
        </div>
        <HeroScene
          spinRef={spinRef}
          timeSpinDirRef={timeSpinDir}
          isDraggingRef={isDragging}
          spinVelocityRef={spinVelocity}
          onReady={handleSceneReady}
        />
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
        <section id="scroll-target-projects" className="relative z-10 mt-[25vh]">
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
            className="relative w-full px-4 py-14 text-center"
            style={{ backgroundColor: aboutBackground }}
          >
            <div className="mx-auto max-w-5xl px-6 py-10 text-center">
              <h1 className="text-3xl font-bold text-foreground">About Me</h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                I am a fifth year student at Linköpings University studying to become a Master of Science in Media Technology and
                Engineering. During my master&apos;s program I am specializing in Computer Graphics, GPU programming, video game
                systems programming, and machine learning/AI. In my free time I enjoy programming personal projects, some of which
                are showcased above. I also enjoy playing video games, drawing, going to the gym, or socializing with friends.
              </p>
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

          <section className="pb-24 pt-12">
            <h2 className="text-center text-3xl font-bold">Skills</h2>
            <div className="mt-6 flex flex-col items-center w-full">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <TooltipProvider>
                  {skillIcons.map((skill) => (
                    <Tooltip key={skill.name}>
                      <TooltipTrigger asChild>
                        <img className="h-16 w-16 sm:h-20 sm:w-20" src={skill.src} alt={skill.name} />
                      </TooltipTrigger>
                      <TooltipContent side="top">{skill.name}</TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
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
