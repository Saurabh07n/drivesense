// src/components/ui/slider-field.tsx
import { Slider } from './slider';
import { Label } from './label';
import { NumberField } from './number-field';
import { formatINR, formatPercentage, formatNumber } from '@/lib/finance';
import { cn } from '@/lib/utils';

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: 'currency' | 'percentage' | 'number';
  description?: string;
  className?: string;
  showInput?: boolean;
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = 'number',
  description,
  className,
  showInput = true
}: SliderFieldProps) {
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return formatINR(val);
      case 'percentage':
        return formatPercentage(val);
      default:
        return formatNumber(val);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm font-semibold text-gray-700">
          {formatValue(value)}
        </span>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      
      {showInput && (
        <NumberField
          label=""
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          format={format}
          className="mt-2"
        />
      )}
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

