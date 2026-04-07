import type { Plugin } from 'vite';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface MenuItemType {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

/**
 * Vite plugin that automatically generates noscript HTML content from Menu.tsx
 * Runs at build time to ensure 100% data parity between dynamic and static content
 */
export default function generateNoscriptPlugin(): Plugin {
  return {
    name: 'generate-noscript',
    enforce: 'pre', // Run before other HTML transforms
    
    transformIndexHtml: {
      order: 'pre',
      handler(html: string) {
        try {
          // Parse Menu.tsx and extract menu items
          const menuItems = parseMenuItems('src/components/Menu.tsx');
          
          // Group items by category
          const groupedItems = groupByCategory(menuItems);
          
          // Generate noscript HTML
          const noscriptHTML = generateNoscriptHTML(groupedItems);
          
          // Validate HTML size
          validateHTMLSize(noscriptHTML);
          
          // Replace placeholder with generated content
          const updatedHTML = html.replace(
            /<!--\s*NOSCRIPT_MENU_PLACEHOLDER\s*-->[\s\S]*?<\/noscript>/,
            `<!-- NOSCRIPT_MENU_PLACEHOLDER -->\n${noscriptHTML}\n    </noscript>`
          );
          
          return updatedHTML;
        } catch (error) {
          // Build should fail if noscript generation fails
          throw new Error(`Failed to generate noscript content: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  };
}

/**
 * Parse Menu.tsx and extract menuItems array using TypeScript Compiler API
 */
function parseMenuItems(filePath: string): MenuItemType[] {
  try {
    // Read the Menu.tsx file
    const fullPath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Menu.tsx not found at ${fullPath}`);
    }
    
    const sourceCode = fs.readFileSync(fullPath, 'utf-8');
    
    // Create TypeScript source file AST
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );
    
    let menuItems: MenuItemType[] = [];
    
    // Walk the AST to find menuItems variable declaration
    function visit(node: ts.Node) {
      // Look for: const menuItems: MenuItemType[] = [...]
      if (ts.isVariableStatement(node)) {
        const declaration = node.declarationList.declarations[0];
        
        if (declaration &&
            ts.isIdentifier(declaration.name) &&
            declaration.name.text === 'menuItems' &&
            declaration.initializer &&
            ts.isArrayLiteralExpression(declaration.initializer)) {
          
          // Extract array elements
          const arrayElements = declaration.initializer.elements;
          
          arrayElements.forEach((element) => {
            if (ts.isObjectLiteralExpression(element)) {
              const item: Partial<MenuItemType> = {};
              
              element.properties.forEach((prop) => {
                if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
                  const propName = prop.name.text;
                  const propValue = prop.initializer;
                  
                  if (propName === 'id' && ts.isNumericLiteral(propValue)) {
                    item.id = parseInt(propValue.text, 10);
                  } else if (propName === 'name' && ts.isStringLiteral(propValue)) {
                    item.name = propValue.text;
                  } else if (propName === 'description' && ts.isStringLiteral(propValue)) {
                    item.description = propValue.text;
                  } else if (propName === 'price' && ts.isNumericLiteral(propValue)) {
                    item.price = parseInt(propValue.text, 10);
                  } else if (propName === 'category' && ts.isStringLiteral(propValue)) {
                    item.category = propValue.text;
                  } else if (propName === 'image') {
                    // Image is not needed for noscript, but we capture it for completeness
                    item.image = '';
                  }
                }
              });
              
              // Validate required properties
              if (item.id && item.name && item.description && item.price !== undefined && item.category) {
                menuItems.push(item as MenuItemType);
              } else {
                throw new Error(`Menu item ${item.id || 'unknown'} is missing required properties`);
              }
            }
          });
        }
      }
      
      ts.forEachChild(node, visit);
    }
    
    visit(sourceFile);
    
    if (menuItems.length === 0) {
      throw new Error('menuItems array not found or is empty in Menu.tsx');
    }
    
    console.log(`✓ Parsed ${menuItems.length} menu items from Menu.tsx`);
    
    return menuItems;
  } catch (error) {
    throw new Error(`Failed to parse Menu.tsx: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Group menu items by category and map to Ukrainian display names
 */
function groupByCategory(items: MenuItemType[]): Map<string, MenuItemType[]> {
  // Category mapping: internal ID → Ukrainian display name
  const categoryNames: Record<string, string> = {
    'rolls': 'Роли',
    'sets': 'Сети',
    'nigiri': 'Запечені',
    'salat': 'Салат',
    'sashimi': 'Сашимі',
    'nigiri-sushi': 'Нігірі',
    'gunkan': 'Гункани',
    'soup': 'Супи',
    'drinks': 'Напої'
  };
  
  // Category ordering by importance
  const categoryOrder = [
    'rolls', 'sets', 'nigiri', 'salat', 'sashimi', 
    'nigiri-sushi', 'gunkan', 'soup', 'drinks'
  ];
  
  // Group items by category
  const grouped: Record<string, MenuItemType[]> = {};
  
  items.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  
  // Create ordered Map with Ukrainian names, filter out empty categories
  const result = new Map<string, MenuItemType[]>();
  
  categoryOrder.forEach(categoryId => {
    if (grouped[categoryId] && grouped[categoryId].length > 0) {
      const displayName = categoryNames[categoryId] || categoryId;
      // Sort items by ID within each category
      const sortedItems = grouped[categoryId].sort((a, b) => a.id - b.id);
      result.set(displayName, sortedItems);
    }
  });
  
  console.log(`✓ Grouped items into ${result.size} categories`);
  
  return result;
}

/**
 * Generate semantic HTML for noscript section
 */
function generateNoscriptHTML(groupedItems: Map<string, MenuItemType[]>): string {
  const escapeHTML = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  let html = '';
  
  // Header section
  html += `      <header style="padding: 20px; background: #1a1a1a; color: white;">\n`;
  html += `        <h1>СУШИDОМ - Найсмачніші суші у Києві</h1>\n`;
  html += `        <p>Замовте найсмачніші суші у Києві</p>\n`;
  html += `      </header>\n`;
  
  // Main content section
  html += `      <main style="padding: 20px; max-width: 1200px; margin: 0 auto;">\n`;
  html += `        <section>\n`;
  html += `          <h2 style="font-size: 1.8em; margin: 24px 0 16px;">Наше меню</h2>\n`;
  
  // Generate category sections
  for (const [categoryName, items] of groupedItems) {
    html += `          <article>\n`;
    html += `            <h3 style="font-size: 1.3em; margin: 20px 0 12px; color: #333;">${escapeHTML(categoryName)}</h3>\n`;
    html += `            <ul>\n`;
    
    for (const item of items) {
      const name = escapeHTML(item.name);
      const description = escapeHTML(item.description);
      const price = item.price;
      
      html += `              <li style="margin-bottom: 8px; line-height: 1.6;"><strong>${name}</strong> - ${description} - ${price} грн</li>\n`;
    }
    
    html += `            </ul>\n`;
    html += `          </article>\n`;
  }
  
  html += `        </section>\n`;
  
  // Contact section
  html += `        <section>\n`;
  html += `          <h2 style="font-size: 1.8em; margin: 24px 0 16px;">Контакти</h2>\n`;
  html += `          <p><strong>Телефон:</strong> +38 098 003-62-63</p>\n`;
  html += `          <p><strong>Адреса:</strong> м. Київ, вул. Княжий затон 2/30</p>\n`;
  html += `          <p><strong>Час роботи:</strong> Пн-Нд: 10:00 - 21:00</p>\n`;
  html += `        </section>\n`;
  html += `      </main>\n`;
  
  // Footer section
  html += `      <footer style="padding: 20px; background: #1a1a1a; color: white; margin-top: 40px;">\n`;
  html += `        <p>&copy; ${new Date().getFullYear()} СУШИDОМ. Всі права захищені.</p>\n`;
  html += `      </footer>`;
  
  return html;
}

/**
 * Validate generated HTML meets size and structural requirements
 */
function validateHTMLSize(html: string): void {
  // Check HTML size constraint (< 50KB)
  const sizeInBytes = Buffer.byteLength(html, 'utf8');
  const sizeInKB = sizeInBytes / 1024;
  
  if (sizeInKB >= 50) {
    throw new Error(`Generated noscript HTML exceeds 50KB limit: ${sizeInKB.toFixed(2)}KB`);
  }
  
  // Basic HTML structure validation - check balanced tags
  const openingTags = (html.match(/<(\w+)[^>]*>/g) || []).filter(tag => !tag.startsWith('</') && !tag.endsWith('/>'));
  const closingTags = (html.match(/<\/(\w+)>/g) || []);
  
  // Extract tag names
  const openTagNames = openingTags.map(tag => tag.match(/<(\w+)/)?.[1]).filter(Boolean);
  const closeTagNames = closingTags.map(tag => tag.match(/<\/(\w+)>/)?.[1]).filter(Boolean);
  
  // Self-closing tags that don't need closing tags
  const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link'];
  const filteredOpenTags = openTagNames.filter(tag => !selfClosing.includes(tag || ''));
  
  if (filteredOpenTags.length !== closeTagNames.length) {
    console.warn(`⚠️  Warning: Potential HTML structure issue - ${filteredOpenTags.length} opening tags, ${closeTagNames.length} closing tags`);
  }
  
  console.log(`✓ HTML validation passed: ${sizeInKB.toFixed(2)}KB (under 50KB limit)`);
}

