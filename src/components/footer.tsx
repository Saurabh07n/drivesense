// src/components/footer.tsx
import Link from 'next/link';
import { Car, Calculator, BookOpen, Info, FileText, Shield } from 'lucide-react';

export function Footer() {
  const footerSections = [
    {
      title: 'Calculators',
      links: [
        { label: 'EMI Calculator', href: '/calculator/emi' },
        { label: 'Loan vs SIP', href: '/calculator/loan-vs-sip' },
        { label: 'Step-up SIP', href: '/scenarios/step-up' },
        { label: 'Parallel SIPs', href: '/scenarios/two-sip' },
      ]
    },
    {
      title: 'Learn',
      links: [
        { label: 'EMI Formula', href: '/learn/emi-formula' },
        { label: 'SIP Math', href: '/learn/sip-math' },
        { label: 'Strategy Guide', href: '/learn/strategy-guide' },
        { label: 'FAQs', href: '/learn/faq' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Contact', href: '/contact' },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">DriveSense</span>
            </div>
            <p className="text-gray-400 mb-4">
              Plan your car smartly: balance EMIs and investments with math.
            </p>
            <div className="text-sm text-gray-400">
              <p>© 2024 DriveSense. All rights reserved.</p>
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>
                DriveSense is a financial planning tool. All calculations are for educational purposes only.
                Please consult with a financial advisor before making investment decisions.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

