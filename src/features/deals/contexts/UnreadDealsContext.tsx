import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, ReactNode, useCallback, useMemo } from 'react';
import { submittedDealService } from '../services/submittedDealService';

// Query keys for unread deals
export const unreadDealsKeys = {
  all: ['unreadDeals'] as const,
  count: () => [...unreadDealsKeys.all, 'count'] as const,
};

// Context types
export interface UnreadDealsContextType {
  unreadCount: number;
  isLoading: boolean;
  refreshCount: () => Promise<void>;
  updateCount: (count: number) => void;
}

// Create context
export const UnreadDealsContext = createContext<UnreadDealsContextType | undefined>(undefined);

// Provider component
interface UnreadDealsProviderProps {
  children: ReactNode;
}

export const UnreadDealsProvider: React.FC<UnreadDealsProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // Only fetch unread count if user is authenticated and is an admin
  const isAdmin = isAuthenticated && user?.roles?.includes('Admin');

  // Use React Query for unread count management
  const {
    data: unreadCount = 0,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: unreadDealsKeys.count(),
    queryFn: async () => {
      try {
        const deals = await submittedDealService.getSubmittedDeals();
        return deals.filter(deal => !deal.markedAsRead).length;
      } catch (error) {
        console.error('Error loading unread deals count:', error);
        return 0;
      }
    },
    enabled: isAdmin, // Only run query if user is an admin
    staleTime: 2 * 60 * 1000, // 2 minutes - notifications should be relatively fresh
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchInterval: isAdmin ? 5 * 60 * 1000 : false, // Poll every 5 minutes only for admins
  });

  const refreshCount = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const updateCount = useCallback((count: number) => {
    // Update the cache directly for immediate UI feedback
    queryClient.setQueryData(unreadDealsKeys.count(), count);
  }, [queryClient]);

  const value: UnreadDealsContextType = useMemo(() => ({
    unreadCount,
    isLoading,
    refreshCount,
    updateCount,
  }), [unreadCount, isLoading, refreshCount, updateCount]);

  return (
    <UnreadDealsContext.Provider value={value}>
      {children}
    </UnreadDealsContext.Provider>
  );
};
