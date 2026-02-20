import { Deal } from '@/shared/types/entities/deal';

interface UseDealsLoadMoreReturn {
  displayedDeals: Deal[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  reset: () => void;
}

interface UseDealsLoadMoreProps {
  deals: Deal[];
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  pageSize?: number; // kept for backward compatibility but not used for server pagination
}

export const useDealsLoadMore = ({
  deals,
  hasMore = false,
  isFetchingNextPage = false,
  fetchNextPage,
}: UseDealsLoadMoreProps): UseDealsLoadMoreReturn => {

  const loadMore = () => {
    if (hasMore && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  };

  const reset = () => {
    // Reset is handled by refetching the query
  };

  return {
    displayedDeals: deals,
    hasMore,
    isLoadingMore: isFetchingNextPage,
    loadMore,
    reset,
  };
};
