// src/components/ui/strategy-comparison.tsx
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { formatINR, formatPercentage } from '@/lib/finance';
import { StrategyResult, StrategyType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StrategyComparisonProps {
  results: {
    aggressive: StrategyResult;
    balanced: StrategyResult;
    custom: StrategyResult;
  };
  className?: string;
}

const strategyLabels: Record<StrategyType, string> = {
  aggressive: 'Aggressive',
  balanced: 'Balanced',
  custom: 'Custom'
};

const strategyDescriptions: Record<StrategyType, string> = {
  aggressive: 'Shorter tenure, higher EMI',
  balanced: 'Longer tenure, invest difference',
  custom: 'Customized approach'
};

export function StrategyComparison({ results, className }: StrategyComparisonProps) {
  const strategies = Object.entries(results) as [StrategyType, StrategyResult][];
  
  const getBestValue = (key: keyof StrategyResult, higherIsBetter: boolean = false) => {
    const values = strategies.map(([, result]) => result[key] as number);
    const bestValue = higherIsBetter ? Math.max(...values) : Math.min(...values);
    return bestValue;
  };

  const isBestValue = (value: number, key: keyof StrategyResult, higherIsBetter: boolean = false) => {
    const bestValue = getBestValue(key, higherIsBetter);
    return Math.abs(value - bestValue) < 0.01;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Strategy Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Strategy</TableHead>
                <TableHead className="text-right">EMI</TableHead>
                <TableHead className="text-right">Total Interest</TableHead>
                <TableHead className="text-right">SIP Final Value</TableHead>
                <TableHead className="text-right">Extra Return</TableHead>
                <TableHead className="text-right">Net Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategies.map(([strategy, result]) => (
                <TableRow key={strategy}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{strategyLabels[strategy]}</span>
                        {isBestValue(result.netPosition, 'netPosition', true) && (
                          <Badge variant="default" className="text-xs">Best</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{strategyDescriptions[strategy]}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-medium",
                      isBestValue(result.emi, 'emi', false) && "text-green-600"
                    )}>
                      {formatINR(result.emi)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-medium",
                      isBestValue(result.totalInterest, 'totalInterest', false) && "text-green-600"
                    )}>
                      {formatINR(result.totalInterest)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-medium",
                      isBestValue(result.sipFinalValue, 'sipFinalValue', true) && "text-green-600"
                    )}>
                      {formatINR(result.sipFinalValue)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-medium",
                      isBestValue(result.sipExtraReturn, 'sipExtraReturn', true) && "text-green-600"
                    )}>
                      {formatINR(result.sipExtraReturn)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-bold",
                      result.netPosition >= 0 ? "text-green-600" : "text-red-600",
                      isBestValue(result.netPosition, 'netPosition', true) && "text-green-700"
                    )}>
                      {formatINR(result.netPosition)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Key Insights</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Net Position</strong> shows the advantage of SIP over loan interest</li>
            <li>• <strong>Aggressive</strong> strategy minimizes interest but reduces SIP potential</li>
            <li>• <strong>Balanced</strong> strategy maximizes wealth creation through SIP</li>
            <li>• Consider your risk tolerance and investment goals when choosing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

