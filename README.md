# TorqWiser – Car Finance Guider

**Tagline:** *"Plan your car smartly: balance EMIs and investments with math."*

TorqWiser is a comprehensive car finance calculator that helps Indian car buyers make smarter financial decisions by comparing EMI strategies with SIP investments. Instead of just focusing on the lowest EMI, TorqWiser shows you the bigger picture of wealth creation through strategic financial planning.

## 🚀 Features

### Core Calculators
- **EMI Calculator** - Calculate car loan EMIs with detailed amortization schedules
- **Loan vs SIP Calculator** - Compare aggressive vs balanced strategies under your monthly budget
- **Step-up SIP Calculator** - Model phased SIP investments with increasing contributions
- **Parallel SIPs Calculator** - Calculate multiple independent SIP investments

### Key Capabilities
- **Strategy Comparison** - Compare aggressive (shorter tenure) vs balanced (longer tenure + SIP) approaches
- **Advanced SIP Modeling** - Step-up SIPs, parallel SIPs, and phased investments
- **Rich Analytics** - Interactive charts showing loan balance vs SIP growth over time
- **Export & Share** - Export results as JSON or share calculations
- **Mobile Optimized** - Fully responsive design for all devices

## 🛠️ Tech Stack

- **Next.js 14+** with App Router and TypeScript
- **Tailwind CSS** + **shadcn/ui** for beautiful, accessible UI
- **Recharts** for interactive data visualization
- **Framer Motion** for smooth micro-interactions
- **Zod** for input validation and type safety
- **Vitest** for unit testing
- **Playwright** for end-to-end testing

## 📊 Financial Calculations

All calculations are performed client-side using pure mathematical functions:

- **EMI Formula**: `E = P × r × (1+r)^n / ((1+r)^n - 1)`
- **SIP Future Value**: `FV = A × [((1+i)^n - 1) × (1+i)] / i`
- **Phased SIP**: Sequential phases with compound growth
- **Strategy Simulation**: Budget allocation between EMI and SIP

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd torqwiser

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage

# Linting
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── calculator/         # Calculator pages
│   ├── scenarios/          # Advanced scenario pages
│   ├── learn/             # Educational content
│   └── about/             # About and privacy pages
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Core utilities
│   ├── finance.ts        # Financial calculation functions
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── test/                 # Test setup and utilities
```

## 🧮 Usage Examples

### Basic EMI Calculation
```typescript
import { calculateEMI } from '@/lib/finance';

const emi = calculateEMI({
  principal: 500000,    // ₹5L loan
  annualRate: 0.083,    // 8.3% annual rate
  tenureMonths: 60      // 5 years
});
// Returns: ~₹10,200
```

### SIP Future Value
```typescript
import { futureValueSIP } from '@/lib/finance';

const fv = futureValueSIP(
  5000,    // ₹5k monthly
  0.12,    // 12% annual return
  60       // 5 years
);
// Returns: ~₹4.12L
```

### Strategy Comparison
```typescript
import { calculateStrategies } from '@/lib/finance';

const results = calculateStrategies({
  carPrice: 1000000,
  downPayment: 200000,
  loanRate: 0.083,
  tenureMonths: 60,
  monthlyBudget: 25000,
  sipRate: 0.12,
  horizonMonths: 60,
  strategy: 'balanced'
});
```

## 🔒 Privacy & Security

- **Privacy First**: All calculations run locally in your browser
- **No Data Collection**: We don't store any personal or financial information
- **No Server Storage**: Your data never leaves your device
- **Secure by Design**: Built with privacy-first principles

## 📈 SEO & Performance

- **Static Generation**: Pages are pre-rendered for optimal performance
- **SEO Optimized**: Meta tags, OpenGraph, and JSON-LD schema
- **Web Vitals**: Optimized for Core Web Vitals
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🧪 Testing

The project includes comprehensive unit tests for all financial calculations:

```bash
# Run all tests
npm run test:run

# Run tests with coverage
npm run test:coverage
```

Test coverage includes:
- EMI calculations with various scenarios
- SIP future value calculations
- Phased and parallel SIP modeling
- Strategy simulation edge cases
- Formatting and utility functions

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

TorqWiser is an educational tool designed to help you understand financial concepts and compare different strategies. All calculations are for informational purposes only.

**Please consult with a qualified financial advisor** before making any investment or loan decisions. Past performance does not guarantee future results, and all investments carry risk.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ in India**