'use client'
import { Category, fetchCategories } from '@/features/categories/services/categoryService'
import { DealsContainer } from '@/features/deals/components/display/DealList/DealsContainer'
import Navigation from '@/shared/components/layout/Navigation/Navigation'
import { Tag, X } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function HomePageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
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
          <div className="flex flex-col md:flex-row gap-6">
            {/* Category Sidebar - horizontal on mobile, vertical on desktop */}
            <aside className="w-full md:w-48 shrink-0">
              <div className="md:sticky md:top-24">
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories
                </h3>
                <nav className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                  <button
                    onClick={() => setSelectedCategory(undefined)}
                    className={`whitespace-nowrap text-left px-3 py-2 text-sm rounded-lg transition-colors ${
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
                      className={`whitespace-nowrap text-left px-3 py-2 text-sm rounded-lg transition-colors ${
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
              {/* Search indicator */}
              {searchQuery && (
                <div className="mb-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <span>Searching for: <strong className="text-neutral-900 dark:text-white">"{searchQuery}"</strong></span>
                  <Link 
                    href="/"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </Link>
                </div>
              )}
              <DealsContainer 
                excludeUniversitySpecific={true} 
                initialCategory={selectedCategory}
                initialSearchQuery={searchQuery}
                showHeroSection={false}
                showFilters={false}
                key={`${selectedCategory}-${searchQuery}`}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen h-full w-full bg-background dark:bg-background flex flex-col">
      <Navigation />
      <main className="flex-grow py-14 md:py-16 bg-background dark:bg-background">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePageContent />
    </Suspense>
  )
}
