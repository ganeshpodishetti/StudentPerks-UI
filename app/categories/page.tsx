import Navigation from '@/components/Navigation'
import CategoriesPage from './CategoriesPage'

export const metadata = {
  title: 'Categories - StudentPerks',
  description: 'Browse deals by category',
}

export default function Categories() {
  return (
    <div className="min-h-screen h-full w-full bg-[#FAFAFA] dark:bg-neutral-950 flex flex-col">
      <Navigation />
      <main className="flex-grow py-14 md:py-16 bg-[#FAFAFA] dark:bg-neutral-950">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-[#FAFAFA] dark:bg-neutral-950">
          <CategoriesPage />
        </div>
      </main>
    </div>
  )
}
