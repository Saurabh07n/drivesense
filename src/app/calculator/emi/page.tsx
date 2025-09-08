// src/app/calculator/emi/page.tsx
import { Metadata } from 'next';
import EMICalculator from './client';

export const metadata: Metadata = {
  title: 'EMI Calculator – TorqWiser',
  description: 'Calculate your car loan EMI with detailed amortization schedule. Plan your car financing with accurate EMI calculations.',
  keywords: ['EMI calculator', 'car loan EMI', 'loan calculator', 'amortization schedule', 'car finance'],
  alternates: {
    canonical: 'https://torqwiser.app/calculator/emi'
  },
  openGraph: {
    title: 'EMI Calculator – TorqWiser',
    description: 'Calculate your car loan EMI with detailed amortization schedule.',
    type: 'website',
  },
};

export default function EMIPage() {
  return <EMICalculator />;
}
