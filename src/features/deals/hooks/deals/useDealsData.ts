import { useDealsInfiniteQuery } from '@/features/deals/hooks/useDealsQuery';
import { Deal } from '@/shared/types/entities/deal';
import { useMemo } from 'react';

interface UseDealsDataReturn {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useDealsData = (): UseDealsDataReturn => {
  const { 
    data, 
    isLoading, 
    error, 
    refetch, 
    hasNextPage, 
    isFetchingNextPage, 
    fetchNextPage 
  } = useDealsInfiniteQuery();

  // Flatten all pages into a single array of deals
  const deals = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.items);
  }, [data?.pages]);

  return {
    deals,
    loading: isLoading,
    error: error ? 'Failed to load deals. Please try again later.' : null,
    refetch: async () => {
      await refetch();
    },
    hasMore: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  };
};
