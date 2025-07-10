import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background dark:bg-background" style={{
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        minHeight: '100vh',
        WebkitOverflowScrolling: 'touch',
        WebkitTapHighlightColor: 'transparent',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <main className="flex-grow py-14 md:py-16">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
