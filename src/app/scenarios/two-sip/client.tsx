// src/app/scenarios/two-sip/client.tsx
'use client';

import { useState, useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import { CalculatorCard } from '@/components/ui/calculator-card';
import { NumberField } from '@/components/ui/number-field';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/ui/kpi-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { futureValueMultipleSIPs, futureValuePhasedSIP, formatINR, formatPercentage } from '@/lib/finance';
import { SIPParams } from '@/lib/types';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

interface ParallelSIP {
  id: string;
  name: string;
  monthlyAmount: number;
  annualReturnRate: number;
  months: number;
  startDelay: number; // months to wait before starting this SIP
}

export default function ParallelSIPCalculator() {
  const [sips, setSips] = useState<ParallelSIP[]>([
    {
      id: '1',
      name: 'SIP 1',
      monthlyAmount: 5000,
      annualReturnRate: 0.12,
      months: 60,
      startDelay: 0
    },
    {
      id: '2',
      name: 'SIP 2',
      monthlyAmount: 3000,
      annualReturnRate: 0.10,
      months: 36,
      startDelay: 12
    }
  ]);

  const sipParamsArray: SIPParams[] = useMemo(() => 
    sips.map(sip => ({
      annualReturnRate: sip.annualReturnRate,
      phases: [
        ...(sip.startDelay > 0 ? [{ monthlyAmount: 0, months: sip.startDelay }] : []),
        { monthlyAmount: sip.monthlyAmount, months: sip.months }
      ]
    })), [sips]
  );

  const combinedResult = useMemo(() => futureValueMultipleSIPs(sipParamsArray), [sipParamsArray]);
  
  const individualResults = useMemo(() => 
    sipParamsArray.map(params => futureValuePhasedSIP(params)), [sipParamsArray]
  );

  const addSIP = () => {
    const newId = (sips.length + 1).toString();
    setSips(prev => [...prev, {
      id: newId,
      name: `SIP ${newId}`,
      monthlyAmount: 5000,
      annualReturnRate: 0.12,
      months: 36,
      startDelay: 0
    }]);
  };

  const removeSIP = (id: string) => {
    if (sips.length > 1) {
      setSips(prev => prev.filter(sip => sip.id !== id));
    }
  };

  const updateSIP = (id: string, field: keyof ParallelSIP, value: string | number) => {
    setSips(prev => prev.map(sip => 
      sip.id === id ? { ...sip, [field]: value } : sip
    ));
  };

  const resetToDefaults = () => {
    setSips([
      {
        id: '1',
        name: 'SIP 1',
        monthlyAmount: 5000,
        annualReturnRate: 0.12,
        months: 60,
        startDelay: 0
      },
      {
        id: '2',
        name: 'SIP 2',
        monthlyAmount: 3000,
        annualReturnRate: 0.10,
        months: 36,
        startDelay: 12
      }
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
              <h1 className="text-3xl font-bold text-gray-900">Parallel SIPs Calculator</h1>
              <p className="text-gray-600 mt-2">
                Model multiple independent SIP investments running simultaneously
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
              title="Parallel SIPs"
              helpText="Configure multiple SIPs with different parameters and start times"
            >
              <div className="space-y-4">
                {sips.map((sip, index) => (
                  <div key={sip.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{sip.name}</h4>
                      {sips.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSIP(sip.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">SIP Name</label>
                        <input
                          type="text"
                          value={sip.name}
                          onChange={(e) => updateSIP(sip.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <NumberField
                        label="Monthly Amount"
                        value={sip.monthlyAmount}
                        onChange={(value) => updateSIP(sip.id, 'monthlyAmount', value)}
                        format="currency"
                        min={1000}
                        max={100000}
                      />
                      <NumberField
                        label="Expected Return (p.a.)"
                        value={sip.annualReturnRate}
                        onChange={(value) => updateSIP(sip.id, 'annualReturnRate', value)}
                        format="percentage"
                        min={0.05}
                        max={0.25}
                        step={0.001}
                      />
                      <NumberField
                        label="Duration (months)"
                        value={sip.months}
                        onChange={(value) => updateSIP(sip.id, 'months', value)}
                        min={1}
                        max={120}
                      />
                      <NumberField
                        label="Start Delay (months)"
                        value={sip.startDelay}
                        onChange={(value) => updateSIP(sip.id, 'startDelay', value)}
                        min={0}
                        max={60}
                        description="Months to wait before starting this SIP"
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addSIP}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add SIP
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
                value={formatINR(combinedResult.principal)}
                description="Total invested across all SIPs"
              />
              <KPICard
                label="Combined FV"
                value={formatINR(combinedResult.fv)}
                description="Total final value"
              />
              <KPICard
                label="Total Returns"
                value={formatINR(combinedResult.fv - combinedResult.principal)}
                description="Combined gains"
              />
              <KPICard
                label="Number of SIPs"
                value={sips.length.toString()}
                description="Active SIPs"
              />
            </div>

            {/* Individual SIP Results */}
            <CalculatorCard
              title="Individual SIP Results"
              helpText="Breakdown of each SIP's performance"
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SIP</TableHead>
                      <TableHead className="text-right">Monthly Amount</TableHead>
                      <TableHead className="text-right">Return Rate</TableHead>
                      <TableHead className="text-right">Duration</TableHead>
                      <TableHead className="text-right">Start Delay</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Final Value</TableHead>
                      <TableHead className="text-right">Returns</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sips.map((sip, index) => {
                      const result = individualResults[index];
                      return (
                        <TableRow key={sip.id}>
                          <TableCell className="font-medium">{sip.name}</TableCell>
                          <TableCell className="text-right">{formatINR(sip.monthlyAmount)}</TableCell>
                          <TableCell className="text-right">{formatPercentage(sip.annualReturnRate)}</TableCell>
                          <TableCell className="text-right">{sip.months} months</TableCell>
                          <TableCell className="text-right">{sip.startDelay} months</TableCell>
                          <TableCell className="text-right">{formatINR(result.principal)}</TableCell>
                          <TableCell className="text-right">{formatINR(result.fv)}</TableCell>
                          <TableCell className="text-right">{formatINR(result.fv - result.principal)}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">{formatINR(combinedResult.principal)}</TableCell>
                      <TableCell className="text-right">{formatINR(combinedResult.fv)}</TableCell>
                      <TableCell className="text-right">{formatINR(combinedResult.fv - combinedResult.principal)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CalculatorCard>

            {/* Portfolio Analysis */}
            <CalculatorCard
              title="Portfolio Analysis"
              helpText="Analysis of your parallel SIP portfolio"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">Diversification Benefits</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>• Multiple return rates reduce concentration risk</p>
                    <p>• Staggered start times provide liquidity flexibility</p>
                    <p>• Different durations create natural rebalancing</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3">Key Insights</h4>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>• Total monthly commitment: {formatINR(sips.reduce((sum, sip) => sum + sip.monthlyAmount, 0))}</p>
                    <p>• Average return rate: {formatPercentage(sips.reduce((sum, sip) => sum + sip.annualReturnRate, 0) / sips.length)}</p>
                    <p>• Portfolio spans {Math.max(...sips.map(sip => sip.startDelay + sip.months))} months</p>
                  </div>
                </div>
              </div>
            </CalculatorCard>
          </div>
        </div>
      </main>
    </div>
  );
}
