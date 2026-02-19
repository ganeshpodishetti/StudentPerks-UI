'use client'
import { Category, fetchCategories } from '@/features/categories/services/categoryService'
import { DealsContainer } from '@/features/deals/components/display/DealList/DealsContainer'
import Navigation from '@/shared/components/layout/Navigation/Navigation'
import { Tag } from 'lucide-react'
import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen h-full w-full bg-background dark:bg-background flex flex-col">
      <Navigation />

      <main className="flex-grow py-14 md:py-16 bg-background dark:bg-background">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-background dark:bg-background">
          <div className="flex gap-6">
            {/* Category Sidebar */}
            <aside className="hidden lg:block w-48 shrink-0">
              <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories
                </h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(undefined)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      !selectedCategory
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    All Deals
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <DealsContainer 
                excludeUniversitySpecific={true} 
                initialCategory={selectedCategory}
                key={selectedCategory}
              />
            </div>
          </div>
        </div>
      </main>

      <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-neutral-500 dark:text-neutral-400 py-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>100+ Active Deals</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-neutral-400 rounded-full"></span>
          <span>50+ Brands</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-neutral-200 rounded-full"></span>
          <span>Save up to 60%</span>
        </div>
      </div>

      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </div>
  )
}
