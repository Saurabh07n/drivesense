// src/components/ui/kpi-card.tsx
import { Card } from './card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface KPICardProps {
  label: string;
  value: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  isPrimary?: boolean;
  delay?: number;
}

export function KPICard({ 
  label, 
  value, 
  description, 
  trend, 
  trendValue, 
  className,
  isPrimary = false,
  delay = 0
}: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn(
        "p-6 border-0 shadow-sm hover:shadow-md transition-all duration-300",
        isPrimary ? "bg-blue-50 border-blue-200" : "bg-white",
        className
      )}>
        <div className="text-center space-y-3">
          <p className={cn(
            "text-sm font-medium",
            isPrimary ? "text-blue-700" : "text-gray-600"
          )}>
            {label}
          </p>
          <motion.p 
            className={cn(
              "font-bold",
              isPrimary ? "text-3xl md:text-4xl text-blue-900" : "text-2xl md:text-3xl text-gray-900"
            )}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center justify-center space-x-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

