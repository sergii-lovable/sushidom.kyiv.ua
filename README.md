# 🍣 СУШИDОМ - Kyiv

[![Deploy to GitHub Pages](https://github.com/sergii-lovable/sushidom.kyiv.ua/actions/workflows/deploy.yml/badge.svg)](https://github.com/sergii-lovable/sushidom.kyiv.ua/actions/workflows/deploy.yml)
[![Tests](https://img.shields.io/endpoint?url=https://sushidom.kyiv.ua/test-stats.json)](https://github.com/sergii-lovable/sushidom.kyiv.ua/actions/workflows/deploy.yml)
[![Playwright](https://img.shields.io/endpoint?url=https://sushidom.kyiv.ua/browser-stats.json)](https://playwright.dev/)

Modern sushi restaurant website with online ordering and delivery for Brovary, Ukraine.

**Live Site**: [sushidom.kyiv.ua](https://sushidom.kyiv.ua)

## 📋 About

Пузаті суші is a full-featured restaurant website offering:
- 🛒 Interactive menu with 12 categories and 45+ items
- 🛍️ Shopping cart with real-time updates
- 📦 Online ordering system via Google Forms integration
- 📱 Fully responsive design
- 🚀 Fast performance with Vite
- ♿ Accessibility features (ARIA labels, semantic HTML)
- 🔍 SEO optimized with structured data

### Contact Information

- 📍 **Address**: м. Київ, вул. Княжий затон 2/30
- 📞 **Phone**: +38 (098) 003-62-63
- 🕐 **Hours**: Пн-Нд: 10:00 - 21:00

## 🛠 Technologies

This project is built with modern web technologies:

- **Frontend Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM 6.30
- **State Management**: React hooks (useState)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Playwright (E2E + Visual Regression)
- **CI/CD**: GitHub Actions
- **Build Automation**: Custom Vite plugin for noscript generation

### 🔧 Automated Noscript Generation

This site includes an **automated build-time plugin** that generates complete noscript HTML content for search engines and no-JavaScript users:

#### Features
- ✅ **100% Auto-Synchronized**: Menu data is automatically extracted from `Menu.tsx` during every build
- ✅ **Zero Maintenance**: No manual updates needed when menu items change
- ✅ **SEO Optimized**: Complete semantic HTML with all 45+ menu items for search engine crawling
- ✅ **Type-Safe**: Uses TypeScript Compiler API to parse menu data
- ✅ **Fast**: Adds < 5 seconds to build time, generates ~13KB of HTML

#### How It Works
1. During `npm run build`, the Vite plugin (`vite-plugins/generate-noscript.ts`) executes
2. Plugin parses `src/components/Menu.tsx` using TypeScript AST
3. Extracts all menu items and generates semantic HTML with inline CSS
4. Injects generated content into `index.html` noscript section
5. Build output includes up-to-date menu for search engines

#### Data Source
- **Single Source of Truth**: `src/components/Menu.tsx` → `menuItems` array
- **Automatic Updates**: Change menu items in Menu.tsx, rebuild, and noscript HTML updates automatically
- **No Manual Sync Required**: Plugin guarantees 100% data parity between dynamic and static content

#### Troubleshooting
If the build fails with noscript generation errors:
- Ensure `src/components/Menu.tsx` has valid TypeScript syntax
- Verify `menuItems` array exists and contains valid MenuItemType objects
- Check that all items have required properties: id, name, description, price, category
- Generated HTML must be < 50KB (current: ~13KB)
- **Icons**: Lucide React
- **Notifications**: Sonner toasts

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Local Development

```sh
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sushidom.kyiv.ua.git

# Navigate to project directory
cd sushidom.kyiv.ua

# Install dependencies
npm install

# Start development server
# Default: http://localhost:8080 (will use 8081, 8082, etc. if 8080 is busy)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Development

### Working Locally

Work locally with your preferred IDE (VS Code, WebStorm, etc.). All changes pushed to the `main` branch will trigger automatic deployment via GitHub Actions.

### Available Scripts

```json
{
  "dev": "vite",                    // Start dev server
  "build": "vite build",            // Production build
  "build:dev": "vite build --mode development",
  "lint": "eslint .",              // Run linter
  "preview": "vite preview",        // Preview production build
  "test": "playwright test",        // Run all tests
  "test:ui": "playwright test --ui", // Run tests with UI
  "test:headed": "playwright test --headed", // Run tests in headed mode
  "test:debug": "playwright test --debug",   // Debug tests
  "deploy": "npm run build && cp CNAME dist/ && gh-pages -d dist"
}
```

## 🧪 Testing

This project includes comprehensive end-to-end testing with Playwright.

### Test Coverage

- **105 tests** across 5 browsers
- **Browsers tested**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Test types**: Functionality tests, visual regression tests, accessibility tests
- **Test areas**: Homepage, menu design, responsive layouts, touch targets, text readability

### Running Tests

```sh
# Run all tests
npm test

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug

# View last test report
npx playwright show-report
```

### Test Reports

- Console output shows real-time test results
- HTML reports are generated in `playwright-report/`
- Screenshots and videos captured on failure
- Test traces available for debugging

> **Note**: The test count and browser badges at the top of this README are automatically updated on every deployment. The badges dynamically fetch data from `https://sushidom.kyiv.ua/test-stats.json` and `https://sushidom.kyiv.ua/browser-stats.json`, which are generated during the CI/CD pipeline by analyzing test results and `playwright.config.ts` without creating any commits to this repository.

## 📁 Project Structure

```
sushidom.kyiv.ua/
├── src/
│   ├── components/
│   │   ├── Cart.tsx              # Shopping cart sidebar
│   │   ├── Footer.tsx            # Footer with contact info
│   │   ├── Header.tsx            # Sticky header with cart
│   │   ├── Hero.tsx              # Hero banner section
│   │   ├── Menu.tsx              # Menu with category tabs
│   │   ├── MenuItem.tsx          # Product card component
│   │   ├── OrderForm.tsx         # Order form dialog
│   │   └── ui/                   # shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx             # Main page
│   │   └── NotFound.tsx          # 404 page
│   ├── hooks/
│   │   └── use-toast.ts          # Toast notifications hook
│   ├── lib/
│   │   └── utils.ts              # Utility functions
│   ├── assets/                   # Images
│   ├── App.tsx                   # App router
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── dist/                         # Production build
└── index.html                    # HTML template
```

## 🎨 Features

### Shopping Cart
- Add/remove items
- Quantity adjustment
- Real-time total calculation
- Persistent during session

### Order System
- Google Forms integration
- Customer information collection
- Order details submission
- Success/error notifications

### SEO Optimization
- Meta tags (Open Graph, Twitter Cards)
- Structured data (Schema.org)
- Semantic HTML
- Geo-location tags
- Sitemap and robots.txt

### Responsive Design
- Mobile-first approach
- Tablet and desktop layouts
- Touch-friendly interfaces
- Smooth animations

## How can I deploy this project?

### GitHub Pages (sushidom.kyiv.ua)

This project is configured to deploy automatically to GitHub Pages at **sushidom.kyiv.ua**.

#### Initial Setup (One-time)

1. Go to your GitHub repository settings
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. Under **Custom domain**, enter `sushidom.kyiv.ua` (if not already set)
5. Wait for DNS check to complete

#### DNS Configuration

Make sure your DNS provider has the following records:

**A Records** (point to GitHub Pages servers):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME Record** (if using www subdomain):
```
www.sushidom.kyiv.ua CNAME <your-github-username>.github.io
```

#### Automatic Deployment

Every push to the `main` branch will automatically trigger a deployment via GitHub Actions. The workflow will:
1. Build the project
2. Run 105 Playwright tests across 5 browsers (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
3. Upload test reports as artifacts
4. Copy the CNAME file
5. Deploy to GitHub Pages (only if all tests pass)

**Quality Gate**: Deployment is blocked if any tests fail, ensuring only tested code reaches production.

You can also manually trigger a deployment from the **Actions** tab in GitHub. Test reports are available as downloadable artifacts in the workflow run details.
