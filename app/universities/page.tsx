import dynamic from 'next/dynamic'
import UniversitiesPage from './UniversitiesPage'

// Dynamically import Navigation to reduce initial bundle size
const Navigation = dynamic(() => import('@/shared/components/layout/Navigation/Navigation'), {
  ssr: true,
})

export const metadata = {
  title: 'Universities - StudentPerks',
  description: 'Browse deals by university',
}

export default function Universities() {
  return (
    <div className="min-h-screen h-full w-full bg-background dark:bg-background flex flex-col">
      <Navigation />
      <main className="flex-grow py-14 md:py-16 bg-background dark:bg-background">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-background dark:bg-background">
          <UniversitiesPage />
        </div>
      </main>
    </div>
  )
}
