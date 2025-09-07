// src/lib/finance.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateEMI,
  amortizationSchedule,
  totalInterestPaid,
  futureValueSIP,
  futureValuePhasedSIP,
  futureValueMultipleSIPs,
  simulateBudgetStrategy,
  formatINR,
  formatPercentage
} from './finance';
import type { LoanParams, SIPParams, StrategyParams } from './types';

describe('Financial Calculations', () => {
  describe('EMI Calculations', () => {
    it('should calculate EMI correctly for standard loan', () => {
      const loanParams: LoanParams = {
        principal: 500000,
        annualRate: 0.083, // 8.3%
        tenureMonths: 60
      };
      
      const emi = calculateEMI(loanParams);
      // EMI should be approximately ₹10,200 for ₹5L @ 8.3% for 60 months
      expect(emi).toBeCloseTo(10200, -2);
    });

    it('should handle zero interest rate', () => {
      const loanParams: LoanParams = {
        principal: 100000,
        annualRate: 0,
        tenureMonths: 12
      };
      
      const emi = calculateEMI(loanParams);
      expect(emi).toBe(100000 / 12);
    });

    it('should calculate total interest correctly', () => {
      const loanParams: LoanParams = {
        principal: 500000,
        annualRate: 0.083,
        tenureMonths: 60
      };
      
      const totalInterest = totalInterestPaid(loanParams);
      const emi = calculateEMI(loanParams);
      const totalPaid = emi * 60;
      
      expect(totalInterest).toBeCloseTo(totalPaid - 500000, -2);
    });
  });

  describe('SIP Calculations', () => {
    it('should calculate SIP future value correctly', () => {
      const monthlyAmount = 5000;
      const annualReturnRate = 0.12; // 12%
      const months = 60;
      
      const fv = futureValueSIP(monthlyAmount, annualReturnRate, months);
      // Should be significantly higher than simple multiplication
      expect(fv).toBeGreaterThan(monthlyAmount * months);
      expect(fv).toBeCloseTo(412000, -3); // Approximately ₹4.12L
    });

    it('should handle zero return rate', () => {
      const monthlyAmount = 10000;
      const annualReturnRate = 0;
      const months = 12;
      
      const fv = futureValueSIP(monthlyAmount, annualReturnRate, months);
      expect(fv).toBe(monthlyAmount * months);
    });

    it('should calculate phased SIP correctly', () => {
      const sipParams: SIPParams = {
        annualReturnRate: 0.12,
        phases: [
          { monthlyAmount: 4000, months: 36 },
          { monthlyAmount: 20000, months: 24 }
        ]
      };
      
      const result = futureValuePhasedSIP(sipParams);
      const expectedPrincipal = (4000 * 36) + (20000 * 24);
      
      expect(result.principal).toBe(expectedPrincipal);
      expect(result.fv).toBeGreaterThan(result.principal);
    });

    it('should calculate multiple SIPs correctly', () => {
      const sipArray: SIPParams[] = [
        {
          annualReturnRate: 0.12,
          phases: [{ monthlyAmount: 5000, months: 60 }]
        },
        {
          annualReturnRate: 0.10,
          phases: [{ monthlyAmount: 3000, months: 36 }]
        }
      ];
      
      const result = futureValueMultipleSIPs(sipArray);
      const expectedPrincipal = (5000 * 60) + (3000 * 36);
      
      expect(result.principal).toBe(expectedPrincipal);
      expect(result.fv).toBeGreaterThan(result.principal);
    });
  });

  describe('Strategy Simulation', () => {
    it('should simulate budget strategy correctly', () => {
      const strategyParams: StrategyParams = {
        monthlyBudget: 20000,
        horizonMonths: 60,
        loan: {
          principal: 500000,
          annualRate: 0.083,
          tenureMonths: 60
        },
        investmentAnnualRate: 0.12
      };
      
      const result = simulateBudgetStrategy(strategyParams);
      
      expect(result.emi).toBeGreaterThan(0);
      expect(result.totalPaid).toBeGreaterThan(0);
      expect(result.sipFinalValue).toBeGreaterThan(result.sipPrincipal);
      expect(result.timeline).toHaveLength(60);
    });

    it('should handle loan completion within horizon', () => {
      const strategyParams: StrategyParams = {
        monthlyBudget: 20000,
        horizonMonths: 84, // Longer than loan tenure
        loan: {
          principal: 500000,
          annualRate: 0.083,
          tenureMonths: 60
        },
        investmentAnnualRate: 0.12
      };
      
      const result = simulateBudgetStrategy(strategyParams);
      
      // After loan completion, full budget should go to SIP
      const lastTimelineEntry = result.timeline?.[result.timeline.length - 1];
      expect(lastTimelineEntry?.loanBalance).toBe(0);
    });
  });

  describe('Formatting Functions', () => {
    it('should format INR correctly', () => {
      expect(formatINR(1000000)).toBe('₹10,00,000');
      expect(formatINR(50000)).toBe('₹50,000');
      expect(formatINR(0)).toBe('₹0');
    });

    it('should format percentage correctly', () => {
      expect(formatPercentage(0.083)).toBe('8.3%');
      expect(formatPercentage(0.12)).toBe('12.0%');
      expect(formatPercentage(0.05, 2)).toBe('5.00%');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small amounts', () => {
      const loanParams: LoanParams = {
        principal: 1000,
        annualRate: 0.12,
        tenureMonths: 12
      };
      
      const emi = calculateEMI(loanParams);
      expect(emi).toBeGreaterThan(0);
      expect(emi).toBeLessThan(1000);
    });

    it('should handle very high interest rates', () => {
      const loanParams: LoanParams = {
        principal: 100000,
        annualRate: 0.24, // 24%
        tenureMonths: 12
      };
      
      const emi = calculateEMI(loanParams);
      expect(emi).toBeGreaterThan(100000 / 12);
    });

    it('should handle single month tenure', () => {
      const loanParams: LoanParams = {
        principal: 100000,
        annualRate: 0.12,
        tenureMonths: 1
      };
      
      const emi = calculateEMI(loanParams);
      expect(emi).toBeCloseTo(100000 * 1.01, -2); // Principal + 1% interest
    });
  });
});
