// src/app/calculator/loan-vs-sip/client.tsx
'use client';

import { useState, useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import { CalculatorCard } from '@/components/ui/calculator-card';
import { NumberField } from '@/components/ui/number-field';
import { SliderField } from '@/components/ui/slider-field';
import { KPICard } from '@/components/ui/kpi-card';
import { LoanSIPChart } from '@/components/ui/loan-sip-chart';
import { GuidanceCard } from '@/components/ui/guidance-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calculateStrategies, formatINR } from '@/lib/finance';
import { CalculatorInputs, StrategyType, ChartDataPoint } from '@/lib/types';
import { RotateCcw } from 'lucide-react';

export default function LoanVsSIPCalculator() {
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

  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('balanced');

  const loanPrincipal = Math.max(0, inputs.carPrice - inputs.downPayment);
  
  const results = useMemo(() => 
    calculateStrategies(inputs), [inputs]
  );

  const selectedResult = results[selectedStrategy];
  
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!selectedResult.timeline) return [];
    
    return selectedResult.timeline.map((point) => ({
      month: point.month,
      loanBalance: point.loanBalance,
      sipValue: point.sipValue,
      emi: selectedResult.emi,
      sipContribution: Math.max(0, inputs.monthlyBudget - selectedResult.emi)
    }));
  }, [selectedResult, inputs.monthlyBudget]);

  const updateInput = (key: keyof CalculatorInputs, value: number | StrategyType) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setInputs({
      carPrice: 1000000,
      downPayment: 200000,
      loanRate: 0.083,
      tenureMonths: 60,
      monthlyBudget: 25000,
      sipRate: 0.12,
      horizonMonths: 60,
      strategy: 'balanced'
    });
  };


  // Generate guidance based on results
  const generateGuidance = () => {
    const bestStrategy = results.balanced.netPosition > results.aggressive.netPosition ? 'balanced' : 'aggressive';
    const bestResult = results[bestStrategy];
    const savings = Math.abs(bestResult.netPosition);
    
    if (bestResult.netPosition > 0) {
      return {
        recommendation: 'positive' as const,
        title: 'Balanced Approach',
        value: `Saves ₹${Math.round(savings / 1000)}K more`,
        description: 'in 5 years compared to aggressive strategy',
        details: 'By choosing a longer loan tenure and investing the difference in SIP, you can earn more returns than the extra interest you pay. This strategy maximizes your wealth creation potential.'
      };
    } else {
      return {
        recommendation: 'negative' as const,
        title: 'Aggressive Approach',
        value: `Saves ₹${Math.round(savings / 1000)}K more`,
        description: 'in 5 years compared to balanced strategy',
        details: 'With current market conditions and your budget, paying off the loan faster reduces total interest more than what you could earn through SIP investments.'
      };
    }
  };

  const guidance = generateGuidance();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Minimal Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Car Finance Planner</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Strategy Selector */}
          <div className="flex space-x-3">
            {(['aggressive', 'balanced', 'custom'] as StrategyType[]).map((strategy) => (
              <Button
                key={strategy}
                variant={selectedStrategy === strategy ? 'default' : 'outline'}
                onClick={() => setSelectedStrategy(strategy)}
                className="capitalize"
              >
                {strategy}
                {strategy === 'balanced' && results.balanced.netPosition > results.aggressive.netPosition && (
                  <Badge variant="secondary" className="ml-2">Best</Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <CalculatorCard
              title="Car Details"
              helpText="Enter your car purchase details and financing parameters"
            >
              <div className="space-y-4">
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
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Loan Principal:</span>
                    <span className="font-semibold text-blue-700">
                      {formatINR(loanPrincipal)}
                    </span>
                  </div>
                </div>
              </div>
            </CalculatorCard>

            <CalculatorCard
              title="Loan Parameters"
              helpText="Set your loan interest rate and tenure"
            >
              <div className="space-y-4">
                <SliderField
                  label="Interest Rate (p.a.)"
                  value={inputs.loanRate}
                  onChange={(value) => updateInput('loanRate', value)}
                  min={0.05}
                  max={0.20}
                  step={0.001}
                  format="percentage"
                />
                <SliderField
                  label="Tenure (months)"
                  value={inputs.tenureMonths}
                  onChange={(value) => updateInput('tenureMonths', value)}
                  min={12}
                  max={84}
                  step={1}
                />
              </div>
            </CalculatorCard>

            <CalculatorCard
              title="Budget & Investment"
              helpText="Set your monthly budget and expected SIP returns"
            >
              <div className="space-y-4">
                <SliderField
                  label="Monthly Budget"
                  value={inputs.monthlyBudget}
                  onChange={(value) => updateInput('monthlyBudget', value)}
                  min={10000}
                  max={100000}
                  step={1000}
                  format="currency"
                />
                <SliderField
                  label="SIP Return (p.a.)"
                  value={inputs.sipRate}
                  onChange={(value) => updateInput('sipRate', value)}
                  min={0.08}
                  max={0.20}
                  step={0.001}
                  format="percentage"
                />
                <SliderField
                  label="Analysis Horizon (months)"
                  value={inputs.horizonMonths}
                  onChange={(value) => updateInput('horizonMonths', value)}
                  min={12}
                  max={120}
                  step={1}
                />
              </div>
            </CalculatorCard>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Primary EMI Display */}
            <div className="text-center">
              <KPICard
                label="Your Monthly EMI"
                value={formatINR(selectedResult.emi)}
                description="Monthly payment"
                isPrimary={true}
                delay={0.1}
              />
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <KPICard
                label="Total Interest"
                value={formatINR(selectedResult.totalInterest)}
                description="Interest paid"
                trend={selectedResult.totalInterest < results.aggressive.totalInterest ? 'down' : 'up'}
                delay={0.2}
              />
              <KPICard
                label="SIP Final Value"
                value={formatINR(selectedResult.sipFinalValue)}
                description="Investment corpus"
                trend={selectedResult.sipFinalValue > results.aggressive.sipFinalValue ? 'up' : 'down'}
                delay={0.3}
              />
              <KPICard
                label="Net Advantage"
                value={formatINR(selectedResult.netPosition)}
                description="Overall benefit"
                trend={selectedResult.netPosition >= 0 ? 'up' : 'down'}
                delay={0.4}
              />
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <LoanSIPChart
                data={chartData}
                delay={0.5}
              />
            )}

            {/* Guidance Card */}
            <GuidanceCard
              recommendation={guidance.recommendation}
              title={guidance.title}
              value={guidance.value}
              description={guidance.description}
              details={guidance.details}
              delay={0.6}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
