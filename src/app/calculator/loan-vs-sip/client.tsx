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
import { calculateCarFinanceStrategy, formatINR } from '@/lib/finance';
import { CalculatorInputs, StrategyType, ChartDataPoint } from '@/lib/types';
import { RotateCcw } from 'lucide-react';

export default function LoanVsSIPCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    carPrice: 1000000,
    downPayment: 200000,
    loanRate: 0.083,
    tenureMonths: 60, // This will be calculated based on strategy
    monthlyBudget: 25000,
    sipRate: 0.12,
    horizonMonths: 60,
    strategy: 'balanced'
  });

  const [selectedStrategy, setSelectedStrategy] = useState<'balanced' | 'aggressive-emi' | 'aggressive-sip'>('balanced');

  const loanPrincipal = Math.max(0, inputs.carPrice - inputs.downPayment);
  
  // Calculate optimal tenure based on selected strategy
  const calculateOptimalTenure = (strategy: string) => {
    const baseTenure = 60; // Default 5 years
    switch (strategy) {
      case 'aggressive-emi':
        return Math.max(24, Math.floor(baseTenure * 0.6)); // 3-4 years for aggressive EMI
      case 'aggressive-sip':
        return Math.min(84, Math.floor(baseTenure * 1.4)); // 6-7 years for aggressive SIP
      case 'balanced':
      default:
        return baseTenure; // 5 years for balanced
    }
  };

  // Calculate results using the new function
  const results = useMemo(() => {
    const tenure = calculateOptimalTenure(selectedStrategy);
    return calculateCarFinanceStrategy(
      inputs.carPrice,
      inputs.downPayment,
      inputs.loanRate,
      tenure,
      inputs.monthlyBudget,
      inputs.sipRate,
      inputs.horizonMonths
    );
  }, [inputs, selectedStrategy]);
  
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!results.timeline) return [];
    
    return results.timeline.map((point) => ({
      month: point.month,
      loanBalance: point.loanBalance,
      sipValue: point.sipValue,
      emi: results.emi,
      sipContribution: results.monthlySIP
    }));
  }, [results]);

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


  // Generate guidance based on selected strategy
  const generateGuidance = () => {
    const netPosition = results.netPosition;
    const tenure = calculateOptimalTenure(selectedStrategy);
    
    switch (selectedStrategy) {
      case 'balanced':
        return {
          recommendation: netPosition >= 0 ? 'positive' as const : 'negative' as const,
          title: 'Balanced Approach',
          value: `${tenure} months tenure`,
          description: netPosition >= 0 ? 'Optimal for wealth creation' : 'Consider adjusting parameters',
          details: netPosition >= 0 
            ? `With a ${tenure}-month tenure, you can balance loan payments with SIP investments, potentially earning ₹${Math.round(Math.abs(netPosition) / 1000)}K more over the loan period.`
            : `The current parameters suggest paying off the loan faster might be more beneficial. Consider increasing your monthly budget or adjusting the loan amount.`
        };
      
      case 'aggressive-emi':
        return {
          recommendation: 'negative' as const,
          title: 'Aggressive EMI Approach',
          value: `${tenure} months tenure`,
          description: 'Minimize total interest paid',
          details: `By choosing a shorter ${tenure}-month tenure, you'll pay off the loan faster and minimize total interest. This approach prioritizes debt freedom over investment returns.`
        };
      
      case 'aggressive-sip':
        return {
          recommendation: 'positive' as const,
          title: 'Aggressive SIP Approach',
          value: `${tenure} months tenure`,
          description: 'Maximize investment returns',
          details: `With a longer ${tenure}-month tenure, you can invest more in SIP while paying lower EMIs. This approach maximizes your wealth creation potential through compound returns.`
        };
      
      default:
        return {
          recommendation: 'positive' as const,
          title: 'Strategy Analysis',
          value: 'Review your options',
          description: 'Compare different approaches',
          details: 'Select a strategy above to see detailed insights and recommendations.'
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
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'balanced', label: 'Balanced Approach', description: '5-year tenure' },
              { key: 'aggressive-emi', label: 'Aggressive EMI', description: '3-4 year tenure' },
              { key: 'aggressive-sip', label: 'Aggressive SIP', description: '6-7 year tenure' }
            ].map((strategy) => (
              <Button
                key={strategy.key}
                variant={selectedStrategy === strategy.key ? 'default' : 'outline'}
                onClick={() => setSelectedStrategy(strategy.key as any)}
                className="capitalize flex flex-col items-center p-4 h-auto"
              >
                <span className="font-medium">{strategy.label}</span>
                <span className="text-xs opacity-75">{strategy.description}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <CalculatorCard
              title="Car Details"
              helpText="Enter your car purchase details and monthly budget"
            >
              <div className="space-y-4">
                {/* Monthly Budget - Most Important */}
                <SliderField
                  label="Monthly EMI Budget"
                  value={inputs.monthlyBudget}
                  onChange={(value) => updateInput('monthlyBudget', value)}
                  min={10000}
                  max={100000}
                  step={1000}
                  format="currency"
                />
                
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
              helpText="Set your loan interest rate"
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
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Recommended Tenure:</span>
                    <span className="font-semibold text-green-700">
                      {calculateOptimalTenure(selectedStrategy)} months
                    </span>
                  </div>
                </div>
              </div>
            </CalculatorCard>

            <CalculatorCard
              title="Investment Parameters"
              helpText="Set your expected SIP returns and analysis horizon"
            >
              <div className="space-y-4">
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
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Primary EMI Display */}
            <div className="text-center">
              <KPICard
                label="Your Monthly EMI"
                value={formatINR(results.emi)}
                description="Loan payment"
                isPrimary={true}
                delay={0.1}
              />
            </div>

            {/* Loan Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <KPICard
                label="Monthly EMI"
                value={formatINR(results.emi)}
                description="Loan payment"
                delay={0.2}
              />
              <KPICard
                label="Total Interest"
                value={formatINR(results.totalInterest)}
                description="Interest paid on loan"
                delay={0.3}
              />
              <KPICard
                label="Loan Tenure"
                value={`${calculateOptimalTenure(selectedStrategy)} months`}
                description="Recommended period"
                delay={0.4}
              />
            </div>

            {/* SIP Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <KPICard
                label="Monthly SIP"
                value={formatINR(results.monthlySIP)}
                description="Investment amount"
                delay={0.5}
              />
              <KPICard
                label="SIP Principal"
                value={formatINR(results.sipPrincipal)}
                description="Total invested"
                delay={0.6}
              />
              <KPICard
                label="SIP Returns"
                value={formatINR(results.sipReturns)}
                description="Investment gains"
                delay={0.7}
              />
            </div>

            {/* Final Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KPICard
                label="SIP Final Value"
                value={formatINR(results.sipFinalValue)}
                description="Total investment corpus"
                delay={0.8}
              />
              <KPICard
                label="Net Position"
                value={formatINR(results.netPosition)}
                description="SIP value - Total interest"
                trend={results.netPosition >= 0 ? 'up' : 'down'}
                delay={0.9}
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
