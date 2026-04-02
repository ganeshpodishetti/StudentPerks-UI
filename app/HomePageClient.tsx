'use client'

import { Category, fetchCategories } from '@/features/categories/services/categoryService'
import { DealsContainer } from '@/features/deals/components/display/DealList/DealsContainer'
import Navigation from '@/shared/components/layout/Navigation/Navigation'
import { useToast } from '@/shared/components/ui/use-toast'
import type { FeedType } from '@/shared/types/api/responses'
import { Plus, Tag, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const SubmittedDealFormModal = dynamic(
  () => import('@/features/deals/components/forms/SubmittedDealFormModal/SubmittedDealFormModal'),
  {
    ssr: false,
  },
)


interface HomePageClientProps {
  sectionedFeeds?: boolean
}

const FEED_SECTIONS: Array<{ title: string; feedType: FeedType }> = [
  { title: 'Featured', feedType: 'featured' },
  { title: 'Latest', feedType: 'latest' },
  { title: 'Trending', feedType: 'trending' },
  { title: 'Popular', feedType: 'popular' },
]

export function HomePageClient({ sectionedFeeds = false }: HomePageClientProps) {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const clearSearchHref = sectionedFeeds ? '/' : '/deals'
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [isSubmitDealModalOpen, setIsSubmitDealModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (sectionedFeeds) {
      return
    }

    const loadCategories = async () => {
      const data = await fetchCategories()
      setCategories(data)
    }

    loadCategories()
  }, [sectionedFeeds])


  return (
    <div className="min-h-screen h-full w-full bg-background dark:bg-background flex flex-col">
      <Navigation />

      <main className="flex-grow py-14 md:py-16 bg-background dark:bg-background">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-background dark:bg-background">
          <div className="flex flex-col md:flex-row gap-6">
            {!sectionedFeeds && (
              <aside className="w-full md:w-48 shrink-0">
              <div className="md:sticky md:top-24">
                <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-300 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories
                </h3>
                <nav className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                  <button
                    onClick={() => setSelectedCategory(undefined)}
                    className={`whitespace-nowrap text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      !selectedCategory
                        ? 'bg-brand-100/50 dark:bg-brand-900 text-brand-900 dark:text-white font-medium'
                        : 'text-brand-700 dark:text-brand-300 hover:bg-neutral-50 dark:hover:bg-brand-900/50'
                    }`}
                  >
                    All Deals
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.title)}
                      className={`whitespace-nowrap text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedCategory === category.title
                          ? 'bg-brand-100/50 dark:bg-brand-900 text-brand-900 dark:text-white font-medium'
                          : 'text-brand-700 dark:text-brand-300 hover:bg-neutral-50 dark:hover:bg-brand-900/50'
                      }`}
                    >
                      {category.title}
                    </button>
                  ))}
                </nav>
              </div>
              </aside>
            )}

            <div className="flex-1 min-w-0">
              {searchQuery && (
                <div className="mb-4 flex items-center gap-2 text-sm text-brand-700 dark:text-brand-300">
                  <span>
                    Searching for: <strong className="text-brand-900 dark:text-white">&quot;{searchQuery}&quot;</strong>
                  </span>
                  <Link
                    href={clearSearchHref}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-brand-100/50 dark:bg-brand-900 hover:bg-brand-300 dark:hover:bg-brand-700 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </Link>
                </div>
              )}

               {sectionedFeeds && !searchQuery ? (
                 <div className="space-y-10">
                   <section className="max-w-4xl mx-auto text-center mb-20 md:mb-24 px-4">
                     <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-brand-500 dark:text-brand-300 mb-4 opacity-80">
                       EVERYDAY PERKS. SIMPLIFIED.
                     </p>
                     <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-brand-900 dark:text-brand-100 leading-[1.05] tracking-tight mb-8">
                       Verified Savings for the <span className="text-brand-500">Modern Crowd.</span>
                     </h1>
                     <p className="text-sm md:text-xl text-brand-800 dark:text-brand-300 max-w-2xl mx-auto leading-relaxed font-medium">
                       Unlock hand-picked student perks and exclusive deals from the brands you love. 
                       PerksCrowd bridges the gap between smart living and premium value—verified, instant, and 100% free.
                     </p>
                   </section>

                   {FEED_SECTIONS.map((section) => (
                     <section key={`${section.feedType}-${selectedCategory || 'all'}`}>
                       <div className="mb-4">
                         <h2 className="text-xl md:text-2xl font-semibold text-brand-900 dark:text-brand-100/50">
                           {section.title}
                         </h2>
                       </div>
                       <DealsContainer
                         excludeUniversitySpecific={true}
                         initialCategory={selectedCategory}
                         showHeroSection={false}
                         showFilters={false}
                         showLoadMore={false}
                         feedType={section.feedType}
                         showStatusHeader={false}
                         key={`${section.feedType}-${selectedCategory || 'all'}`}
                       />
                     </section>
                   ))}
                 </div>
               ) : (
                <DealsContainer
                  excludeUniversitySpecific={true}
                  initialCategory={selectedCategory}
                  initialSearchQuery={searchQuery}
                  showHeroSection={false}
                  showFilters={false}
                  useFeedApis={false}
                  showLoadMore={true}
                  key={`${selectedCategory}-${searchQuery}`}
                />
              )}
            </div>
          </div>
        </div>

        {sectionedFeeds && (
          <div className="w-full max-w-7xl mx-auto px-6 md:px-8 mt-12 mb-8">
            <section className="text-center bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 md:p-12 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-900 dark:text-brand-100 mb-4">
                Know a great deal?
              </h2>
              <p className="text-brand-700 dark:text-brand-300 mb-6 max-w-xl mx-auto text-base">
                Help our community save by sharing the best deals, discounts, and perks you've found.
              </p>
              <button
                onClick={() => setIsSubmitDealModalOpen(true)}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-brand-100 bg-brand-900 dark:bg-brand-100 dark:text-brand-900 rounded-full hover:bg-brand-700 dark:hover:bg-brand-300 transition-colors shadow-sm"
              >
                <Plus className="mr-2 h-5 w-5" />
                Submit a Deal
              </button>
            </section>
          </div>
        )}
      </main>

      {isSubmitDealModalOpen && (
        <SubmittedDealFormModal
          isOpen={isSubmitDealModalOpen}
          onClose={() => setIsSubmitDealModalOpen(false)}
          onSuccess={() => {
            toast({
              title: "Deal Submitted!",
              description: "Thanks for sharing! We'll review your deal and add it to the platform soon.",
            })
          }}
        />
      )}
    </div>
  )
}

export function HomePageLoadingFallback() {
  return (
    <div className="min-h-screen h-full w-full bg-background dark:bg-background flex flex-col">
      <Navigation />
      <main className="flex-grow py-14 md:py-16 bg-background dark:bg-background">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-brand-300 dark:bg-brand-700 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-brand-300 dark:bg-brand-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
