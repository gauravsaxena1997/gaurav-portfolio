import { LighthouseHero } from '@/components/hero-concepts/LighthouseHero';

export const metadata = {
  title: 'Lighthouse Hero Component | Dev UI',
  description: 'A beautiful CSS blend-mode spotlight hero component.',
};

export default function LighthouseHeroPage() {
  return (
    <main className="min-h-screen bg-[#09090B] m-0 p-0 overflow-hidden">
      <LighthouseHero />
    </main>
  );
}
