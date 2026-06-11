import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import PrimaryNav from '../../components/PrimaryNav';
import ProjectCard from '../../components/ProjectCard';
import { ThemeToggle } from '../../components/ThemeToggle';
import { projects } from '../../data/projects';

export const metadata = {
  title: 'Projects',
};

export default function AllProjectsPage() {
  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <PrimaryNav />
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <main className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Projects
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} — and counting.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
          >
            <ChevronLeft className="h-4 w-4" />
            back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
