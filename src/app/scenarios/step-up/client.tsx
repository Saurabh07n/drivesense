// src/app/scenarios/step-up/client.tsx
'use client';

import { useState, useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import { CalculatorCard } from '@/components/ui/calculator-card';
import { NumberField } from '@/components/ui/number-field';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/ui/kpi-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { futureValuePhasedSIP, futureValueSIP, formatINR, formatPercentage } from '@/lib/finance';
import { SIPParams, SIPPhase } from '@/lib/types';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

export default function StepUpSIPCalculator() {
  const [annualReturnRate, setAnnualReturnRate] = useState(0.12);
  const [phases, setPhases] = useState<SIPPhase[]>([
    { monthlyAmount: 5000, months: 36 },
    { monthlyAmount: 10000, months: 24 }
  ]);

  const sipParams: SIPParams = {
    annualReturnRate,
    phases
  };

  const phasedResult = useMemo(() => futureValuePhasedSIP(sipParams), [sipParams]);
  
  // Calculate equivalent constant SIP for comparison
  const totalMonths = phases.reduce((sum, phase) => sum + phase.months, 0);
  const averageMonthlyAmount = phases.reduce((sum, phase) => sum + (phase.monthlyAmount * phase.months), 0) / totalMonths;
  const constantSIPResult = useMemo(() => 
    futureValueSIP(averageMonthlyAmount, annualReturnRate, totalMonths), 
    [averageMonthlyAmount, annualReturnRate, totalMonths]
  );

  const addPhase = () => {
    setPhases(prev => [...prev, { monthlyAmount: 5000, months: 12 }]);
  };

  const removePhase = (index: number) => {
    setPhases(prev => prev.filter((_, i) => i !== index));
  };

  const updatePhase = (index: number, field: keyof SIPPhase, value: number) => {
    setPhases(prev => prev.map((phase, i) => 
      i === index ? { ...phase, [field]: value } : phase
    ));
  };

  const resetToDefaults = () => {
    setAnnualReturnRate(0.12);
    setPhases([
      { monthlyAmount: 5000, months: 36 },
      { monthlyAmount: 10000, months: 24 }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Step-up SIP Calculator</h1>
              <p className="text-gray-600 mt-2">
                Model phased SIP investments with increasing contributions over time
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <CalculatorCard
              title="SIP Parameters"
              helpText="Set your expected annual return rate"
            >
              <NumberField
                label="Expected Return (p.a.)"
                value={annualReturnRate}
                onChange={setAnnualReturnRate}
                format="percentage"
                min={0.05}
                max={0.25}
                step={0.001}
              />
            </CalculatorCard>

            <CalculatorCard
              title="SIP Phases"
              helpText="Define your step-up SIP phases with different amounts and durations"
            >
              <div className="space-y-4">
                {phases.map((phase, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Phase {index + 1}</h4>
                      {phases.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhase(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <NumberField
                        label="Monthly Amount"
                        value={phase.monthlyAmount}
                        onChange={(value) => updatePhase(index, 'monthlyAmount', value)}
                        format="currency"
                        min={1000}
                        max={100000}
                      />
                      <NumberField
                        label="Duration (months)"
                        value={phase.months}
                        onChange={(value) => updatePhase(index, 'months', value)}
                        min={1}
                        max={120}
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addPhase}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Phase
                </Button>
              </div>
            </CalculatorCard>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard
                label="Total Principal"
                value={formatINR(phasedResult.principal)}
                description="Total invested"
              />
              <KPICard
                label="Final Value"
                value={formatINR(phasedResult.fv)}
                description="Step-up SIP FV"
              />
              <KPICard
                label="Extra Return"
                value={formatINR(phasedResult.fv - phasedResult.principal)}
                description="Gains from investment"
              />
              <KPICard
                label="Total Duration"
                value={`${totalMonths} months`}
                description="Investment period"
              />
            </div>

            {/* Comparison with Constant SIP */}
            <CalculatorCard
              title="Step-up vs Constant SIP Comparison"
              helpText="Compare your step-up SIP with an equivalent constant SIP"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">Step-up SIP</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Principal:</span>
                      <span className="font-medium">{formatINR(phasedResult.principal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Final Value:</span>
                      <span className="font-medium">{formatINR(phasedResult.fv)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Returns:</span>
                      <span className="font-medium">{formatINR(phasedResult.fv - phasedResult.principal)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3">Constant SIP</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Monthly Amount:</span>
                      <span className="font-medium">{formatINR(averageMonthlyAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Final Value:</span>
                      <span className="font-medium">{formatINR(constantSIPResult)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Returns:</span>
                      <span className="font-medium">{formatINR(constantSIPResult - (averageMonthlyAmount * totalMonths))}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Advantage Analysis</h4>
                <p className="text-sm text-yellow-800">
                  {phasedResult.fv > constantSIPResult
                    ? `Step-up SIP generates ${formatINR(phasedResult.fv - constantSIPResult)} more wealth than constant SIP.`
                    : `Constant SIP generates ${formatINR(constantSIPResult - phasedResult.fv)} more wealth than step-up SIP.`
                  }
                </p>
              </div>
            </CalculatorCard>

            {/* Phase Breakdown */}
            <CalculatorCard
              title="Phase Breakdown"
              helpText="Detailed breakdown of each SIP phase"
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Phase</TableHead>
                      <TableHead className="text-right">Monthly Amount</TableHead>
                      <TableHead className="text-right">Duration</TableHead>
                      <TableHead className="text-right">Total Invested</TableHead>
                      <TableHead className="text-right">Phase FV</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {phases.map((phase, index) => {
                      const phaseFV = futureValueSIP(phase.monthlyAmount, annualReturnRate, phase.months);
                      const totalInvested = phase.monthlyAmount * phase.months;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">Phase {index + 1}</TableCell>
                          <TableCell className="text-right">{formatINR(phase.monthlyAmount)}</TableCell>
                          <TableCell className="text-right">{phase.months} months</TableCell>
                          <TableCell className="text-right">{formatINR(totalInvested)}</TableCell>
                          <TableCell className="text-right">{formatINR(phaseFV)}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">{totalMonths} months</TableCell>
                      <TableCell className="text-right">{formatINR(phasedResult.principal)}</TableCell>
                      <TableCell className="text-right">{formatINR(phasedResult.fv)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CalculatorCard>
          </div>
        </div>
      </main>
    </div>
  );
}
