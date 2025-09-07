// src/app/about/page.tsx
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Target, Shield, Users } from 'lucide-react';

export const metadata = {
  title: 'About - DriveSense',
  description: 'Learn about DriveSense, our mission to help car buyers make smart financial decisions through EMI vs SIP analysis.',
  keywords: ['about drivesense', 'car finance calculator', 'financial planning tool', 'EMI calculator'],
};

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Smart Planning',
      description: 'We believe in data-driven financial decisions. Our calculators help you see beyond just EMI to understand the full picture of wealth creation.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All calculations run locally in your browser. We never store your personal or financial data on our servers.'
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Built for Indian car buyers with local context, currency formatting, and relevant financial scenarios.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <Car className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About DriveSense</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We&apos;re on a mission to help car buyers make smarter financial decisions
            by understanding the trade-offs between loan payments and investment opportunities.
          </p>
        </div>

        <div className="space-y-12">
          {/* Mission */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Most car buyers focus only on getting the lowest EMI, but they miss the bigger picture 
                of wealth creation. DriveSense helps you understand how different financing strategies 
                affect your long-term financial health.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We provide accurate, easy-to-use calculators that compare aggressive vs balanced 
                approaches, helping you find the optimal split between loan payments and SIP investments 
                under your monthly budget.
              </p>
            </CardContent>
          </Card>

          {/* Values */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <value.icon className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How DriveSense Works</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Input Your Details</h3>
                    <p className="text-gray-600 text-sm">Enter your car price, down payment, loan terms, and monthly budget.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Compare Strategies</h3>
                    <p className="text-gray-600 text-sm">See how aggressive vs balanced approaches affect your wealth creation.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Make Informed Decisions</h3>
                    <p className="text-gray-600 text-sm">Choose the strategy that aligns with your financial goals and risk tolerance.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Disclaimer</h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  DriveSense is an educational tool designed to help you understand financial concepts 
                  and compare different strategies. All calculations are for informational purposes only.
                </p>
                <p>
                  <strong>Please consult with a qualified financial advisor</strong> before making any 
                  investment or loan decisions. Past performance does not guarantee future results, 
                  and all investments carry risk.
                </p>
                <p>
                  We do not provide financial advice, and our calculators should not be considered 
                  as a substitute for professional financial planning.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
