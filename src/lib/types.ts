// src/lib/types.ts
export type Currency = number; // store in INR as numbers; format at render

export interface LoanParams {
  principal: number;          // e.g., 500000
  annualRate: number;         // e.g., 0.083 for 8.3%
  tenureMonths: number;       // total tenure in months
}

export interface SIPPhase {    // for phased/step-up SIPs
  monthlyAmount: number;      // ₹ per month
  months: number;             // duration of this phase
}

export interface SIPParams {
  annualReturnRate: number;   // e.g., 0.10 for 10%
  phases: SIPPhase[];         // one or many phases; sequential
}

export interface StrategyParams {
  monthlyBudget: number;      // total monthly budget for EMI+SIP
  horizonMonths: number;      // evaluation horizon (e.g., 60)
  loan: LoanParams;           // the loan to simulate
  investmentAnnualRate: number;
  // Either provide a fixed tenure (balanced) or a shorter tenure (aggressive)
  // For custom splits, you can pass a function to compute SIP per month.
}

export interface StrategyResult {
  emi: number;
  totalPaid: number;          // total EMI outflow
  totalInterest: number;      // interest component only
  sipPrincipal: number;       // sum of SIP contributions
  sipFinalValue: number;      // FV at horizon
  sipExtraReturn: number;     // FV - principal
  netPosition: number;        // sipFinalValue - totalInterest (optional lens)
  timeline?: Array<{ month: number; loanBalance: number; sipValue: number; }>; // for charts
}

export interface AmortizationRow {
  month: number;
  interest: number;
  principal: number;
  balance: number;
  emi: number;
}

export type StrategyType = 'aggressive' | 'balanced' | 'custom';

export interface CalculatorInputs {
  carPrice: number;
  downPayment: number;
  loanRate: number;
  tenureMonths: number;
  monthlyBudget: number;
  sipRate: number;
  horizonMonths: number;
  strategy: StrategyType;
}

export interface ComparisonResult {
  aggressive: StrategyResult;
  balanced: StrategyResult;
  custom: StrategyResult;
}

// UI Component Props
export interface KPICardProps {
  label: string;
  value: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface CalculatorCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  format?: 'currency' | 'percentage' | 'number';
}

export interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: 'currency' | 'percentage' | 'number';
  description?: string;
}

// Chart Data Types
export interface ChartDataPoint {
  month: number;
  loanBalance: number;
  sipValue: number;
  emi: number;
  sipContribution: number;
}

export interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
  className?: string;
}

// SEO and Metadata
export interface PageMetadata {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
}

// Form Validation
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  errors: ValidationError[];
}

// Export/Import
export interface ExportData {
  inputs: CalculatorInputs;
  results: ComparisonResult;
  timestamp: string;
  version: string;
}

// FAQ and Help
export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'emi' | 'sip' | 'strategy' | 'technical';
}

export interface HelpSection {
  title: string;
  content: string;
  examples?: string[];
  formulas?: string[];
}

