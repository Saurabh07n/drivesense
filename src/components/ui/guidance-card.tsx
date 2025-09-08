// src/components/ui/guidance-card.tsx
import { Card, CardContent } from './card';
import { Button } from './button';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface GuidanceCardProps {
  recommendation: 'positive' | 'negative' | 'neutral';
  title: string;
  value: string;
  description: string;
  details?: string;
  className?: string;
  delay?: number;
}

const recommendationConfig = {
  positive: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    emoji: '✅'
  },
  negative: {
    icon: XCircle,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    emoji: '🚫'
  },
  neutral: {
    icon: Lightbulb,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    emoji: '💡'
  }
};

export function GuidanceCard({ 
  recommendation, 
  title, 
  value, 
  description, 
  details,
  className,
  delay = 0
}: GuidanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = recommendationConfig[recommendation];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn(
        "border-2 shadow-lg hover:shadow-xl transition-all duration-300",
        config.bgColor,
        config.borderColor,
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className={cn("p-2 rounded-full", config.bgColor)}>
              <Icon className={cn("h-6 w-6", config.iconColor)} />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{config.emoji}</span>
                <h3 className={cn("text-lg font-bold", config.textColor)}>
                  {title}
                </h3>
              </div>
              
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: delay + 0.2 }}
                className={cn("text-3xl font-bold", config.textColor)}
              >
                {value}
              </motion.div>
              
              <p className={cn("text-sm", config.textColor)}>
                {description}
              </p>
              
              {details && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn("text-xs p-0 h-auto", config.textColor)}
                  >
                    Why?
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3 ml-1" />
                    ) : (
                      <ChevronDown className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={cn("mt-3 p-3 rounded-lg text-xs", config.bgColor)}>
                          {details}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
