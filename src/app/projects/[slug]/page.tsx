import { notFound } from 'next/navigation';
import { CASE_STUDIES } from '@/data';
import { ProjectDetailPage } from '@/themes/github/components/ProjectDetailPage';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return CASE_STUDIES.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = CASE_STUDIES.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Gaurav Saxena`,
    description: project.shortDescription,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = CASE_STUDIES.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Find next and previous projects for navigation
  const currentIndex = CASE_STUDIES.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? CASE_STUDIES[currentIndex - 1] : null;
  const nextProject =
    currentIndex < CASE_STUDIES.length - 1
      ? CASE_STUDIES[currentIndex + 1]
      : null;

  return (
    <ProjectDetailPage
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
