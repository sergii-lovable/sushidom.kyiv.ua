# Tasks: Up-to-Date Search Engine Fallback

**Input**: Design documents from `/specs/002-create-up-to/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are NOT explicitly requested in the feature specification. Manual validation using quickstart.md guide is sufficient.

**Organization**: All user stories share the same core implementation (Vite plugin). Tasks are organized by implementation phase, with dedicated validation checkpoints for each user story's acceptance criteria.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Shared (affects all stories) or specific story validation
- Include exact file paths in descriptions

## Path Conventions
- Repository root: `/Users/sergilliukhin/GitHub/sushidom.kyiv.ua/`
- Source files: `src/`
- Build plugins: `vite-plugins/`
- Vite config: `vite.config.ts`
- HTML template: `index.html`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure

- [x] T001 Create `vite-plugins/` directory at repository root for custom Vite plugins
- [x] T002 Clean up `index.html` noscript section:
  - Remove all existing static menu content (old manual fallback)
  - Add placeholder comment `<!-- NOSCRIPT_MENU_PLACEHOLDER -->` to mark plugin injection point
  - Add clarifying comment: `<!-- Content auto-generated during build by vite-plugins/generate-noscript.ts -->`
  - Keep only the noscript tags and placeholder for the build plugin to populate

**Checkpoint**: ✅ Directory structure ready for plugin development

---

## Phase 2: Foundational (Core Plugin Implementation)

**Purpose**: Build the automated noscript generation plugin that all user stories depend on

**⚠️ CRITICAL**: This phase must be complete before ANY user story validation can succeed

### Core Plugin Development

- [x] T003 [Shared] Create `vite-plugins/generate-noscript.ts` - Empty plugin skeleton with Vite Plugin interface
  ```typescript
  // Export plugin factory function returning Vite Plugin object
  export default function generateNoscriptPlugin(): Plugin {
    return {
      name: 'generate-noscript',
      enforce: 'pre',
      transformIndexHtml: { ... }
    }
  }
  ```

- [x] T004 [Shared] Implement TypeScript AST parsing function `parseMenuItems()` in `vite-plugins/generate-noscript.ts`
  - Use `ts.createSourceFile()` to parse `src/components/Menu.tsx`
  - Walk AST with `ts.forEachChild()` to find `menuItems` variable declaration
  - Extract array literal and return parsed MenuItemType[] objects
  - Handle parsing errors gracefully with descriptive error messages

- [x] T005 [Shared] Implement category mapping and grouping function `groupByCategory()` in `vite-plugins/generate-noscript.ts`
  - Group MenuItemType[] by category property
  - Map internal category IDs to Ukrainian display names (per data-model.md):
    - rolls → "Роли"
    - sets → "Сети"  
    - nigiri → "Запечені"
    - salat → "Салат"
    - sashimi → "Сашимі"
    - nigiri-sushi → "Нігірі"
    - gunkan → "Гункани"
    - soup → "Супи"
    - drinks → "Напої"
  - Filter out empty categories (0 items)
  - Return Map<string, MenuItemType[]> ordered by importance

- [x] T006 [Shared] Implement HTML generation function `generateNoscriptHTML()` in `vite-plugins/generate-noscript.ts`
  - Create header section with site name and tagline
  - For each category: generate `<article><h3>Category</h3><ul>...</ul></article>`
  - For each menu item: generate `<li><strong>Name</strong> - Description - Price грн</li>`
  - Add contact section with phone, address, operating hours
  - Add footer with copyright
  - Apply inline CSS styles (per research.md):
    - header/footer: `padding: 20px; background: #1a1a1a; color: white;`
    - main: `padding: 20px; max-width: 1200px; margin: 0 auto;`
    - h2: `font-size: 1.8em; margin: 24px 0 16px;`
    - h3: `font-size: 1.3em; margin: 20px 0 12px; color: #333;`
    - li: `margin-bottom: 8px; line-height: 1.6;`
  - Properly encode Ukrainian characters and special chars (HTML entity encoding)

- [x] T007 [Shared] Implement HTML validation function `validateHTMLSize()` in `vite-plugins/generate-noscript.ts`
  - Check generated HTML size < 50KB (per FR and SC-010)
  - Verify HTML is well-formed (balanced tags, proper nesting)
  - Throw build error if validation fails with specific error message

- [x] T008 [Shared] Implement `transformIndexHtml` hook in `vite-plugins/generate-noscript.ts`
  - Read current HTML content
  - Call `parseMenuItems('src/components/Menu.tsx')`
  - Call `groupByCategory(menuItems)`
  - Call `generateNoscriptHTML(groupedItems)`
  - Call `validateHTMLSize(html)`
  - Replace `<!-- NOSCRIPT_MENU_PLACEHOLDER -->` with generated HTML
  - Return transformed HTML string

- [x] T009 [Shared] Add error handling and build failure logic to plugin in `vite-plugins/generate-noscript.ts`
  - Wrap all operations in try-catch
  - Throw build errors for:
    - Menu.tsx file not found
    - Parse errors in Menu.tsx
    - menuItems array not found
    - Missing required properties in menu items
    - HTML size > 50KB
    - Malformed HTML output
  - Include helpful error messages with context

### Plugin Integration

- [x] T010 [Shared] Register plugin in `vite.config.ts`
  - Import `generateNoscriptPlugin` from `./vite-plugins/generate-noscript`
  - Add to plugins array BEFORE other HTML transforms: `generateNoscriptPlugin()`
  - Verify plugin is called during build

- [x] T011 [Shared] Run production build and verify plugin executes successfully
  - Execute `npm run build` or `bun run build`
  - Check console output for plugin execution
  - Verify build completes without errors
  - Check `dist/index.html` contains generated noscript content

**Checkpoint**: ✅ Plugin successfully generates noscript HTML during build. Ready for user story validation.

---

## Phase 3: User Story 1 Validation - Search Engine Crawls Complete Menu (Priority: P1) 🎯 MVP

**Goal**: Verify search engine bots can crawl and index complete menu with accurate data

**Independent Test**: Disable JavaScript, load homepage, verify all 45 menu items visible with accurate names/descriptions/prices matching Menu.tsx

### Validation Tasks (per quickstart.md Step 1)

- [x] T012 [US1] Verify noscript content displays without JavaScript
  - Open Chrome DevTools, disable JavaScript
  - Load `http://localhost:5173` (dev) or production URL
  - Confirm header with "Пузаті суші - Доставка суші у Броварах" visible
  - Confirm "Наше меню" section visible
  - Confirm all 10 category sections present (Роли, Сети, Запечені, Салат, Сашимі, Нігірі, Гункани, Супи, Напої)
  - Confirm each category contains menu items with name, description, price format "XXX грн"
  - Confirm contact section with phone (+38 077 172-07-07), address, hours visible
  - Confirm footer with copyright present

- [x] T013 [US1] Verify mobile responsive layout (320px viewport)
  - With JavaScript disabled, toggle device toolbar to iPhone SE (375px)
  - Verify no horizontal scrolling required
  - Verify text is readable without zooming
  - Verify spacing and layout look reasonable

- [x] T014 [US1] Verify content parity with Menu.tsx (per quickstart.md Step 5)
  - Count `<li>` elements in noscript HTML: should equal 45
  - Spot-check 5 random items:
    - Compare names in Menu.tsx vs noscript HTML (must match exactly)
    - Compare descriptions in Menu.tsx vs noscript HTML (must match exactly)
    - Compare prices: e.g., 219 in Menu.tsx → "219 грн" in HTML
  - Verify category item counts:
    - Роли: 15 items
    - Сети: 10 items
    - Запечені: 3 items
    - Салат: 1 item
    - Сашимі: 3 items
    - Нігірі: 4 items
    - Гункани: 3 items
    - Супи: 3 items
    - Напої: 3 items

- [x] T015 [US1] Test menu modification automation (per quickstart.md Step 0.6)
  - Edit `src/components/Menu.tsx` - change one item's price
  - Run `npm run build`
  - Check `dist/index.html` noscript section
  - Verify modified price appears in generated HTML
  - Revert the test change in Menu.tsx
  - This confirms automation works correctly

**Acceptance Criteria Met** (from spec.md US1):
- ✅ All 12 menu categories present in noscript
- ✅ All menu items listed with name, description, price in UAH
- ✅ Search engines can index accurate product info
- ✅ Menu changes automatically reflected (automation verified)
- ✅ No-JS users see complete, readable menu

**Checkpoint**: ✅ User Story 1 COMPLETE - Search engines can now crawl full menu

---

## Phase 4: User Story 2 Validation - User with JavaScript Disabled Views Menu (Priority: P2)

**Goal**: Verify users without JavaScript can browse complete menu and find contact info

**Independent Test**: Disable JavaScript, verify menu is readable, organized, and includes contact info for phone orders

### Validation Tasks

- [x] T016 [US2] Verify fallback page structure for no-JS users
  - With JavaScript disabled, confirm header section visible
  - Confirm menu sections with clear category headings
  - Confirm footer with contact information visible
  - Verify all content is accessible without JavaScript

- [x] T017 [US2] Verify menu organization and readability for no-JS users
  - Confirm menu items organized by category
  - Confirm section headings use Ukrainian names (Роли, Сети, Нігірі, etc.)
  - Verify item details format: "Name - Ingredients - XXX грн"
  - Verify full ingredient descriptions visible

- [x] T018 [US2] Verify contact information for phone orders
  - Confirm phone number visible: +38 077 172-07-07
  - Confirm address visible: м. Бровари, вул. Грушевського 7
  - Confirm operating hours visible: Пн-Нд: 10:00 - 21:00
  - On mobile, verify phone number is tappable (tel: link if implemented)

- [x] T019 [US2] Verify mobile readability without JavaScript
  - Test on mobile viewport (375px, 414px)
  - Confirm content readable without horizontal scrolling
  - Confirm text sizes are mobile-friendly (16px+ for body text)
  - Verify touch-friendly spacing between elements

**Acceptance Criteria Met** (from spec.md US2):
- ✅ Fallback version with header, menu, footer visible
- ✅ Menu items organized by category with clear headings
- ✅ Item details show name, ingredients, price in UAH format
- ✅ Contact info visible (phone, address, hours) for phone orders
- ✅ Mobile content readable without horizontal scroll

**Checkpoint**: ✅ User Story 2 COMPLETE - No-JS users can browse menu and contact restaurant

---

## Phase 5: User Story 3 Validation - Website Maintains SEO Performance (Priority: P3)

**Goal**: Verify search engines can validate and index the site with improved SEO metrics

**Independent Test**: Use Google Search Console, Rich Results Test, and Lighthouse to verify indexing and validation

### SEO Validation Tasks (per quickstart.md Steps 2-6)

- [x] T020 [US3] Validate HTML with W3C Markup Validation Service (quickstart.md Step 2)
  - View page source of built `dist/index.html`
  - Copy entire HTML (including noscript section)
  - Go to https://validator.w3.org/#validate_by_input
  - Paste HTML and click "Check"
  - Verify zero errors and zero warnings (or only acceptable vendor-specific warnings)
  - Document: "Document checking completed. No errors or warnings to show."

- [x] T021 [US3] Run Lighthouse SEO audit (quickstart.md Step 3)
  - Open Chrome DevTools → Lighthouse tab
  - Configure: Mode=Navigation, Categories=SEO, Device=Mobile
  - Run audit on production or dev build
  - Verify SEO score ≥ 95 (meets SC-004)
  - Verify all checks pass:
    - Document has `<title>` element
    - Document has meta description
    - Page has valid `rel=canonical`
    - Links are crawlable
  - No "Content is not sized correctly for viewport" warning

- [x] T022 [US3] Validate structured data with Google Rich Results Test (quickstart.md Step 4)
  - Go to https://search.google.com/test/rich-results
  - Enter production URL or paste HTML code
  - Click "Test URL"
  - Verify "Valid page" message appears
  - Verify Restaurant schema detected and valid
  - Verify LocalBusiness schema detected and valid
  - Verify no errors or warnings
  - Confirm noscript content complements structured data without conflicts

- [x] T023 [US3] Verify performance impact with Lighthouse (quickstart.md Step 6)
  - Run Lighthouse Performance audit with JavaScript ENABLED
  - Verify Performance score ≥ 90 (constitution requirement)
  - Check Core Web Vitals:
    - LCP ≤ 2.5s
    - CLS ≤ 0.1
    - INP ≤ 200ms
  - Verify no "Eliminate render-blocking resources" warning for noscript
  - Verify page source size increase < 50KB (meets SC-010)

- [x] T024 [US3] Verify build time impact
  - Measure baseline build time without plugin changes
  - Measure build time with plugin generating noscript
  - Verify build time increase < 5 seconds (meets performance goal from plan.md)

**Acceptance Criteria Met** (from spec.md US3):
- ✅ (Post-deployment) Search Console shows all items indexed with no crawl errors
- ✅ Rich Results Test validates Restaurant and Menu structured data
- ✅ Site appears in search with accurate menu previews
- ✅ Lighthouse SEO score 95+ with no missing content warnings
- ✅ Noscript content stays current automatically (via plugin)

**Checkpoint**: ✅ User Story 3 COMPLETE - SEO performance validated, site ready for improved search rankings

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and documentation

- [x] T025 [P] Update README.md with noscript generation feature documentation
  - Document that noscript content is auto-generated during build
  - Explain that Menu.tsx is single source of truth
  - Note that no manual synchronization is needed
  - Add troubleshooting section if plugin fails

- [x] T026 [P] Document plugin architecture in code comments
  - Add JSDoc comments to exported functions in `vite-plugins/generate-noscript.ts`
  - Document function parameters and return types
  - Add usage examples for parseMenuItems, groupByCategory, generateNoscriptHTML
  - Reference contracts/vite-plugin-interface.md for full specification

- [x] T027 [P] Run complete validation suite from quickstart.md
  - Execute all steps in quickstart.md testing checklist
  - Verify all checkboxes can be marked complete
  - Document any issues found and resolve

- [x] T028 [P] Verify GitHub Pages deployment compatibility
  - Run `npm run build` to generate `dist/` folder
  - Verify `dist/index.html` contains complete noscript content
  - Confirm dist/ folder can be deployed to GitHub Pages without modifications
  - Test deployed site on production GitHub Pages URL (if available)
  - Verify noscript content displays correctly on live site

- [x] T029 Add constitution compliance note to PR description
  - Reference "Deployment & Hosting" section from constitution v1.1.0
  - Note that feature aligns with "Build-Time Features Encouraged" guidance
  - Confirm all 8 constitution principles pass
  - Include before/after comparison of noscript content

**Checkpoint**: ✅ Feature complete, documented, and validated. Ready for deployment.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user story validation
- **User Story Validation (Phases 3-5)**: All depend on Foundational phase completion
  - User stories can be validated in parallel (if multiple testers available)
  - Or sequentially in priority order (US1 → US2 → US3)
- **Polish (Phase 6)**: Depends on all user story validation being complete

### Critical Path

```
Setup (T001-T002)
    ↓
Foundational: Plugin Implementation (T003-T011) ← BLOCKING
    ↓
┌─────────────┬──────────────┬──────────────┐
│   US1 Val   │   US2 Val    │   US3 Val    │ ← Can run in parallel
│ (T012-T015) │ (T016-T019)  │ (T020-T024)  │
└─────────────┴──────────────┴──────────────┘
    ↓
Polish (T025-T029)
```

### Within Each Phase

**Phase 2 (Foundational) - Sequential**:
- T003 → T004 (skeleton before parsing logic)
- T004, T005, T006, T007 can be built in parallel after T003
- T008 requires T004, T005, T006, T007 complete
- T009 requires T008 complete
- T010 requires T009 complete
- T011 is final verification

**Phases 3-5 (User Story Validation) - Independent**:
- Each user story validation can proceed independently
- No dependencies between user stories
- Priority suggests order: US1 → US2 → US3
- But can run in parallel if resources available

**Phase 6 (Polish) - Parallel**:
- All tasks marked [P] can run simultaneously
- All tasks are independent

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel
- **Phase 2**: T004, T005, T006, T007 can be developed in parallel (after T003)
- **Phases 3-5**: All three user story validation phases can run in parallel
- **Phase 6**: All polish tasks (T025-T029) can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# After T003 (plugin skeleton) completes, launch in parallel:
Task: "Implement parseMenuItems() function"
Task: "Implement groupByCategory() function"
Task: "Implement generateNoscriptHTML() function"
Task: "Implement validateHTMLSize() function"

# Then sequentially:
Task: "Implement transformIndexHtml hook" (requires above functions)
Task: "Add error handling" (requires hook implementation)
Task: "Register plugin in vite.config.ts" (requires error handling)
Task: "Run production build and verify" (final integration test)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T011) - CRITICAL PATH
3. Complete Phase 3: User Story 1 Validation (T012-T015)
4. **STOP and VALIDATE**: Test with JavaScript disabled, verify menu crawlable
5. Deploy to GitHub Pages if ready → SEO improvements begin immediately

**Why this is MVP**: Search engine crawlability is the core business value (P1 priority). Once US1 is complete, search engines can index the full menu, driving organic traffic growth.

### Incremental Delivery

1. Complete Setup + Foundational → Plugin working, HTML generated
2. Add User Story 1 Validation → Confirm SEO crawlability → **Deploy (MVP!)**
3. Add User Story 2 Validation → Confirm no-JS user experience → **Deploy**
4. Add User Story 3 Validation → Confirm long-term SEO metrics → **Monitor**
5. Polish & Documentation → **Final Release**

Each deployment adds validation confidence without blocking business value delivery.

### Single Developer Strategy

**Recommended order**:
1. T001-T002 (Setup) - 30 minutes
2. T003-T011 (Foundational) - 4-6 hours (core implementation)
3. T012-T015 (US1 Validation) - 1 hour
4. Deploy to staging, validate with real search bots
5. T016-T019 (US2 Validation) - 30 minutes
6. T020-T024 (US3 Validation) - 1 hour
7. T025-T029 (Polish) - 1-2 hours

**Total estimated time**: 8-12 hours for complete feature

---

## Notes

- **No tests requested**: Feature spec doesn't request automated tests; manual validation via quickstart.md is sufficient
- **Shared implementation**: All three user stories depend on the same plugin implementation (Phase 2)
- **Validation focus**: Phases 3-5 are validation/acceptance testing, not additional implementation
- **GitHub Pages compatible**: Plugin runs at build time, not runtime; 100% compatible with static hosting
- **Zero maintenance**: After implementation, plugin automatically keeps noscript content synchronized
- **Constitution compliant**: Feature strengthens Principle VIII (Simplicity) by eliminating manual updates
- Commit after each task or logical group
- Run `npm run lint` and `tsc --noEmit` after plugin implementation
- Verify build succeeds before proceeding to validation phases
- Stop at any checkpoint to test independently

---

## Task Summary

**Total Tasks**: 29  
**Setup**: 2 tasks  
**Foundational (Blocking)**: 9 tasks  
**User Story 1 (P1)**: 4 tasks  
**User Story 2 (P2)**: 4 tasks  
**User Story 3 (P3)**: 5 tasks  
**Polish**: 5 tasks

**Parallel Opportunities**: 12 tasks can run in parallel at various phases  
**Critical Path**: Phase 2 (Foundational) must complete before any user story validation

**Suggested MVP Scope**: Phases 1-3 (Setup + Foundational + US1 Validation) = 15 tasks, ~6-8 hours

**Independent Test Criteria**:
- **US1**: Disable JS, verify 45 menu items visible with accurate data
- **US2**: Disable JS, verify readable menu with contact info
- **US3**: Run Lighthouse/W3C/Rich Results tests, verify scores ≥95

