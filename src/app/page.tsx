// src/app/page.tsx
import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { ValueProps } from '@/components/value-props';
import { MiniCalculator } from '@/components/mini-calculator';
import { Features } from '@/components/features';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'DriveSense - Car Finance Guider | EMI vs SIP Calculator',
  description: 'Plan your car smartly: balance EMIs and investments with math. Compare aggressive vs balanced strategies for car financing in India.',
  keywords: ['car loan calculator', 'EMI calculator', 'SIP calculator', 'car finance', 'loan vs investment', 'India'],
  openGraph: {
    title: 'DriveSense - Car Finance Guider',
    description: 'Plan your car smartly: balance EMIs and investments with math.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <HeroSection />
        <ValueProps />
        <MiniCalculator />
        <Features />
      </main>
      <Footer />
    </div>
  );
}