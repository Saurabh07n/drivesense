// src/components/ui/animated-number.tsx
'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
}

export function AnimatedNumber({ 
  value, 
  duration = 1, 
  className,
  format = (val) => val.toLocaleString()
}: AnimatedNumberProps) {
  const spring = useSpring(0, { 
    stiffness: 100, 
    damping: 30,
    duration: duration * 1000
  });
  const display = useTransform(spring, (current) => format(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
}
