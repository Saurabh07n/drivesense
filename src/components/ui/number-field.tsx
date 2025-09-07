// src/components/ui/number-field.tsx
import { Input } from './input';
import { Label } from './label';
import { formatINR, formatPercentage, formatNumber } from '@/lib/finance';
import { cn } from '@/lib/utils';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  format?: 'currency' | 'percentage' | 'number';
  className?: string;
  placeholder?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  prefix,
  suffix,
  description,
  format = 'number',
  className,
  placeholder
}: NumberFieldProps) {
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

  const parseValue = (inputValue: string): number => {
    // Remove currency symbols, commas, and percentage signs
    const cleaned = inputValue
      .replace(/[₹,]/g, '')
      .replace(/%/g, '')
      .trim();
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.max(min, Math.min(max, parsed));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseValue(e.target.value);
    onChange(newValue);
  };

  const displayValue = format === 'percentage' ? (value * 100).toFixed(1) : value.toString();

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {prefix}
          </span>
        )}
        <Input
          id={label}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={cn(
            prefix && "pl-8",
            suffix && "pr-8"
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

