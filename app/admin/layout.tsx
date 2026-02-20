import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
