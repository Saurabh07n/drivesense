// src/app/calculator/emi/client.tsx
'use client';

import { useState, useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import { CalculatorCard } from '@/components/ui/calculator-card';
import { NumberField } from '@/components/ui/number-field';
import { SliderField } from '@/components/ui/slider-field';
import { KPICard } from '@/components/ui/kpi-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { calculateEMI, amortizationSchedule, totalInterestPaid, formatINR, formatPercentage } from '@/lib/finance';
import { LoanParams } from '@/lib/types';
import { Download, RotateCcw } from 'lucide-react';

export default function EMICalculator() {
  const [loanParams, setLoanParams] = useState<LoanParams>({
    principal: 800000,
    annualRate: 0.083,
    tenureMonths: 60
  });

  const emi = useMemo(() => calculateEMI(loanParams), [loanParams]);
  const totalInterest = useMemo(() => totalInterestPaid(loanParams), [loanParams]);
  const amortizationData = useMemo(() => amortizationSchedule(loanParams), [loanParams]);
  const totalPaid = loanParams.principal + totalInterest;

  const updateLoanParam = (key: keyof LoanParams, value: number) => {
    setLoanParams(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setLoanParams({
      principal: 800000,
      annualRate: 0.083,
      tenureMonths: 60
    });
  };

  const exportAmortizationSchedule = () => {
    const csvContent = [
      ['Month', 'EMI', 'Principal', 'Interest', 'Balance'],
      ...amortizationData.map(row => [
        row.month.toString(),
        formatINR(row.emi),
        formatINR(row.principal),
        formatINR(row.interest),
        formatINR(row.balance)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emi-amortization-schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Minimal Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EMI Calculator</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportAmortizationSchedule}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <CalculatorCard
              title="Loan Details"
              helpText="Enter your loan amount, interest rate, and tenure"
            >
              <div className="space-y-4">
                <NumberField
                  label="Loan Amount"
                  value={loanParams.principal}
                  onChange={(value) => updateLoanParam('principal', value)}
                  format="currency"
                  min={100000}
                  max={50000000}
                />
                <SliderField
                  label="Interest Rate (p.a.)"
                  value={loanParams.annualRate}
                  onChange={(value) => updateLoanParam('annualRate', value)}
                  min={0.05}
                  max={0.20}
                  step={0.001}
                  format="percentage"
                />
                <SliderField
                  label="Tenure (months)"
                  value={loanParams.tenureMonths}
                  onChange={(value) => updateLoanParam('tenureMonths', value)}
                  min={12}
                  max={84}
                  step={1}
                />
              </div>
            </CalculatorCard>

            {/* EMI Formula */}
            <CalculatorCard
              title="EMI Formula"
              helpText="The mathematical formula used to calculate EMI"
            >
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-mono text-xs">
                    EMI = P × r × (1+r)^n / ((1+r)^n - 1)
                  </p>
                </div>
                <div className="space-y-1 text-gray-600">
                  <p><strong>P</strong> = Principal amount</p>
                  <p><strong>r</strong> = Monthly interest rate</p>
                  <p><strong>n</strong> = Number of months</p>
                </div>
              </div>
            </CalculatorCard>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Primary EMI Display */}
            <div className="text-center">
              <KPICard
                label="Your Monthly EMI"
                value={formatINR(emi)}
                description="Monthly payment"
                isPrimary={true}
                delay={0.1}
              />
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <KPICard
                label="Total Amount"
                value={formatINR(totalPaid)}
                description="Principal + Interest"
                delay={0.2}
              />
              <KPICard
                label="Total Interest"
                value={formatINR(totalInterest)}
                description="Interest component"
                delay={0.3}
              />
              <KPICard
                label="Interest Rate"
                value={formatPercentage(loanParams.annualRate)}
                description="Annual rate"
                delay={0.4}
              />
            </div>

            {/* Amortization Schedule */}
            <CalculatorCard
              title="Amortization Schedule"
              helpText="Month-by-month breakdown of your loan payments"
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">EMI</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amortizationData.slice(0, 12).map((row) => (
                      <TableRow key={row.month}>
                        <TableCell className="font-medium">{row.month}</TableCell>
                        <TableCell className="text-right">{formatINR(row.emi)}</TableCell>
                        <TableCell className="text-right">{formatINR(row.principal)}</TableCell>
                        <TableCell className="text-right">{formatINR(row.interest)}</TableCell>
                        <TableCell className="text-right">{formatINR(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                    {amortizationData.length > 12 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                          ... and {amortizationData.length - 12} more months
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {amortizationData.length > 12 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={exportAmortizationSchedule}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Full Schedule
                  </Button>
                </div>
              )}
            </CalculatorCard>

            {/* Insights */}
            <CalculatorCard
              title="Key Insights"
              helpText="Important observations about your loan"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Interest vs Principal</h4>
                    <p className="text-sm text-blue-800">
                      You&apos;ll pay {formatINR(totalInterest)} in interest, which is{' '}
                      {formatPercentage(totalInterest / loanParams.principal)} of your loan amount.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Monthly Commitment</h4>
                    <p className="text-sm text-green-800">
                      Your EMI of {formatINR(emi)} represents{' '}
                      {formatPercentage(emi / (emi * 12))} of your annual loan payments.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Prepayment Consideration</h4>
                  <p className="text-sm text-yellow-800">
                    Consider prepaying if you have surplus funds earning less than{' '}
                    {formatPercentage(loanParams.annualRate)} annually. 
                    Early prepayment can significantly reduce your total interest burden.
                  </p>
                </div>
              </div>
            </CalculatorCard>
          </div>
        </div>
      </main>
    </div>
  );
}
