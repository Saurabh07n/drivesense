// src/components/features.tsx
import { Card, CardContent } from './ui/card';
import { Calculator, TrendingUp, BarChart3, FileText, Smartphone, Shield } from 'lucide-react';
import Link from 'next/link';

export function Features() {
  const features = [
    {
      icon: Calculator,
      title: 'Advanced Calculators',
      description: 'EMI calculator, loan vs SIP comparison, step-up SIP modeling, and parallel SIP scenarios.',
      link: '/calculator/loan-vs-sip',
      linkText: 'Try Calculator'
    },
    {
      icon: TrendingUp,
      title: 'Strategy Analysis',
      description: 'Compare aggressive vs balanced approaches with detailed breakdowns and recommendations.',
      link: '/calculator/loan-vs-sip',
      linkText: 'View Strategies'
    },
    {
      icon: BarChart3,
      title: 'Interactive Charts',
      description: 'Visualize loan balance vs SIP growth over time with beautiful, responsive charts.',
      link: '/calculator/loan-vs-sip',
      linkText: 'See Charts'
    },
    {
      icon: FileText,
      title: 'Educational Content',
      description: 'Learn about EMI formulas, SIP math, and financial planning strategies.',
      link: '/learn',
      linkText: 'Read More'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Fully responsive design that works perfectly on all devices and screen sizes.',
      link: '/calculator/loan-vs-sip',
      linkText: 'Try Mobile'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All calculations run locally. No data is stored or transmitted to our servers.',
      link: '/privacy',
      linkText: 'Privacy Policy'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From basic EMI calculations to advanced wealth creation strategies, 
            DriveSense provides all the tools you need for smart car financing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <Link 
                      href={feature.link}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      {feature.linkText} →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

