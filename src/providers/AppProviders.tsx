'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorProvider } from '@/contexts/ErrorContext'
import { UnreadDealsProvider } from '@/contexts/UnreadDealsContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

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
          },
          mutations: {
            retry: false,
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
