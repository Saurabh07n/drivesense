// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'DriveSense - Car Finance Guider | EMI vs SIP Calculator',
    template: '%s | DriveSense'
  },
  description: 'Plan your car smartly: balance EMIs and investments with math. Compare aggressive vs balanced strategies for car financing in India.',
  keywords: ['car loan calculator', 'EMI calculator', 'SIP calculator', 'car finance', 'loan vs investment', 'India'],
  authors: [{ name: 'DriveSense Team' }],
  creator: 'DriveSense',
  publisher: 'DriveSense',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://drivesense.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://drivesense.app',
    title: 'DriveSense - Car Finance Guider',
    description: 'Plan your car smartly: balance EMIs and investments with math.',
    siteName: 'DriveSense',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DriveSense - Car Finance Guider',
    description: 'Plan your car smartly: balance EMIs and investments with math.',
    creator: '@drivesense',
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
              "name": "DriveSense",
              "description": "Car finance guider that compares EMI strategies with SIP investments",
              "url": "https://drivesense.app",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "author": {
                "@type": "Organization",
                "name": "DriveSense Team"
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