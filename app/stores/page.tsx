import Navigation from '@/components/Navigation'
import StoresPage from './StoresPage'

export const metadata = {
  title: 'Stores - StudentPerks',
  description: 'Browse deals by store',
}

export default function Stores() {
  return (
    <div className="min-h-screen h-full w-full bg-white dark:bg-neutral-950 flex flex-col">
      <Navigation />
      <main className="flex-grow py-14 md:py-16 bg-white dark:bg-neutral-950">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-white dark:bg-neutral-950">
          <StoresPage />
        </div>
      </main>
    </div>
  )
}
