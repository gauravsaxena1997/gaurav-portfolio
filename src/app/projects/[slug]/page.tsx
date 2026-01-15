import { notFound } from 'next/navigation';
import { CASE_STUDIES } from '@/data';
import { CaseStudyPage } from '@/themes/tech/components/CaseStudyPage';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return CASE_STUDIES.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = CASE_STUDIES.find((cs) => cs.slug === slug);

  if (!caseStudy) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${caseStudy.title} | Gaurav Saxena`,
    description: caseStudy.shortDescription,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = CASE_STUDIES.find((cs) => cs.slug === slug);

  if (!caseStudy) {
    notFound();
  }

  // Find next and previous projects for navigation
  const currentIndex = CASE_STUDIES.findIndex((cs) => cs.slug === slug);
  const prevProject = currentIndex > 0 ? CASE_STUDIES[currentIndex - 1] : null;
  const nextProject =
    currentIndex < CASE_STUDIES.length - 1
      ? CASE_STUDIES[currentIndex + 1]
      : null;

  return (
    <CaseStudyPage
      caseStudy={caseStudy}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
