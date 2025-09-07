// src/app/learn/page.tsx
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calculator, TrendingUp, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Learn - DriveSense',
  description: 'Learn about EMI calculations, SIP math, and financial planning strategies for car financing.',
  keywords: ['EMI formula', 'SIP math', 'financial planning', 'car loan education', 'investment strategies'],
};

export default function LearnPage() {
  const topics = [
    {
      icon: Calculator,
      title: 'EMI Formula Explained',
      description: 'Understand the mathematical formula behind EMI calculations and how it affects your loan payments.',
      href: '/learn/emi-formula',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: TrendingUp,
      title: 'SIP Mathematics',
      description: 'Learn how SIP investments work, compound interest, and future value calculations.',
      href: '/learn/sip-math',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: BookOpen,
      title: 'Strategy Guide',
      description: 'Compare aggressive vs balanced approaches to car financing and wealth creation.',
      href: '/learn/strategy-guide',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: HelpCircle,
      title: 'Frequently Asked Questions',
      description: 'Get answers to common questions about car loans, SIPs, and financial planning.',
      href: '/learn/faq',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Learn</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the fundamentals of car financing, EMI calculations, and SIP investments. 
            Make informed decisions with our comprehensive educational content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((topic, index) => (
            <Link key={index} href={topic.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${topic.bgColor}`}>
                      <topic.icon className={`h-8 w-8 ${topic.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {topic.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">EMI Optimization</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Higher down payment reduces EMI</li>
                  <li>• Longer tenure = lower EMI, higher interest</li>
                  <li>• Compare total cost, not just EMI</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">SIP Strategy</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Start early for compound benefits</li>
                  <li>• Step-up SIPs beat inflation</li>
                  <li>• Diversify across multiple SIPs</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Wealth Creation</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Balance loan payments with investments</li>
                  <li>• Consider opportunity cost of prepayment</li>
                  <li>• Review and adjust strategies regularly</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

