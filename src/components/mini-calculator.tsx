// src/components/mini-calculator.tsx
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { NumberField } from './ui/number-field';
import { KPICard } from './ui/kpi-card';
import { calculateEMI, formatINR, calculateStrategies } from '@/lib/finance';
import { CalculatorInputs } from '@/lib/types';
import Link from 'next/link';

export function MiniCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    carPrice: 1000000,
    downPayment: 200000,
    loanRate: 0.083,
    tenureMonths: 60,
    monthlyBudget: 25000,
    sipRate: 0.12,
    horizonMonths: 60,
    strategy: 'balanced'
  });

  const loanPrincipal = Math.max(0, inputs.carPrice - inputs.downPayment);
  const emi = useMemo(() => 
    calculateEMI({
      principal: loanPrincipal,
      annualRate: inputs.loanRate,
      tenureMonths: inputs.tenureMonths
    }), [loanPrincipal, inputs.loanRate, inputs.tenureMonths]
  );

  const results = useMemo(() => 
    calculateStrategies(inputs), [inputs]
  );

  const updateInput = (key: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quick Calculator
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get a quick preview of your car financing options. 
            See how different strategies affect your wealth creation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Your Car Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                  label="Car Price"
                  value={inputs.carPrice}
                  onChange={(value) => updateInput('carPrice', value)}
                  format="currency"
                  min={100000}
                  max={50000000}
                />
                <NumberField
                  label="Down Payment"
                  value={inputs.downPayment}
                  onChange={(value) => updateInput('downPayment', value)}
                  format="currency"
                  min={0}
                  max={inputs.carPrice}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                  label="Loan Rate (p.a.)"
                  value={inputs.loanRate}
                  onChange={(value) => updateInput('loanRate', value)}
                  format="percentage"
                  min={0.05}
                  max={0.20}
                  step={0.001}
                />
                <NumberField
                  label="Tenure (months)"
                  value={inputs.tenureMonths}
                  onChange={(value) => updateInput('tenureMonths', value)}
                  min={12}
                  max={84}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                  label="Monthly Budget"
                  value={inputs.monthlyBudget}
                  onChange={(value) => updateInput('monthlyBudget', value)}
                  format="currency"
                  min={10000}
                  max={100000}
                />
                <NumberField
                  label="SIP Return (p.a.)"
                  value={inputs.sipRate}
                  onChange={(value) => updateInput('sipRate', value)}
                  format="percentage"
                  min={0.08}
                  max={0.20}
                  step={0.001}
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Loan Principal:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatINR(loanPrincipal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">EMI:</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {formatINR(emi)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <KPICard
                    label="Aggressive"
                    value={formatINR(results.aggressive.netPosition)}
                    description="Shorter tenure"
                    trend={results.aggressive.netPosition >= 0 ? 'up' : 'down'}
                  />
                  <KPICard
                    label="Balanced"
                    value={formatINR(results.balanced.netPosition)}
                    description="Longer tenure + SIP"
                    trend={results.balanced.netPosition >= 0 ? 'up' : 'down'}
                  />
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Quick Insight</h4>
                  <p className="text-sm text-blue-800">
                    {results.balanced.netPosition > results.aggressive.netPosition
                      ? 'Balanced strategy creates more wealth through SIP investments.'
                      : 'Aggressive strategy saves more on interest payments.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button asChild size="lg" className="w-full">
                <Link href="/calculator/loan-vs-sip">
                  Get Detailed Analysis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

