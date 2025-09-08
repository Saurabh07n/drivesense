// src/components/ui/number-field.tsx
import { useState, useEffect } from 'react';
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
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Update input value when external value changes (but not when user is typing)
  useEffect(() => {
    if (!isFocused) {
      setInputValue(formatValue(value));
    }
  }, [value, isFocused]);

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

  const parseValue = (inputValue: string): number | null => {
    // Remove currency symbols, commas, and percentage signs
    const cleaned = inputValue
      .replace(/[₹,]/g, '')
      .replace(/%/g, '')
      .trim();
    
    if (cleaned === '') return null;
    
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return null;
    
    // For percentage format, convert from percentage to decimal
    const value = format === 'percentage' ? parsed / 100 : parsed;
    
    return Math.max(min, Math.min(max, value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    
    // Filter out non-numeric characters except decimal point, minus sign, and allowed symbols
    const filteredValue = newInputValue.replace(/[^0-9.-]/g, '');
    
    // Prevent multiple decimal points
    const parts = filteredValue.split('.');
    const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : filteredValue;
    
    // Prevent multiple minus signs and ensure minus is only at the beginning
    const minusCount = (finalValue.match(/-/g) || []).length;
    const cleanValue = minusCount > 1 ? finalValue.replace(/-/g, '').replace(/^/, '-') : finalValue;
    const finalCleanValue = cleanValue.startsWith('-') ? cleanValue : cleanValue.replace(/-/g, '');
    
    setInputValue(finalCleanValue);
    
    const parsedValue = parseValue(finalCleanValue);
    if (parsedValue !== null) {
      onChange(parsedValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number when focused for easier editing
    if (format === 'percentage') {
      setInputValue((value * 100).toString());
    } else {
      setInputValue(value.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format the value when losing focus
    const parsedValue = parseValue(inputValue);
    if (parsedValue !== null) {
      setInputValue(formatValue(parsedValue));
    } else {
      // If invalid input, revert to current value
      setInputValue(formatValue(value));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
    if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
      return;
    }
    
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88, 90].includes(e.keyCode)) {
      return;
    }
    
    // Allow: decimal point (but only one)
    if (e.key === '.' && !inputValue.includes('.')) {
      return;
    }
    
    // Allow: minus sign (but only at the beginning)
    if (e.key === '-' && inputValue.length === 0) {
      return;
    }
    
    // Allow: numbers
    if (e.key >= '0' && e.key <= '9') {
      return;
    }
    
    // Block everything else
    e.preventDefault();
  };

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
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
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

