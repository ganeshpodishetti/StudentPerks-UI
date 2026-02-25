'use client'

import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import { UnreadDealsProvider } from '@/features/deals/contexts/UnreadDealsContext'
import { ErrorBoundary } from '@/shared/components/feedback/ErrorBoundary'
import { ErrorProvider } from '@/shared/contexts/ErrorContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { ReactNode, useState } from 'react'

// Lazy load Toaster since it's only needed when showing toasts
const Toaster = dynamic(() => import('@/shared/components/ui/toaster').then(mod => mod.Toaster), {
  ssr: false,
})

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Create QueryClient in component to avoid SSR issues
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false
              }
              return failureCount < 3
            },
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false, // Prevent unnecessary refetches
            refetchOnReconnect: true, // Refetch when connection is restored
            networkMode: 'online', // Only run queries when online
          },
          mutations: {
            retry: (failureCount, error: any) => {
              // Retry mutations on network errors only
              if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
                return failureCount < 2
              }
              return false
            },
            networkMode: 'online',
          },
        },
      })
  )

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ErrorProvider>
          <AuthProvider>
            <UnreadDealsProvider>
              {children}
              <Toaster />
            </UnreadDealsProvider>
          </AuthProvider>
        </ErrorProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
