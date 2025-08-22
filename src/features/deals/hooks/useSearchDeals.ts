import { Deal } from '@/shared/types/entities/deal';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { dealService } from '../services/dealService';

interface SearchParams {
  query?: string;
  category?: string;
  store?: string;
  university?: string;
  isActive?: boolean;
}

interface UseSearchDealsResult {
  deals: Deal[];
  isLoading: boolean;
  error: Error | null;
  searchDeals: (params: SearchParams) => void;
  clearSearch: () => void;
  isSearching: boolean;
  hasSearched: boolean;
}

export const useSearchDeals = (): UseSearchDealsResult => {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);

  const {
    data: deals = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['deals', 'search', searchParams],
    queryFn: () => {
      return dealService.searchDeals(searchParams);
    },
    enabled: false, // Only run when explicitly triggered
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Trigger refetch when searchParams change and we should search
  useEffect(() => {
    if (shouldSearch && hasSearched) {
      refetch();
      setShouldSearch(false);
    }
  }, [searchParams, shouldSearch, hasSearched, refetch]);

  const searchDeals = useCallback((params: SearchParams) => {
    setSearchParams(params);
    setHasSearched(true);
    setShouldSearch(true);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchParams({});
    setHasSearched(false);
  }, []);

  return {
    deals,
    isLoading,
    error: error as Error | null,
    searchDeals,
    clearSearch,
    isSearching: isLoading,
    hasSearched
  };
};
