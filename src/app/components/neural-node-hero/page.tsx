import { NeuralNodeHero } from '@/components/hero-concepts/NeuralNodeHero';

export const metadata = {
  title: 'Neural Node Hero Component | Dev UI',
  description: 'Interactive neural network hero section built with React Three Fiber.',
};

export default function NeuralNodeHeroPage() {
  return (
    <main className="min-h-screen bg-[#09090B]">
      <NeuralNodeHero />
    </main>
  );
}
