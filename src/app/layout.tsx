// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'TorqWiser - Car Finance Guider | EMI vs SIP Calculator',
    template: '%s | TorqWiser'
  },
  description: 'Plan your car smartly: balance EMIs and investments with math. Compare aggressive vs balanced strategies for car financing in India.',
  keywords: ['car loan calculator', 'EMI calculator', 'SIP calculator', 'car finance', 'loan vs investment', 'India'],
  authors: [{ name: 'TorqWiser Team' }],
  creator: 'TorqWiser',
  publisher: 'TorqWiser',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://torqwiser.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://torqwiser.app',
    title: 'TorqWiser - Car Finance Guider',
    description: 'Plan your car smartly: balance EMIs and investments with math.',
    siteName: 'TorqWiser',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TorqWiser - Car Finance Guider',
    description: 'Plan your car smartly: balance EMIs and investments with math.',
    creator: '@torqwiser',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TorqWiser",
              "description": "Car finance guider that compares EMI strategies with SIP investments",
              "url": "https://torqwiser.app",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "author": {
                "@type": "Organization",
                "name": "TorqWiser Team"
              },
              "featureList": [
                "EMI Calculator",
                "SIP Calculator", 
                "Loan vs SIP Comparison",
                "Step-up SIP Modeling",
                "Parallel SIPs Calculator",
                "Strategy Analysis"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  )
}