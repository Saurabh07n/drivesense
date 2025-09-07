// src/app/scenarios/two-sip/page.tsx
import { Metadata } from 'next';
import ParallelSIPCalculator from './client';

export const metadata: Metadata = {
  title: 'Parallel SIPs Calculator – DriveSense',
  description: 'Calculate multiple parallel SIP investments with different parameters. Model independent SIPs running simultaneously.',
  keywords: ['parallel SIPs', 'multiple SIPs', 'SIP calculator', 'investment planning', 'portfolio SIP'],
  alternates: {
    canonical: 'https://drivesense.app/scenarios/two-sip'
  },
  openGraph: {
    title: 'Parallel SIPs Calculator – DriveSense',
    description: 'Calculate multiple parallel SIP investments with different parameters.',
    type: 'website',
  },
};

export default function ParallelSIPPage() {
  return <ParallelSIPCalculator />;
}
