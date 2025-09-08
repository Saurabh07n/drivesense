// src/app/privacy/page.tsx
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Lock, Database } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - TorqWiser',
  description: 'TorqWiser privacy policy. Learn how we protect your data and maintain your privacy while using our financial calculators.',
  keywords: ['privacy policy', 'data protection', 'privacy first', 'secure calculator'],
};

export default function PrivacyPage() {
  const privacyFeatures = [
    {
      icon: Eye,
      title: 'No Data Collection',
      description: 'We do not collect, store, or transmit any of your personal or financial information.'
    },
    {
      icon: Lock,
      title: 'Local Processing',
      description: 'All calculations are performed locally in your browser using client-side JavaScript.'
    },
    {
      icon: Database,
      title: 'No Server Storage',
      description: 'Your data never leaves your device. We have no databases storing user information.'
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      description: 'Built with privacy-first principles from the ground up.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-600 rounded-full">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is our priority. Learn how TorqWiser protects your data 
            and maintains complete privacy in all our financial calculations.
          </p>
        </div>

        <div className="space-y-8">
          {/* Privacy Features */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Privacy-First Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {privacyFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <feature.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Data Collection */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Collection</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>We collect NO personal data.</strong> TorqWiser is designed to work entirely 
                  without collecting any personal or financial information from users.
                </p>
                <p>
                  All calculations are performed locally in your web browser using JavaScript. 
                  Your car price, loan details, and investment parameters never leave your device.
                </p>
                <p>
                  We do not use cookies, tracking pixels, or any other data collection mechanisms 
                  that could compromise your privacy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics and Tracking</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We may use basic web analytics (such as Google Analytics) to understand 
                  how our website is used, but this data is completely anonymous and cannot 
                  be linked to individual users.
                </p>
                <p>
                  Analytics data includes general information like page views, time spent on site, 
                  and browser type - but no personal or financial information.
                </p>
                <p>
                  You can opt out of analytics tracking by using browser extensions or 
                  disabling JavaScript if you prefer complete anonymity.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third Parties */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  TorqWiser may use third-party services for hosting and analytics, but these 
                  services do not have access to your personal or financial data.
                </p>
                <p>
                  Our hosting provider (Vercel) may collect basic server logs for security 
                  and performance purposes, but these logs do not contain your calculation data.
                </p>
                <p>
                  We do not share, sell, or rent any user data to third parties for any purpose.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Since we don&apos;t collect personal data, there&apos;s no personal information to access, 
                  modify, or delete. Your privacy is protected by design.
                </p>
                <p>
                  You have complete control over your data - it never leaves your device, 
                  so you can clear your browser data at any time to remove any locally stored information.
                </p>
                <p>
                  If you have any questions about our privacy practices, please contact us 
                  through our support channels.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We may update this privacy policy from time to time to reflect changes 
                  in our practices or legal requirements.
                </p>
                <p>
                  Any updates will be posted on this page with a new effective date. 
                  We encourage you to review this policy periodically.
                </p>
                <p>
                  <strong>Last updated:</strong> {new Date().toLocaleDateString()}
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
