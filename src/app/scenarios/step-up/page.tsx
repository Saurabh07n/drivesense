// src/app/scenarios/step-up/page.tsx
import { Metadata } from 'next';
import StepUpSIPCalculator from './client';

export const metadata: Metadata = {
  title: 'Step-up SIP Calculator – DriveSense',
  description: 'Calculate step-up SIP investments with phased contributions. Model increasing SIP amounts over time for better wealth creation.',
  keywords: ['step-up SIP', 'phased SIP', 'increasing SIP', 'SIP calculator', 'investment planning'],
  alternates: {
    canonical: 'https://drivesense.app/scenarios/step-up'
  },
  openGraph: {
    title: 'Step-up SIP Calculator – DriveSense',
    description: 'Calculate step-up SIP investments with phased contributions.',
    type: 'website',
  },
};

export default function StepUpSIPPage() {
  return <StepUpSIPCalculator />;
}
