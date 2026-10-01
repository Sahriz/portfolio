'use client';

import { useCallback, useEffect, useState } from 'react';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import ProjectCard from '../components/ProjectCard';
import ThesisFeature from '../components/ThesisFeature';
import About from '../components/About';
import ExperienceTimeline from '../components/ExperienceTimeline';
import PapersList from '../components/PapersList';
import DemoStrip from '../components/DemoStrip';
import ContactSection from '../components/ContactSection';
import { projects } from '../data/projects';
import { papers } from '../data/papers';
import { listedDemos } from '../data/demos';
import { experience } from '../data/experience';
import { profile } from '../data/profile';

// The thesis has its own block (ThesisFeature), so the papers list skips it.
const THESIS_ID = 'inverse-rendering-thesis';

const featuredProjects = projects.filter((p) => p.featured);
const listedPapers = papers.filter((p) => p.featured && p.id !== THESIS_ID);
const stripDemos = listedDemos.filter((d) => d.poster).slice(0, 3);

// Page order: top bar (layout.tsx) → hero → projects → thesis → about →
// experience → papers → demos → contact → footer.
export default function Portfolio() {
  const [sceneReady, setSceneReady] = useState(false);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  // The intro plays once per session. The inline script in layout.tsx reads
  // this flag before first paint on a full load; the class is also set here
  // so a client-side Back to this page skips the curtain too. It goes on
  // late (or on unmount) because hiding the curtain mid-split would cut the
  // animation short.
  useEffect(() => {
    if (!sceneReady) return;
    try {
      window.sessionStorage.setItem('intro-seen', '1');
    } catch {
      // Storage blocked: the intro just plays again next time.
    }
    const markSeen = () => document.documentElement.classList.add('skip-intro');
    const timer = window.setTimeout(markSeen, 3500);
    return () => {
      window.clearTimeout(timer);
      markSeen();
    };
  }, [sceneReady]);

  // Last resort: the page must never wait on WebGL. If the hero hasn't
  // reported ready by now (slow chunk, stalled GPU), open the curtain anyway.
  useEffect(() => {
    const timer = window.setTimeout(() => setSceneReady(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <div className={`page-blackout ${sceneReady ? 'page-blackout-open' : ''}`} aria-hidden>
        <div className="page-blackout-bar page-blackout-bar-top" />
        <div className="page-blackout-bar page-blackout-bar-bottom" />
      </div>
      {sceneReady && (
        <div className="star-effects" aria-hidden>
          <div className="shooting-star-trail" />
          <div className="shooting-star" />
        </div>
      )}

      <Hero onReady={handleSceneReady} />

      <section id="scroll-target-projects" className="relative z-10 mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="/ selected work"
          title="Projects"
          link={{ label: `all ${projects.length} projects →`, href: '/projects' }}
        />
        {/* 2 columns start at md, not sm: at 640px a two-column card is too
            narrow for its description and chips. */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>

      <ThesisFeature />

      <About />

      <section id="scroll-target-experience" className="relative z-10 mx-auto mt-32 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="/ education & work"
          title="Experience"
          link={{ label: 'all coursework →', href: '/courses' }}
        />
        <ExperienceTimeline items={experience} />
      </section>

      <section id="scroll-target-papers" className="relative z-10 mx-auto mt-32 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="/ writing"
          title="Papers"
          link={{ label: `all ${papers.length} papers →`, href: '/papers' }}
        />
        <PapersList papers={listedPapers} />
      </section>

      <section id="scroll-target-demos" className="relative z-10 mx-auto mt-32 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="/ interactive"
          title="Demos"
          link={{ label: `all ${listedDemos.length} demos →`, href: '/demos' }}
        />
        <DemoStrip demos={stripDemos} />
      </section>

      <ContactSection />

      <footer className="relative z-10 mt-24 border-t border-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 font-mono text-xs text-foreground/50 sm:px-6 lg:px-8">
          <span>© 2026 {profile.name}</span>
          <span>Norrköping, Sweden</span>
        </div>
      </footer>
    </div>
  );
}
