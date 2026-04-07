<!--
Sync Impact Report
- Version change: 1.2.0 → 1.3.0
- Modified principles: Testing Strategy (added mandatory 100% test pass requirement)
- Added sections: Test Execution Requirements (5 mandatory rules)
- Removed sections: n/a
- Templates requiring updates:
  ⚠️ spec-template.md: Add "Test Results" section to track pass/fail/skipped counts
  ⚠️ tasks-template.md: Update to emphasize zero failures/skipped tests requirement
  ✅ plan-template.md: Constitution Check section aligned
- Follow-up TODOs: Update CI/CD pipeline to enforce test pass requirement; Add pre-commit hook for test execution
-->

# Пузаті суші (Puzaty Sushi Brovary) Constitution

## Core Principles

### I. Performance First

Every feature MUST maintain or improve Core Web Vitals (LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms). Images MUST be optimized and lazy-loaded. Code MUST be split by route. No render-blocking resources in critical path.

**Rationale**: Fast load times directly impact conversion rates and SEO rankings for local restaurant searches. Mobile users on 3G/4G are primary audience.

### II. Accessibility (WCAG 2.2 AA)

Semantic HTML is REQUIRED. Interactive elements MUST be keyboard navigable with visible focus indicators. ARIA labels MUST be present where needed. Color contrast MUST meet AA thresholds (4.5:1 for text). Form errors MUST be announced to screen readers.

**Rationale**: Inclusive design expands customer base and ensures legal compliance. Many users navigate via keyboard or assistive technology.

### III. SEO and Discoverability

Pages MUST include accurate meta tags (Open Graph, Twitter Cards), canonical URLs, and valid JSON-LD structured data (Restaurant, LocalBusiness schemas). Sitemap and robots.txt MUST be maintained. Content language is Ukrainian (uk-UA).

**Rationale**: Organic search is primary customer acquisition channel. "суші Бровари" and related keywords drive traffic.

### IV. Reliability and Error Handling

Application MUST render without uncaught exceptions. Network failures MUST provide clear user feedback with retry mechanisms. Form validation MUST happen client-side before submission. Order data MUST be preserved in sessionStorage during checkout to prevent loss.

**Rationale**: Any failure during order flow results in lost revenue. Users expect resilience and clear guidance when errors occur.

### V. Security and Privacy

No API keys or secrets in client code. External links MUST use `rel="noopener noreferrer"`. User input MUST be validated and sanitized. Google Forms integration MUST only collect delivery-necessary data (name, phone, address, order details).

**Rationale**: Protect customer data and maintain trust. Minimize attack surface and comply with privacy expectations.

### VI. Code Quality and Type Safety

TypeScript strict mode is REQUIRED. Avoid `any` type; use proper types or `unknown`. ESLint MUST pass before merge. Dead code and unused imports MUST be removed. Prefer shadcn/ui and Radix UI primitives over custom components.

**Rationale**: Type safety prevents runtime errors. Standardized components reduce bugs and maintenance burden.

### VII. Mobile-First Responsive Design

Layout MUST work on screens from 320px to 2560px. Touch targets MUST be ≥44px. Primary CTAs (order, add to cart) MUST be easily reachable on mobile. Tailwind CSS utilities and shadcn/ui patterns MUST be used for consistency.

**Rationale**: 70%+ of restaurant orders come from mobile devices. Thumb-friendly design improves conversion.

### VIII. Simplicity and Maintainability

Avoid premature abstraction. Components SHOULD be colocated with usage. State management SHOULD use React hooks (useState, useReducer) unless complexity demands more. Prefer inline Tailwind over CSS files. YAGNI (You Aren't Gonna Need It) principle applies.

**Rationale**: Small project scope demands lean, easy-to-understand code. Over-engineering increases onboarding friction and slows iteration.

## Performance Standards

- **Bundle Size**: Initial JS bundle ≤ 200KB gzipped
- **Lighthouse Score**: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95
- **Time to Interactive (TTI)**: ≤ 3.5s on mobile 3G
- **Image Optimization**: All images MUST use WebP/AVIF with fallbacks; responsive srcset required

## Development Workflow

### Code Review Requirements

- All PRs MUST include a "Constitution Check" comment mapping changes to affected principles or stating "No impact"
- Breaking changes to accessibility, SEO metadata, or order flow REQUIRE explicit approval from project owner
- Linter errors MUST be resolved before merge

### Testing Strategy

- **Automated tests MUST pass 100%** - No failed or skipped tests allowed in any spec implementation
- Manual testing of order flow (add to cart → checkout → form submission) REQUIRED before each release
- **Playwright visual verification REQUIRED** for all UI changes affecting layout, spacing, or responsive behavior
- Accessibility spot-checks using axe DevTools or Lighthouse RECOMMENDED
- Automated E2E tests are OPTIONAL (not mandatory for this project size)

#### Test Execution Requirements

**MANDATORY** for every spec implementation:
1. **All tests MUST pass** - 100% pass rate required
2. **Zero failed tests** - Any test failure must be fixed before completion
3. **Zero skipped tests** - Tests must not be skipped unless properly removed/commented with justification
4. **Test results MUST be documented** - Include pass/fail counts in implementation summary
5. **Run tests before marking spec complete** - `npm run test` must be executed and pass

### Quality Gates

- `npm run test` MUST pass with 100% pass rate (no failures, no skipped tests)
- `npm run lint` MUST pass
- No TypeScript errors (`tsc --noEmit`)
- Visual review on mobile (375px) and desktop (1280px)
- Cart state persistence across page refresh verified

### Playwright Visual Verification Requirements

**Mandatory for UI Changes**: All changes affecting layout, spacing, responsive behavior, or visual appearance MUST include Playwright visual verification.

#### Required Test Categories

1. **Spacing Validation**: Automated measurement of spacing between UI elements
2. **Responsive Behavior**: Verification of layout changes across screen sizes (320px, 375px, 768px, 1200px)
3. **Touch Target Compliance**: Validation of minimum 44px touch targets on mobile
4. **Visual Regression**: Screenshot comparison to prevent unintended visual changes
5. **Performance Impact**: Core Web Vitals measurement (LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms)

#### Test Implementation Requirements

- **Test Structure**: Organize tests by feature and screen size
- **Screenshot Baselines**: Capture before/after screenshots for visual comparison
- **Automated Validation**: Use bounding box measurements for precise spacing verification
- **Mobile Testing**: Include mobile device testing (Pixel 5, iPhone 12)
- **Accessibility Testing**: Verify WCAG 2.2 AA compliance through automated checks

#### Integration with Development Workflow

- **Pre-Implementation**: Capture baseline screenshots and measurements
- **During Implementation**: Run tests incrementally to guide development
- **Post-Implementation**: Validate all requirements met and no regressions introduced
- **PR Requirements**: Include Playwright test results in pull request descriptions

#### Test Maintenance

- **Screenshot Updates**: Update baseline screenshots when intentional design changes occur
- **Threshold Adjustments**: Refine measurement thresholds based on design system evolution
- **Continuous Integration**: Execute visual tests on every PR and main branch updates

## Deployment & Hosting

### Production Environment

**Platform**: GitHub Pages (static hosting)  
**Domain**: sushidom.kyiv.ua (custom domain via CNAME)  
**Build Output**: `/dist` directory generated by Vite  
**Deployment Method**: Static files pushed to `gh-pages` branch or main branch (depending on repository configuration)

### Build Process Requirements

All build-time transformations MUST produce static output compatible with GitHub Pages:

- **No server-side rendering**: GitHub Pages serves static files only; no Node.js runtime available
- **No server-side APIs**: All backend integrations (Google Forms) must be client-side or external services
- **Build plugins run locally/CI**: Vite plugins execute during `npm run build`, output is static HTML/CSS/JS
- **Asset optimization**: Images, fonts, and other assets must be optimized before deployment (build-time only)
- **No environment variables at runtime**: Configuration must be embedded during build or use client-safe values

### Deployment Constraints

- **Static HTML/CSS/JS only**: All content must be pre-rendered or client-side rendered (React SPA)
- **HTTPS enforced**: GitHub Pages provides automatic HTTPS; all links should use relative paths or HTTPS
- **Base path compatibility**: Site may be served from root (/) or subdirectory; use `<base>` tag or Vite `base` config if needed
- **No .htaccess or server config**: GitHub Pages doesn't support custom server configuration; routing must be client-side
- **Cache control**: GitHub Pages CDN handles caching; filenames with hashes for cache busting (handled by Vite)

### CI/CD Workflow (Recommended)

1. **Local/CI Build**: Run `npm run build` to generate `/dist` directory with all static assets
2. **Pre-deployment Validation**: 
   - Verify `dist/index.html` contains complete noscript content
   - Run Lighthouse audit on preview
   - Check all assets load correctly
3. **Deploy**: Push `dist/` contents to deployment branch (manual or via GitHub Actions)
4. **Post-deployment Check**: Verify site loads at production URL, test JavaScript-disabled fallback

### Build-Time Features

Features that generate or transform content at build time are ENCOURAGED (vs. runtime) because:
- Faster page loads (pre-computed content)
- Better SEO (fully rendered HTML for crawlers)
- No runtime dependencies on build tools
- Compatible with static hosting constraints

**Examples**: 
- Vite plugins that inject content into HTML (e.g., noscript generation)
- Asset optimization and minification
- Code splitting and tree shaking
- Sitemap generation

## Governance

### Amendment Procedure

1. Propose changes via PR with `constitution` label
2. Include rationale and version bump justification (see Versioning Policy)
3. At least one repository maintainer MUST approve
4. Breaking removals (e.g., removing a principle) require project owner sign-off
5. Upon merge, update version and "Last Amended" date below

### Versioning Policy (Semantic)

- **MAJOR** (X.0.0): Backward-incompatible principle removals or redefinitions (e.g., removing accessibility requirement)
- **MINOR** (1.X.0): New principle added or materially expanded guidance (e.g., adding analytics principle)
- **PATCH** (1.0.X): Clarifications, typo fixes, non-semantic refinements

### Compliance Review

- **Quarterly**: Run Lighthouse audit, validate Core Web Vitals in production, check structured data with Google Rich Results Test
- **On major features**: Accessibility review with keyboard navigation and screen reader spot-check
- **Violations**: File GitHub issue tagged `constitution-violation` with remediation plan

## Enforcement

This constitution supersedes all other development practices. PRs that violate principles WITHOUT documented exception will be blocked. When in doubt, ask in PR comments referencing specific principle section.

**Exceptions**: Time-boxed technical debt is permitted if:
1. Filed as GitHub issue with `tech-debt` label
2. Includes remediation timeline (≤ 2 sprints)
3. Approved by maintainer

---

**Version**: 1.3.0 | **Ratified**: 2025-10-10 | **Last Amended**: 2025-01-11  
**Change Log**: 
- v1.3.0 - Added "Test Execution Requirements" mandating 100% test pass rate with zero failures or skipped tests for every spec implementation
- v1.2.0 - Added "Playwright Visual Verification Requirements" section mandating automated visual testing for all UI changes
- v1.1.0 - Added "Deployment & Hosting" section documenting GitHub Pages static hosting requirements and build-time feature guidance
