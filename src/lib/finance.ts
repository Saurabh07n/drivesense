// src/lib/finance.ts
import type { 
  LoanParams, 
  SIPParams, 
  SIPPhase, 
  StrategyParams, 
  StrategyResult, 
  AmortizationRow,
  CalculatorInputs,
  ComparisonResult,
  StrategyType
} from './types';

/** Monthly compounding helpers */
export const monthlyRate = (annual: number) => annual / 12;

/** EMI formula: E = P r (1+r)^n / ((1+r)^n - 1) */
export function calculateEMI({ principal, annualRate, tenureMonths }: LoanParams): number {
  const r = monthlyRate(annualRate);
  if (r === 0) return principal / tenureMonths;
  const pow = Math.pow(1 + r, tenureMonths);
  return principal * r * pow / (pow - 1);
}

/** Amortization schedule (fast, iterates once) */
export function amortizationSchedule(params: LoanParams): AmortizationRow[] {
  const { principal: P, annualRate, tenureMonths } = params;
  const r = monthlyRate(annualRate);
  const emi = calculateEMI(params);
  const rows: AmortizationRow[] = [];
  let balance = P;
  
  for (let m = 1; m <= tenureMonths; m++) {
    const interest = balance * r;
    const principalPaid = Math.min(emi - interest, balance);
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month: m, interest, principal: principalPaid, balance, emi });
  }
  
  return rows;
}

/** Total interest from schedule */
export function totalInterestPaid(params: LoanParams): number {
  return amortizationSchedule(params).reduce((acc, r) => acc + r.interest, 0);
}

/** Outstanding balance after k months (quick) */
export function outstandingBalance({ principal, annualRate, tenureMonths }: LoanParams, monthsPaid: number): number {
  const r = monthlyRate(annualRate);
  if (r === 0) return principal * (1 - monthsPaid / tenureMonths);
  const emi = calculateEMI({ principal, annualRate, tenureMonths });
  const pow1 = Math.pow(1 + r, monthsPaid);
  // Balance after k payments (closed-form)
  return principal * Math.pow(1 + r, monthsPaid) - emi * (pow1 - 1) / r;
}

/** Future Value of a constant SIP with monthly compounding: 
 * FV = A * [((1+i)^n - 1) * (1+i)] / i
 */
export function futureValueSIP(monthlyAmount: number, annualReturnRate: number, months: number): number {
  const i = monthlyRate(annualReturnRate);
  if (i === 0) return monthlyAmount * months;
  const pow = Math.pow(1 + i, months);
  return monthlyAmount * ((pow - 1) * (1 + i)) / i;
}

/** Phased (step-up) SIP: sequential phases */
export function futureValuePhasedSIP(params: SIPParams): { fv: number; principal: number } {
  const { annualReturnRate, phases } = params;
  const i = monthlyRate(annualReturnRate);
  let fv = 0;
  let principal = 0;
  
  // We treat phases sequentially; earlier phases compound through later months
  // Accumulate by rolling FV forward.
  for (let p = 0; p < phases.length; p++) {
    const { monthlyAmount, months } = phases[p];
    // FV of this phase over its own months
    const fvPhase = futureValueSIP(monthlyAmount, annualReturnRate, months);
    principal += monthlyAmount * months;
    fv = fv * Math.pow(1 + i, months) + fvPhase; // roll previous FV through this phase duration
  }
  
  return { fv, principal };
}

/** Parallel SIPs: sum of independent SIPs (e.g., 4k for 36m and 20k for 24m starting later) 
 * Pass each SIP as its own phased definition; include zero-phase at start if it begins later.
 */
export function futureValueMultipleSIPs(arr: SIPParams[]): { fv: number; principal: number } {
  return arr.reduce((acc, cur) => {
    const { fv, principal } = futureValuePhasedSIP(cur);
    return { fv: acc.fv + fv, principal: acc.principal + principal };
  }, { fv: 0, principal: 0 });
}

/** Strategy simulator: given monthly budget, compute EMI, SIP each month, and FV over a horizon. 
 * - If loan tenure < horizon, SIP increases to full budget after loan ends.
 */
export function simulateBudgetStrategy(params: StrategyParams): StrategyResult {
  const { monthlyBudget, horizonMonths, loan, investmentAnnualRate } = params;
  const rInv = monthlyRate(investmentAnnualRate);
  const emi = calculateEMI(loan);
  const schedule = amortizationSchedule(loan);

  let sipFV = 0; 
  let sipPrincipal = 0;
  let totalPaid = 0; 
  let totalInterest = 0; 
  let loanBalance = loan.principal;
  const timeline: StrategyResult['timeline'] = [];

  for (let m = 1; m <= horizonMonths; m++) {
    // Grow existing SIP FV
    sipFV *= (1 + rInv);

    // Loan month
    if (m <= loan.tenureMonths) {
      const row = schedule[m - 1];
      loanBalance = row.balance;
      totalPaid += row.emi;
      totalInterest += row.interest;
      const sipThisMonth = Math.max(0, monthlyBudget - row.emi);
      sipFV += sipThisMonth; // contribution at month-end representation
      sipPrincipal += sipThisMonth;
    } else {
      // Loan finished; full budget goes to SIP
      sipFV += monthlyBudget;
      sipPrincipal += monthlyBudget;
      loanBalance = 0;
    }

    timeline?.push({ month: m, loanBalance, sipValue: sipFV });
  }

  return {
    emi,
    totalPaid,
    totalInterest,
    sipPrincipal,
    sipFinalValue: sipFV,
    sipExtraReturn: sipFV - sipPrincipal,
    netPosition: sipFV - totalInterest,
    timeline,
  };
}

/** Calculate different strategies based on inputs */
export function calculateStrategies(inputs: CalculatorInputs): ComparisonResult {
  const { carPrice, downPayment, loanRate, tenureMonths, monthlyBudget, sipRate, horizonMonths } = inputs;
  const principal = Math.max(0, carPrice - downPayment);
  
  const loanParams: LoanParams = {
    principal,
    annualRate: loanRate,
    tenureMonths
  };

  // Aggressive strategy: shorter tenure (75% of original)
  const aggressiveTenure = Math.max(12, Math.floor(tenureMonths * 0.75));
  const aggressiveLoan: LoanParams = { ...loanParams, tenureMonths: aggressiveTenure };
  
  // Balanced strategy: longer tenure (125% of original, max 84 months)
  const balancedTenure = Math.min(84, Math.floor(tenureMonths * 1.25));
  const balancedLoan: LoanParams = { ...loanParams, tenureMonths: balancedTenure };
  
  // Custom strategy: same as balanced for now (can be customized later)
  const customLoan: LoanParams = { ...loanParams, tenureMonths: balancedTenure };

  const baseParams = {
    monthlyBudget,
    horizonMonths,
    investmentAnnualRate: sipRate
  };

  return {
    aggressive: simulateBudgetStrategy({ ...baseParams, loan: aggressiveLoan }),
    balanced: simulateBudgetStrategy({ ...baseParams, loan: balancedLoan }),
    custom: simulateBudgetStrategy({ ...baseParams, loan: customLoan })
  };
}

/** Utility: INR formatting */
export function formatINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(n);
}

/** Utility: Percentage formatting */
export function formatPercentage(n: number, decimals: number = 1): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

/** Utility: Number formatting with Indian locale */
export function formatNumber(n: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-IN', { 
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(n);
}

/** Calculate loan-to-value ratio */
export function calculateLTV(carPrice: number, downPayment: number): number {
  return (carPrice - downPayment) / carPrice;
}

/** Calculate down payment percentage */
export function calculateDownPaymentPercentage(carPrice: number, downPayment: number): number {
  return downPayment / carPrice;
}

/** Validate loan parameters */
export function validateLoanParams(params: LoanParams): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (params.principal <= 0) {
    errors.push('Loan principal must be greater than 0');
  }
  
  if (params.annualRate < 0 || params.annualRate > 1) {
    errors.push('Annual rate must be between 0% and 100%');
  }
  
  if (params.tenureMonths < 1 || params.tenureMonths > 120) {
    errors.push('Tenure must be between 1 and 120 months');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/** Calculate break-even point for SIP vs loan prepayment */
export function calculateBreakEvenPoint(
  loanParams: LoanParams,
  sipRate: number,
  monthlyBudget: number
): { months: number; description: string } {
  const emi = calculateEMI(loanParams);
  const availableForSIP = Math.max(0, monthlyBudget - emi);
  
  if (availableForSIP <= 0) {
    return { months: 0, description: 'No surplus for SIP' };
  }
  
  // Find month where SIP FV equals loan interest saved by prepayment
  const monthlyLoanRate = monthlyRate(loanParams.annualRate);
  const monthlySIPRate = monthlyRate(sipRate);
  
  let sipValue = 0;
  let interestSaved = 0;
  let month = 0;
  
  while (month < loanParams.tenureMonths && sipValue < interestSaved) {
    month++;
    sipValue = futureValueSIP(availableForSIP, sipRate, month);
    
    // Approximate interest saved by prepayment
    const remainingBalance = outstandingBalance(loanParams, month - 1);
    interestSaved = remainingBalance * monthlyLoanRate * month;
  }
  
  return {
    months: month,
    description: month >= loanParams.tenureMonths 
      ? 'SIP never catches up to prepayment benefits'
      : `Break-even at ${month} months`
  };
}

/** Calculate optimal EMI based on budget and strategy */
export function calculateOptimalEMI(
  monthlyBudget: number,
  strategy: StrategyType,
  loanParams: LoanParams
): number {
  const maxEMI = monthlyBudget * 0.6; // Max 60% of budget for EMI
  const currentEMI = calculateEMI(loanParams);
  
  switch (strategy) {
    case 'aggressive':
      return Math.min(currentEMI * 1.2, maxEMI);
    case 'balanced':
      return Math.min(currentEMI * 0.8, maxEMI);
    case 'custom':
      return Math.min(currentEMI, maxEMI);
    default:
      return currentEMI;
  }
}

/** Calculate total cost of ownership */
export function calculateTotalCostOfOwnership(
  carPrice: number,
  downPayment: number,
  loanResult: StrategyResult,
  additionalCosts: {
    insurance?: number;
    maintenance?: number;
    fuel?: number;
    depreciation?: number;
  } = {}
): number {
  const { insurance = 0, maintenance = 0, fuel = 0, depreciation = 0 } = additionalCosts;
  
  return carPrice + loanResult.totalInterest + insurance + maintenance + fuel + depreciation;
}

/** Calculate wealth creation potential */
export function calculateWealthCreation(
  sipResult: StrategyResult,
  alternativeInvestment: number = 0.12 // 12% annual return
): {
  sipWealth: number;
  alternativeWealth: number;
  advantage: number;
  advantagePercentage: number;
} {
  const sipWealth = sipResult.sipFinalValue;
  const alternativeWealth = sipResult.sipPrincipal * Math.pow(1 + alternativeInvestment, sipResult.timeline?.length || 1);
  const advantage = sipWealth - alternativeWealth;
  const advantagePercentage = (advantage / alternativeWealth) * 100;
  
  return {
    sipWealth,
    alternativeWealth,
    advantage,
    advantagePercentage
  };
}

