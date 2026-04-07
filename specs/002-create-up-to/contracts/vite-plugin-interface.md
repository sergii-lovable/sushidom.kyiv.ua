# Vite Plugin Interface: generate-noscript

**Feature**: Up-to-Date Search Engine Fallback  
**Date**: 2025-10-10  
**Plugin Location**: `vite-plugins/generate-noscript.ts`

## Overview

This document defines the interface contract for the `generate-noscript` Vite plugin that automatically extracts menu data from Menu.tsx and injects it into index.html during the build process.

## Plugin API

### Export

```typescript
export default function generateNoscriptPlugin(): Plugin
```

**Returns**: Vite `Plugin` object conforming to Vite Plugin API specification

### Plugin Configuration

```typescript
{
  name: 'generate-noscript',
  enforce: 'pre',  // Run before other HTML transforms
  transformIndexHtml: {
    order: 'pre',
    handler: (html: string) => string | Promise<string>
  }
}
```

## Input Contract

### Source File

**Location**: `src/components/Menu.tsx`

**Expected Structure**:
```typescript
// Must export MenuItemType interface or import it
export interface MenuItemType {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// Must contain menuItems constant export
const menuItems: MenuItemType[] = [
  {
    id: 1,
    name: "...",
    description: "...",
    price: 219,
    image: "...",
    category: "rolls"
  },
  // ...more items
];
```

**Requirements**:
- File must be valid TypeScript
- `menuItems` constant must be exported or accessible at module scope
- Each item must conform to MenuItemType structure
- Array must not be empty

### HTML Template

**Location**: `index.html`

**Expected Marker**:
```html
<noscript>
  <!-- NOSCRIPT_MENU_PLACEHOLDER -->
  <!-- Fallback content will be generated here -->
</noscript>
```

**Requirements**:
- `<noscript>` tag must exist
- Placeholder comment must be present for injection point
- Existing content between markers will be replaced

## Output Contract

### Generated HTML Structure

```html
<noscript>
  <header style="padding: 20px; background: #1a1a1a; color: white;">
    <h1>СУШИDОМ - Найсмачніші суші у Києві</h1>
    <p>Замовте найсмачніші суші у Києві</p>
  </header>
  <main style="padding: 20px; max-width: 1200px; margin: 0 auto;">
    <section>
      <h2>Наше меню</h2>
      
      <article>
        <h3>Роли</h3>
        <ul>
          <li><strong>Філадельфія</strong> - Лосось, крем-сир, огірок, рис, норі - 219 грн</li>
          <!-- ...more items -->
        </ul>
      </article>
      
      <!-- ...more categories -->
      
    </section>
    <section>
      <h2>Контакти</h2>
      <p><strong>Телефон:</strong> +38 098 003-62-63</p>
      <p><strong>Адреса:</strong> м. Київ, вул. Княжий затон 2/30</p>
      <p><strong>Час роботи:</strong> Пн-Нд: 10:00 - 21:00</p>
    </section>
  </main>
  <footer style="padding: 20px; background: #1a1a1a; color: white; margin-top: 40px;">
    <p>&copy; 2025 СУШИDОМ. Всі права захищені.</p>
  </footer>
</noscript>
```

**Guarantees**:
- Valid HTML5 markup (no unclosed tags, proper nesting)
- UTF-8 encoded Ukrainian characters
- Semantic structure (h1 → h2 → h3 hierarchy)
- Inline CSS for mobile responsiveness
- All menu items from Menu.tsx included
- Categories with 0 items omitted
- Total size < 50KB

## Error Handling

### Build Failures

The plugin MUST fail the build (throw error) when:

1. **File Not Found**:
   ```typescript
   throw new Error('Menu.tsx not found at src/components/Menu.tsx')
   ```

2. **Parse Error**:
   ```typescript
   throw new Error('Failed to parse Menu.tsx: [TypeScript error message]')
   ```

3. **Missing menuItems**:
   ```typescript
   throw new Error('menuItems array not found in Menu.tsx')
   ```

4. **Invalid Item Structure**:
   ```typescript
   throw new Error('Menu item [id] missing required property: [property name]')
   ```

5. **Size Constraint Violation**:
   ```typescript
   throw new Error('Generated noscript HTML exceeds 50KB limit: [actual size]KB')
   ```

6. **Malformed HTML**:
   ```typescript
   throw new Error('Generated HTML is not well-formed: [validation error]')
   ```

### Build Warnings

The plugin MAY emit warnings (console.warn) for:

- Empty categories detected (informational)
- Unusually large item descriptions (>500 chars)
- More than 100 total menu items (performance note)

## Dependencies

### Required Packages

```json
{
  "typescript": "^5.0.0",    // For ts.createSourceFile, AST parsing
  "vite": "^5.0.0"           // For Plugin interface
}
```

No additional dependencies required (uses built-in Node.js modules: `fs`, `path`).

## Performance Contract

**Build Time Impact**:
- Plugin execution time: < 500ms (for 45 items)
- Acceptable range: < 5 seconds total build time increase
- File I/O operations: 2 reads (Menu.tsx, index.html), 0 writes (Vite handles output)

**Memory Usage**:
- AST in memory: ~2MB for typical Menu.tsx
- Generated HTML string: ~6.5KB
- Total plugin memory overhead: < 10MB

## Testing Interface

### Unit Test Exports

The plugin should export testable functions:

```typescript
// Main plugin factory (default export)
export default function generateNoscriptPlugin(): Plugin;

// Testable utilities (named exports)
export function parseMenuItems(sourceCode: string): MenuItemType[];
export function generateNoscriptHTML(items: MenuItemType[]): string;
export function validateHTMLSize(html: string, maxSizeKB: number): void;
export function groupByCategory(items: MenuItemType[]): Map<string, MenuItemType[]>;
```

### Test Fixtures

Tests should verify:
1. Correct extraction from valid Menu.tsx
2. Error thrown for malformed Menu.tsx
3. HTML generation with sample data
4. Size validation triggers at 50KB threshold
5. Category grouping and ordering logic
6. Special character handling (Ukrainian letters, quotes)

## Vite Configuration Integration

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import generateNoscriptPlugin from './vite-plugins/generate-noscript';

export default defineConfig({
  plugins: [
    generateNoscriptPlugin(),  // Add before other HTML transforms
    // ...other plugins
  ]
});
```

**Order Matters**: This plugin should run early (`enforce: 'pre'`) to ensure base HTML content is generated before other plugins transform it.

## Versioning

- **Breaking changes**: Update if Menu.tsx structure changes significantly (e.g., menuItems renamed)
- **Non-breaking**: HTML template improvements, additional validations
- Plugin is tightly coupled to Menu.tsx structure; major version bump if MenuItemType interface changes

## Future Enhancements (Out of Scope)

- [ ] Support multiple menu data sources
- [ ] Configurable HTML templates
- [ ] i18n support for multiple languages
- [ ] Image optimization for noscript content
- [ ] Incremental builds (cache parsed AST)

---

**Interface Version**: 1.0.0  
**Compatible with**: Vite 5.x, TypeScript 5.x  
**Last Updated**: 2025-10-10

