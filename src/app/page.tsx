/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import ProjectCard from '../components/ProjectCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { projects } from '../data/projects';

const HeroScene = dynamic(() => import('../components/HeroScene'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: 'var(--background)' }} />,
});

export default function Portfolio() {
  const [sceneReady, setSceneReady] = useState(false);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);

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
        <div className="page-blackout-bar page-blackout-bar-top" />
        {sceneReady && <div className="shooting-star" />}
        <div className="page-blackout-bar page-blackout-bar-bottom" />
      </div>
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
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ opacity: 0, animation: 'fadeIn 1.5s ease-out 2.55s forwards' }}
        >
          <div className="rounded-2xl bg-background/85 px-6 py-6 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">Jonatan Ebenholm&apos;s Portfolio</h1>
            <p className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold text-foreground/80">
            5th year student as Master of Science in Media Technology and Engineering
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-foreground/60 text-foreground hover:bg-foreground/10 text-lg sm:text-xl font-semibold px-6 py-3 min-w-[10rem]"
              >
                <a href="#scroll-target-projects">My projects</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-foreground/60 text-foreground hover:bg-foreground/10 text-lg sm:text-xl font-semibold px-6 py-3 min-w-[10rem]"
              >
                <a href="#scroll-target-aboutme">About me</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-foreground/60 text-foreground hover:bg-foreground/10 text-lg sm:text-xl font-semibold px-6 py-3 min-w-[10rem]"
              >
                <a href="#scroll-target-contactme">Contact me</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <>
        <section id="scroll-target-projects" className="relative z-10 mt-[25vh]">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          <div
            aria-hidden
            className="relative z-10 h-14 w-full"
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
