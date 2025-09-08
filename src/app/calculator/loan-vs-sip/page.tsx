// src/app/calculator/loan-vs-sip/page.tsx
import { Metadata } from 'next';
import LoanVsSIPCalculator from './client';

export const metadata: Metadata = {
  title: 'Car Loan vs SIP Calculator – TorqWiser',
  description: 'Find the optimal EMI and SIP split under your monthly budget. Compare aggressive vs balanced strategies for car financing in India.',
  keywords: ['car loan vs sip', 'EMI calculator', 'SIP calculator', 'loan strategy', 'investment planning', 'car finance'],
  alternates: {
    canonical: 'https://torqwiser.app/calculator/loan-vs-sip'
  },
  openGraph: {
    title: 'Car Loan vs SIP Calculator – TorqWiser',
    description: 'Find the optimal EMI and SIP split under your monthly budget.',
    type: 'website',
  },
};

export default function LoanVsSIPPage() {
  return <LoanVsSIPCalculator />;
}
