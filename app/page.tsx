import DealList from '@/components/DealList'
import Navigation from '@/components/Navigation'
import Script from 'next/script'

export default function HomePage() {
  return (
    <div className="min-h-screen h-full w-full bg-background dark:bg-background flex flex-col">
      <Navigation />

      <main className="flex-grow py-14 md:py-16 bg-background dark:bg-background">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-background dark:bg-background">
          <DealList />
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
