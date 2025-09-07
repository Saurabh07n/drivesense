// src/components/ui/loan-sip-chart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { formatINR } from '@/lib/finance';
import { ChartDataPoint } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LoanSIPChartProps {
  data: ChartDataPoint[];
  height?: number;
  className?: string;
  title?: string;
}

export function LoanSIPChart({ 
  data, 
  height = 400, 
  className,
  title = "Loan Balance vs SIP Value Over Time"
}: LoanSIPChartProps) {
  const formatTooltipValue = (value: number, name: string) => {
    return [formatINR(value), name];
  };

  const formatXAxisLabel = (value: number) => {
    const years = Math.floor(value / 12);
    const months = value % 12;
    if (years > 0) {
      return months > 0 ? `${years}y ${months}m` : `${years}y`;
    }
    return `${months}m`;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tickFormatter={formatXAxisLabel}
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => formatINR(value)}
              stroke="#666"
              fontSize={12}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelFormatter={(value) => `Month ${value}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="loanBalance" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Loan Balance"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="sipValue" 
              stroke="#10b981" 
              strokeWidth={2}
              name="SIP Value"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Loan Balance (decreasing)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">SIP Value (growing)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

