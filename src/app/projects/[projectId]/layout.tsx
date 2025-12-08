import type { Metadata } from 'next';
import { projects } from '../../../data/projects';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: {
    projectId: string;
  };
}

export async function generateMetadata(
  props: {
    params: Promise<{ projectId: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const { projectId } = params;

  // Find the project in the projects array
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default function ProjectLayout({ children }: Pick<ProjectLayoutProps, 'children'>) {
  return <>{children}</>;
}
