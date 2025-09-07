// src/components/hero-section.tsx
import { Button } from './ui/button';
import { Car, Calculator, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-600 rounded-full">
              <Car className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Car Loan Guider:
            <br />
            <span className="text-blue-600">EMI vs SIP</span>, the smart way
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find your best split. Own the car, grow your wealth. Compare aggressive vs balanced 
            strategies to maximize your financial potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <Link href="/calculator/loan-vs-sip">
                <Calculator className="mr-2 h-5 w-5" />
                Open Guider
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
              <Link href="/learn">
                Learn More
              </Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Wealth Creation</div>
                <div className="text-sm text-gray-600">Maximize returns</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Smart Calculations</div>
                <div className="text-sm text-gray-600">Accurate math</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Privacy First</div>
                <div className="text-sm text-gray-600">No data stored</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

