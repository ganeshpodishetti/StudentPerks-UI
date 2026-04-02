"use client";

import { dealService } from "@/features/deals/services/dealService";
import { errorReportingService } from '@/shared/services/errorReportingService';
import { Deal } from "@/shared/types/entities/deal";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseDealsSearchProps {
  initialSearchQuery?: string;
}

export function useDealsSearch({ initialSearchQuery = '' }: UseDealsSearchProps) {
  const [searchResults, setSearchResults] = useState<Deal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialSearchQuery);
  
  // Track previous search query to avoid unnecessary calls
  const prevSearchQueryRef = useRef('');
  
  // Trigger search when initialSearchQuery changes (from URL params)
  useEffect(() => {
    // Only trigger if query actually changed and is not empty
    if (initialSearchQuery && prevSearchQueryRef.current !== initialSearchQuery) {
      prevSearchQueryRef.current = initialSearchQuery;
      
      setIsSearching(true);
      dealService.searchDeals({ query: initialSearchQuery })
        .then(results => {
          setSearchResults(results);
          setIsSearching(false);
          setHasSearched(true);
        })
        .catch(err => {
          errorReportingService.reportNetworkError(err, {
            feature: 'deals',
            action: 'searchDeals',
            query: initialSearchQuery,
          });
          setIsSearching(false);
          setSearchResults([]);
          setHasSearched(true);
        });
    } else if (!initialSearchQuery) {
      // Clear search results if no query
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [initialSearchQuery]);

  // Handle search results from manual search (e.g. HeroSearchSection)
  const handleSearchResults = useCallback(
    (searchDeals: Deal[], loading: boolean, searched: boolean) => {
      setSearchResults(searchDeals);
      setIsSearching(loading);
      setHasSearched(searched);
    },
    []
  );

  return {
    searchResults,
    isSearching,
    hasSearched,
    handleSearchResults,
  };
}
