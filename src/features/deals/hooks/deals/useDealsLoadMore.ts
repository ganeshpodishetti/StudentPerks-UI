import { Deal } from '@/shared/types/entities/deal';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseDealsLoadMoreReturn {
  displayedDeals: Deal[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  reset: () => void;
}

interface UseDealsLoadMoreProps {
  deals: Deal[];
  pageSize?: number;
}

export const useDealsLoadMore = ({
  deals,
  pageSize = 12,
}: UseDealsLoadMoreProps): UseDealsLoadMoreReturn => {
  const [loadedCount, setLoadedCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const displayedDeals = useMemo(() => {
    return deals.slice(0, loadedCount);
  }, [deals, loadedCount]);

  const hasMore = useMemo(() => {
    return loadedCount < deals.length;
  }, [loadedCount, deals.length]);

  // Reset when deals array length changes (indicating filter change)
  useEffect(() => {
    setLoadedCount(pageSize);
  }, [deals.length, pageSize]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        const newCount = Math.min(loadedCount + pageSize, deals.length);
        setLoadedCount(newCount);
        setIsLoadingMore(false);
      }, 500);
    }
  }, [hasMore, isLoadingMore, loadedCount, pageSize, deals.length]);

  const reset = useCallback(() => {
    setLoadedCount(pageSize);
    setIsLoadingMore(false);
  }, [pageSize]);

  return {
    displayedDeals,
    hasMore,
    isLoadingMore,
    loadMore,
    reset,
  };
};
