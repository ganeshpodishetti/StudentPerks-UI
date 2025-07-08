import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 flex flex-col">
        <main className="flex-grow py-14 md:py-16 bg-[#FAFAFA] dark:bg-neutral-950">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-8 bg-[#FAFAFA] dark:bg-neutral-950">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
