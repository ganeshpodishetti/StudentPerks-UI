const fs = require('fs');
const path = require('path');

const applyBrandPalette = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Generic replacements for grays/neutrals
  content = content.replace(/neutral-100/g, 'brand-100/50');
  content = content.replace(/neutral-200/g, 'brand-300');
  content = content.replace(/neutral-300/g, 'brand-300');
  content = content.replace(/neutral-400/g, 'brand-500');
  content = content.replace(/neutral-500/g, 'brand-500');
  content = content.replace(/neutral-600/g, 'brand-700');
  content = content.replace(/neutral-700/g, 'brand-700');
  content = content.replace(/neutral-800/g, 'brand-900');
  content = content.replace(/neutral-900/g, 'brand-900');
  
  // Custom tweaks for Deal Card specifically
  // E.g., `bg-white dark:bg-brand-900` root layout
  content = content.replace(/dark:bg-white/g, 'dark:bg-brand-100');
  content = content.replace(/bg-black/g, 'bg-brand-900');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
};

const files = [
  './src/features/deals/components/display/DealCard/DealCard.tsx',
  './src/features/deals/components/display/DealList/DealsContainer.tsx',
  './src/features/deals/components/display/DealList/DealsFilters.tsx',
  './app/HomePageClient.tsx',
  './app/(public)/deals/page.tsx',
  './app/(public)/universities/page.tsx',
  './app/deals/page.tsx',
  './app/universities/page.tsx'
];

files.forEach(f => applyBrandPalette(path.resolve(process.cwd(), f)));
