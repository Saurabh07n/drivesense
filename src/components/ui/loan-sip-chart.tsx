// src/components/ui/loan-sip-chart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from './card';
import { formatINR } from '@/lib/finance';
import { ChartDataPoint } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LoanSIPChartProps {
  data: ChartDataPoint[];
  height?: number;
  className?: string;
  delay?: number;
}

export function LoanSIPChart({ 
  data, 
  height = 400, 
  className,
  delay = 0
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn("w-full border-0 shadow-sm", className)}>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="1 1" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                tickFormatter={formatXAxisLabel}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => formatINR(value)}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelFormatter={(value) => `Month ${value}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  padding: '12px'
                }}
                labelStyle={{ color: '#374151', fontWeight: '600' }}
              />
              <Line 
                type="monotone" 
                dataKey="loanBalance" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, fill: '#ef4444' }}
                animationDuration={1000}
              />
              <Line 
                type="monotone" 
                dataKey="sipValue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, fill: '#10b981' }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-6 flex justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Loan Balance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">SIP Value</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

