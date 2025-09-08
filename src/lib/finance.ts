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
export const monthlyRate = (annual: number) => annual / 12; // For EMI calculations
export const effectiveMonthlyRate = (annual: number) => Math.pow(1 + annual, 1/12) - 1; // For SIP calculations

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
  
  // Correct formula: Balance = P(1+r)^k - EMI * [((1+r)^k - 1) / r]
  const powK = Math.pow(1 + r, monthsPaid);
  const powN = Math.pow(1 + r, tenureMonths);
  
  // Alternative correct formula (more numerically stable):
  return principal * (powN - powK) / (powN - 1) * emi / r;
}

/** Future Value of a constant SIP with monthly compounding: 
 * M = P × ({[1 + i]^n – 1} / i) × (1 + i)
 * Where i is the effective monthly rate: (1 + annual)^(1/12) - 1
 */
export function futureValueSIP(monthlyAmount: number, annualReturnRate: number, months: number): number {
  const i = effectiveMonthlyRate(annualReturnRate);
  if (i === 0) return monthlyAmount * months;
  
  const pow = Math.pow(1 + i, months);
  return monthlyAmount * ((pow - 1) / i) * (1 + i);
}

/** Phased (step-up) SIP: sequential phases */
export function futureValuePhasedSIP(params: SIPParams): { fv: number; principal: number } {
  const { annualReturnRate, phases } = params;
  const i = effectiveMonthlyRate(annualReturnRate);
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
  const rInv = effectiveMonthlyRate(investmentAnnualRate);
  const emi = calculateEMI(loan);
  const schedule = amortizationSchedule(loan);

  let sipFV = 0; 
  let sipPrincipal = 0;
  let totalPaid = 0; 
  let totalInterest = 0; 
  let loanBalance = loan.principal;
  const timeline: StrategyResult['timeline'] = [];

  for (let m = 1; m <= horizonMonths; m++) {
    let sipThisMonth = 0;
    
    // Loan processing
    if (m <= loan.tenureMonths) {
      const row = schedule[m - 1];
      loanBalance = row.balance;
      totalPaid += row.emi;
      totalInterest += row.interest;
      sipThisMonth = Math.max(0, monthlyBudget - row.emi);
    } else {
      // Loan finished; full budget goes to SIP
      sipThisMonth = monthlyBudget;
      loanBalance = 0;
    }

    // Add SIP contribution first (beginning of month), then grow
    sipFV += sipThisMonth;
    sipPrincipal += sipThisMonth;
    
    // Grow SIP value for this month
    sipFV *= (1 + rInv);

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
  const customLoan: LoanParams = { ...loanParams, tenureMonths: tenureMonths };

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

/** NEW: Calculate strategy with exact tenure for redesigned Car Finance Planner */
export function calculateCarFinanceStrategy(
  carPrice: number,
  downPayment: number,
  loanRate: number,
  tenureMonths: number,
  monthlyBudget: number,
  sipRate: number,
  horizonMonths: number
): {
  emi: number;
  totalInterest: number;
  monthlySIP: number;
  sipPrincipal: number;
  sipReturns: number;
  sipFinalValue: number;
  netPosition: number;
  timeline: Array<{ month: number; loanBalance: number; sipValue: number }>;
} {
  const principal = Math.max(0, carPrice - downPayment);
  
  const loanParams: LoanParams = {
    principal,
    annualRate: loanRate,
    tenureMonths
  };

  const emi = calculateEMI(loanParams);
  const totalInterest = totalInterestPaid(loanParams);
  const monthlySIP = Math.max(0, monthlyBudget - emi);
  
  // Calculate SIP details
  const sipFinalValue = futureValueSIP(monthlySIP, sipRate, horizonMonths);
  const sipPrincipal = monthlySIP * horizonMonths;
  const sipReturns = sipFinalValue - sipPrincipal;
  
  // Net position: SIP final value - total interest paid
  const netPosition = sipFinalValue - totalInterest;

  // Create timeline
  const schedule = amortizationSchedule(loanParams);
  const timeline: Array<{ month: number; loanBalance: number; sipValue: number }> = [];
  
  let sipValue = 0;
  const monthlySIPRate = effectiveMonthlyRate(sipRate);
  
  for (let m = 1; m <= horizonMonths; m++) {
    // SIP growth
    sipValue += monthlySIP;
    sipValue *= (1 + monthlySIPRate);
    
    // Loan balance
    let loanBalance = 0;
    if (m <= tenureMonths && schedule[m - 1]) {
      loanBalance = schedule[m - 1].balance;
    }
    
    timeline.push({ month: m, loanBalance, sipValue });
  }

  return {
    emi,
    totalInterest,
    monthlySIP,
    sipPrincipal,
    sipReturns,
    sipFinalValue,
    netPosition,
    timeline
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
  const monthlySIPRate = effectiveMonthlyRate(sipRate);
  
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

/** ENHANCED: Calculate effective interest rate (IRR) for loan */
export function calculateEffectiveRate(params: LoanParams, processingFeeRate: number = 0): number {
  const { principal, annualRate, tenureMonths } = params;
  const processingFee = principal * processingFeeRate;
  const emi = calculateEMI(params);
  
  // Net amount received = principal - processing fee
  const netAmount = principal - processingFee;
  
  // Use Newton-Raphson to find IRR
  let rate = annualRate; // Initial guess
  const tolerance = 0.0001;
  let iteration = 0;
  const maxIterations = 100;
  
  while (iteration < maxIterations) {
    let npv = -netAmount;
    let dnpv = 0;
    const monthlyRate = rate / 12;
    
    for (let i = 1; i <= tenureMonths; i++) {
      const discountFactor = Math.pow(1 + monthlyRate, -i);
      npv += emi * discountFactor;
      dnpv -= (i * emi * discountFactor) / (1 + monthlyRate);
    }
    
    if (Math.abs(npv) < tolerance) break;
    
    rate = rate - (npv / dnpv) * 12; // Convert back to annual
    iteration++;
  }
  
  return rate;
}

/** ENHANCED: Calculate prepayment savings */
export function calculatePrepaymentSavings(
  loanParams: LoanParams,
  prepaymentAmount: number,
  prepaymentMonth: number
): { interestSaved: number; tenureReduced: number; newEMI?: number } {
  const originalSchedule = amortizationSchedule(loanParams);
  const balanceAtPrepayment = outstandingBalance(loanParams, prepaymentMonth);
  
  if (prepaymentAmount >= balanceAtPrepayment) {
    // Full prepayment
    const remainingInterest = originalSchedule
      .slice(prepaymentMonth)
      .reduce((sum, row) => sum + row.interest, 0);
    
    return {
      interestSaved: remainingInterest,
      tenureReduced: loanParams.tenureMonths - prepaymentMonth,
    };
  }
  
  // Partial prepayment - calculate new schedule
  const newPrincipal = balanceAtPrepayment - prepaymentAmount;
  const remainingTenure = loanParams.tenureMonths - prepaymentMonth;
  
  const newLoanParams: LoanParams = {
    principal: newPrincipal,
    annualRate: loanParams.annualRate,
    tenureMonths: remainingTenure
  };
  
  const newSchedule = amortizationSchedule(newLoanParams);
  const originalRemainingInterest = originalSchedule
    .slice(prepaymentMonth)
    .reduce((sum, row) => sum + row.interest, 0);
  
  const newTotalInterest = newSchedule.reduce((sum, row) => sum + row.interest, 0);
  
  return {
    interestSaved: originalRemainingInterest - newTotalInterest,
    tenureReduced: 0, // Same tenure, reduced EMI
    newEMI: calculateEMI(newLoanParams)
  };
}