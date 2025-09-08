// src/components/value-props.tsx
import { Card, CardContent } from './ui/card';
import { Target, PieChart, BarChart3, Lightbulb } from 'lucide-react';

export function ValueProps() {
  const valueProps = [
    {
      icon: Target,
      title: 'Strategic Planning',
      description: 'Compare aggressive vs balanced approaches to find your optimal EMI and SIP split under your monthly budget.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: PieChart,
      title: 'Advanced SIP Modeling',
      description: 'Model step-up SIPs, parallel SIPs, and phased investments to maximize your wealth creation potential.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: BarChart3,
      title: 'Rich Analytics',
      description: 'See EMI/interest, SIP corpus, extra returns, and net advantage with interactive charts and detailed breakdowns.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Lightbulb,
      title: 'Smart Insights',
      description: 'Get actionable recommendations based on your financial situation and investment goals.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose TorqWiser?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Most buyers focus only on the lowest EMI. We help you see the bigger picture 
            of wealth creation through smart financial planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((prop, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-full ${prop.bgColor} mb-4`}>
                  <prop.icon className={`h-8 w-8 ${prop.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {prop.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {prop.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

