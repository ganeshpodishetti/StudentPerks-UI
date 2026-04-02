const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(process.cwd(), './src/features/deals/components/display/DealDetail/DealDetail.tsx');

let content = fs.readFileSync(targetFile, 'utf8');

// Header category badge
content = content.replace(
  /bg-neutral-100 hover:bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300/g,
  'bg-brand-100/50 hover:bg-brand-100 transition-colors text-brand-700 dark:bg-brand-900 dark:text-brand-100'
);

// Header store name
content = content.replace(
  /text-xs text-neutral-500 dark:text-neutral-400/g,
  'text-xs font-medium text-brand-700 dark:text-brand-300'
);

// Discount badge
content = content.replace(
  /bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black/g,
  'bg-brand-900 hover:bg-brand-700 text-brand-100 dark:bg-brand-100 dark:hover:bg-brand-300 dark:text-brand-900'
);

// Deal title
content = content.replace(
  /text-sm font-semibold leading-tight text-neutral-800 dark:text-neutral-200/g,
  'text-base font-bold leading-tight text-brand-900 dark:text-brand-100'
);

// Deal metadata grid
content = content.replace(
  /text-xs text-neutral-500 dark:text-neutral-400/g,
  'text-xs text-brand-700 dark:text-brand-300'
);

// Promo container
content = content.replace(
  /bg-neutral-100\/70 dark:bg-neutral-900\/70 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800/g,
  'bg-brand-100/30 dark:bg-brand-900/30 p-3 rounded-xl border border-brand-300 dark:border-brand-700'
);

// Promo text labels
content = content.replace(
  /text-neutral-500 dark:text-neutral-400 font-medium/g,
  'text-brand-700 dark:text-brand-300 font-medium'
);
content = content.replace(
  /text-neutral-800 dark:text-neutral-200 truncate mt-0\.5/g,
  'text-brand-900 dark:text-brand-100 truncate mt-0.5'
);

// Promo Copy Button
content = content.replace(
  /border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/g,
  'border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300 hover:bg-brand-100 hover:text-brand-900 dark:hover:bg-brand-900'
);

// How to Redeem Blue box
content = content.replace(/bg-blue-50 dark:bg-blue-950\/20/g, 'bg-brand-100/30 dark:bg-brand-900/30');
content = content.replace(/border-blue-200 dark:border-blue-800/g, 'border-brand-300 dark:border-brand-700');
content = content.replace(/text-blue-600 dark:text-blue-400/g, 'text-brand-700 dark:text-brand-300');
content = content.replace(/text-blue-900 dark:text-blue-200/g, 'text-brand-900 dark:text-brand-100');
content = content.replace(/text-blue-700 dark:text-blue-300/g, 'text-brand-700 dark:text-brand-300');

// University Purple box
content = content.replace(/bg-purple-50 dark:bg-purple-950\/20/g, 'bg-brand-100/30 dark:bg-brand-900/30');
content = content.replace(/border-purple-200 dark:border-purple-800/g, 'border-brand-300 dark:border-brand-700');
content = content.replace(/text-purple-600 dark:text-purple-400/g, 'text-brand-700 dark:text-brand-300');
content = content.replace(/text-purple-900 dark:text-purple-200/g, 'text-brand-900 dark:text-brand-100');
content = content.replace(/text-purple-700 dark:text-purple-300/g, 'text-brand-700 dark:text-brand-300');

// Official Link Button
content = content.replace(
  /bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200/g,
  'text-brand-100 bg-brand-900 hover:bg-brand-700 dark:bg-brand-100 dark:text-brand-900 dark:hover:bg-brand-300'
);

fs.writeFileSync(targetFile, content);
console.log('DealDetail.tsx modernized!');
