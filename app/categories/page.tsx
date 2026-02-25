import dynamic from 'next/dynamic'
import CategoriesPage from './CategoriesPage'

// Dynamically import Navigation to reduce initial bundle size
const Navigation = dynamic(() => import('@/shared/components/layout/Navigation/Navigation'), {
  ssr: true,
})

export const metadata = {
  title: 'Categories - StudentPerks',
  description: 'Browse deals by category',
}

export default function Categories() {
  return (
    <div className="min-h-screen h-full w-full bg-background dark:bg-background flex flex-col">
      <Navigation />
      <main className="flex-grow py-14 md:py-16 bg-background dark:bg-background">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-background dark:bg-background">
          <CategoriesPage />
        </div>
      </main>
    </div>
  )
}
