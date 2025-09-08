// src/components/hero-section.tsx
'use client';

import { Button } from './ui/button';
import { Car, TrendingUp, DollarSign, Clock, Wallet, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [showMath, setShowMath] = useState(false);
  
  const phrases = [
    "Save money",
    "Pay faster", 
    "Invest better"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-24 h-24 md:w-28 md:h-28 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 md:w-36 md:h-36 bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 md:w-20 md:h-20 bg-green-600 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.div 
              className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl relative"
              animate={{ 
                boxShadow: [
                  "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                  "0 25px 50px -12px rgba(99, 102, 241, 0.4)",
                  "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Car className="h-20 w-20 text-white" />
              </motion.div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl blur-xl opacity-30"></div>
            </motion.div>
          </motion.div>
          
          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"
          >
            TorqWiser
          </motion.h1>
          
          {/* Headline + Subhead */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-2xl md:text-3xl text-gray-900 font-semibold">
              Buy the car. Grow your wealth.
            </p>
            <p className="text-sm md:text-base text-gray-700">
              Lower EMI + invested difference → corpus beats extra interest.
            </p>
            
            {/* Rotating phrases */}
            <div className="h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhrase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg md:text-xl font-semibold text-blue-600"
                >
                  {phrases[currentPhrase]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Interactive Preview: Smart Split outcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl border border-white/20 max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-1 text-left">
                <div className="text-xs uppercase tracking-wide text-gray-500">EMI</div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">₹18,500</div>
              </div>
              <div className="md:col-span-1 text-left">
                <div className="text-xs uppercase tracking-wide text-gray-500">SIP / month</div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">₹6,500</div>
              </div>
              <div className="md:col-span-1 text-left">
                <div className="text-xs uppercase tracking-wide text-gray-500">Projected corpus</div>
                <div className="text-xl md:text-2xl font-bold text-green-600">₹2.8L</div>
              </div>
              <div className="md:col-span-1 text-left">
                <div className="text-xs uppercase tracking-wide text-gray-500">Advantage</div>
                <div className="text-xs md:text-sm font-semibold text-green-700">Saves ₹45K vs max EMI</div>
                <div className="text-[10px] md:text-xs text-gray-500">in 5 years</div>
              </div>
            </div>
          </motion.div>
          
          {/* Enhanced CTA Button + Micro explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="pt-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="text-lg md:text-xl px-6 py-4 md:px-12 md:py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
                <Link href="/calculator/loan-vs-sip" className="flex items-center space-x-3">
                  <span>🚀</span>
                  <span>Get my Smart Split</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span>→</span>
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
            <div className="mt-3 text-sm text-gray-600 flex items-center justify-center space-x-2">
              <span>Lower EMI + invested difference → corpus beats extra interest.</span>
              <button
                className="underline underline-offset-4 hover:text-gray-800"
                onClick={() => setShowMath(!showMath)}
              >
                Show me the math
              </button>
            </div>
            <AnimatePresence>
              {showMath && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-xs text-gray-600 max-w-2xl mx-auto"
                >
                  <div className="bg-white/70 border border-gray-200 rounded-lg p-3">
                    <div>Compare: extra loan interest vs SIP growth on the difference.</div>
                    <div className="mt-1 font-mono">
                      EMI↓ frees ₹Δ → invested monthly at r → corpus ≈ SIP(Δ, r, n) ≥ extra interest.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Smart calculations</span>
              </div>
            </motion.div>
          </motion.div>

          {/* 3-step pictogram */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="pt-4"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <span>Input budget</span>
              </div>
              <div className="hidden md:block h-px w-10 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                <span>Smart Split</span>
              </div>
              <div className="hidden md:block h-px w-10 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Wealth outcome</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

