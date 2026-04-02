'use client'

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
            retry: (failureCount, error: unknown) => {
              const err = error as { response?: { status?: number } };
              const status = err?.response?.status;
              if (status !== undefined && status >= 400 && status < 500) {
                return false
              }
              return failureCount < 3
            },
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            networkMode: 'online',
          },
          mutations: {
            retry: (failureCount, error: unknown) => {
              const err = error as { code?: string; message?: string };
              if (err.code === 'NETWORK_ERROR' || (err.message as string)?.includes('Network Error')) {
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
          {children}
          <Toaster />
        </ErrorProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
