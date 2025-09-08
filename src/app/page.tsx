// src/app/page.tsx
import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';

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
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
      </main>
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© 2024 DriveSense. Plan smarter, drive happier.</p>
      </footer>
    </div>
  );
}