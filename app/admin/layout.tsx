import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background dark:bg-neutral-950">
        <main className="flex-grow py-14 md:py-16">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
