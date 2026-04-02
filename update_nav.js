const fs = require('fs');
const path = './src/shared/components/layout/Navigation/Navigation.tsx';
let content = fs.readFileSync(path, 'utf8');

// Header Background
content = content.replace('bg-white dark:bg-neutral-950', 'bg-background dark:bg-background');

// Logo
content = content.replace(/text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-200/g, 'text-brand-900 dark:text-brand-100 hover:text-brand-700 dark:hover:text-brand-300');

// Desktop Navigation Links
content = content.replace(/text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white/g, 'text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-brand-100');
content = content.replace(/text-black dark:text-white border-b-2 border-black dark:border-white/g, 'text-brand-900 dark:text-brand-100 border-b-2 border-brand-900 dark:border-brand-100');

// Search Icons
content = content.replace(/text-neutral-400 h-3\.5 w-3\.5/g, 'text-brand-500 h-3.5 w-3.5');

// Search Inputs
content = content.replace(/bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/g, 'bg-brand-100/50 dark:bg-brand-900/50 border border-brand-300 dark:border-brand-700');
content = content.replace(/focus:ring-neutral-400 dark:focus:ring-neutral-500/g, 'focus:ring-brand-500 dark:focus:ring-brand-500');
content = content.replace(/text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder:text-neutral-500/g, 'text-brand-900 dark:text-brand-100 placeholder-brand-500 dark:placeholder:text-brand-300');

// Join Buttons
content = content.replace(/text-white bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200/g, 'text-brand-100 bg-brand-900 dark:bg-brand-100 dark:text-brand-900 hover:bg-brand-700 dark:hover:bg-brand-300');

// Mobile Menu/Search Buttons
content = content.replace(/text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:ring-neutral-500/g, 'text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-900 focus:ring-brand-500');

// Mobile Menu Container
content = content.replace(/bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/g, 'bg-white dark:bg-background border border-brand-300 dark:border-brand-700');

// Mobile Menu Active Links
content = content.replace(/bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white/g, 'bg-brand-300 dark:bg-brand-700 text-brand-900 dark:text-brand-100');

// Mobile Menu Inactive Links
content = content.replace(/text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white/g, 'text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-900 dark:hover:text-brand-100');

fs.writeFileSync(path, content);
console.log("Updated Navigation component");
