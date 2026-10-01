import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ProjectCard from '../../components/ProjectCard';
import { projects } from '../../data/projects';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'Projects',
};

export default function AllProjectsPage() {
  return (
    <div className="relative w-full min-h-screen text-foreground">
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Projects
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}, and counting.
          </p>
        </header>

        {/* md, not sm. See the note on the matching grid in app/page.tsx. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className={buttonVariants()}
          >
            <ChevronLeft className="h-4 w-4" />
            back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
