// src/app/calculator/loan-vs-sip/client.tsx
'use client';

import { useState, useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import { CalculatorCard } from '@/components/ui/calculator-card';
import { NumberField } from '@/components/ui/number-field';
import { SliderField } from '@/components/ui/slider-field';
import { KPICard } from '@/components/ui/kpi-card';
import { StrategyComparison } from '@/components/ui/strategy-comparison';
import { LoanSIPChart } from '@/components/ui/loan-sip-chart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calculateStrategies, formatINR } from '@/lib/finance';
import { CalculatorInputs, StrategyType, ChartDataPoint } from '@/lib/types';
import { Download, Share2, RotateCcw } from 'lucide-react';

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

  const exportResults = () => {
    const data = {
      inputs,
      results,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drivesense-calculator-results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DriveSense Calculator Results',
          text: `Check out my car financing strategy comparison on DriveSense!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loan vs SIP Calculator</h1>
              <p className="text-gray-600 mt-2">
                Compare aggressive vs balanced strategies to maximize your wealth creation
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={shareResults}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Strategy Selector */}
          <div className="flex space-x-4">
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
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <KPICard
                label="EMI"
                value={formatINR(selectedResult.emi)}
                description="Monthly payment"
              />
              <KPICard
                label="Total Interest"
                value={formatINR(selectedResult.totalInterest)}
                description="Interest paid"
                trend={selectedResult.totalInterest < results.aggressive.totalInterest ? 'down' : 'up'}
              />
              <KPICard
                label="SIP Final Value"
                value={formatINR(selectedResult.sipFinalValue)}
                description="Investment corpus"
                trend={selectedResult.sipFinalValue > results.aggressive.sipFinalValue ? 'up' : 'down'}
              />
              <KPICard
                label="Extra Return"
                value={formatINR(selectedResult.sipExtraReturn)}
                description="SIP gains"
                trend={selectedResult.sipExtraReturn > results.aggressive.sipExtraReturn ? 'up' : 'down'}
              />
              <KPICard
                label="Net Position"
                value={formatINR(selectedResult.netPosition)}
                description="Overall advantage"
                trend={selectedResult.netPosition >= 0 ? 'up' : 'down'}
              />
              <KPICard
                label="Available for SIP"
                value={formatINR(Math.max(0, inputs.monthlyBudget - selectedResult.emi))}
                description="Monthly surplus"
              />
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <LoanSIPChart
                data={chartData}
                title={`${selectedStrategy.charAt(0).toUpperCase() + selectedStrategy.slice(1)} Strategy Timeline`}
              />
            )}

            {/* Strategy Comparison */}
            <StrategyComparison results={results} />
          </div>
        </div>
      </main>
    </div>
  );
}
