"use client";
import { useDealsData } from "@/features/deals/hooks/deals/useDealsData";
import {
    sortOptions,
    useDealsFilter
} from "@/features/deals/hooks/deals/useDealsFilter";
import { useDealsLoadMore } from "@/features/deals/hooks/deals/useDealsLoadMore";
import { dealService } from "@/features/deals/services/dealService";
import { Button } from "@/shared/components/ui/button";
import { errorReportingService } from '@/shared/services/errorReportingService';
import type { FeedType } from '@/shared/types/api/responses';
import { Deal } from "@/shared/types/entities/deal";
import React, { useCallback, useEffect, useState } from "react";
import HeroSearchSection from "../../search/HeroSearchSection/HeroSearchSection";
import DealSkeleton from "../DealSkeleton/DealSkeleton";
import { DealsFilters } from "./DealsFilters";
import { DealsGrid } from "./DealsGrid";
import { DealsLoadMore } from "./DealsLoadMore";

interface DealsContainerProps {
  initialCategory?: string;
  initialStore?: string;
  initialSearchQuery?: string;
  showHeroSection?: boolean;
  excludeUniversitySpecific?: boolean;
  showFilters?: boolean;
  useFeedApis?: boolean;
  showLoadMore?: boolean;
  feedType?: FeedType;
  showStatusHeader?: boolean;
}

export const DealsContainer: React.FC<DealsContainerProps> = ({
  initialCategory,
  initialStore,
  initialSearchQuery = '',
  showHeroSection = true,
  excludeUniversitySpecific = false,
  showFilters = true,
  useFeedApis = false,
  showLoadMore = true,
  feedType,
  showStatusHeader = true,
}) => {
  const { deals, loading, error, refetch, hasMore: serverHasMore, isFetchingNextPage, fetchNextPage } = useDealsData({ useFeedApis, feedType });
  const [searchResults, setSearchResults] = useState<Deal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialSearchQuery);
  
  // Track previous search query to avoid unnecessary calls
  const prevSearchQueryRef = React.useRef('');
  
  // Trigger search when initialSearchQuery changes (from URL params)
  useEffect(() => {
    // Only trigger if query actually changed and is not empty
    if (initialSearchQuery && prevSearchQueryRef.current !== initialSearchQuery) {
      prevSearchQueryRef.current = initialSearchQuery;
      
      // Direct API call instead of using React Query hook
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

  const {
    filteredDeals,
    searchTerm,
    selectedCategory,
    selectedStore,
    activeSort,
    setActiveSort,
  } = useDealsFilter({
    deals,
    initialCategory,
    initialStore,
    excludeUniversitySpecific,
  });

  // Use search results if available, otherwise use filtered deals
  const dealsToDisplay = hasSearched ? searchResults : filteredDeals;

  const { displayedDeals, hasMore, isLoadingMore, loadMore } = useDealsLoadMore(
    {
      deals: dealsToDisplay,
      hasMore: serverHasMore,
      isFetchingNextPage,
      fetchNextPage,
    }
  );

  // Handle search results
  const handleSearchResults = useCallback(
    (searchDeals: Deal[], loading: boolean, searched: boolean) => {
      setSearchResults(searchDeals);
      setIsSearching(loading);
      setHasSearched(searched);
    },
    []
  );

  const generateEmptyMessage = () => {
    if (hasSearched) {
      return searchResults.length === 0
        ? "No deals found matching your search criteria."
        : "";
    }

    if (
      searchTerm ||
      (selectedCategory && selectedCategory !== "All") ||
      (selectedStore && selectedStore !== "All")
    ) {
      return `No deals found${
        selectedCategory && selectedCategory !== "All"
          ? ` in ${selectedCategory}`
          : ""
      }${
        selectedStore && selectedStore !== "All" ? ` from ${selectedStore}` : ""
      }${searchTerm ? ` matching "${searchTerm}"` : ""}`;
    }
    return "No deals available";
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-950">
        {showStatusHeader && (
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-brand-900 dark:text-brand-100">
              Student Deals
            </h1>
            <p className="mt-2 text-sm text-brand-700 dark:text-brand-300">
              Loading the best offers for students...
            </p>
          </div>
        )}
        <DealSkeleton count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-neutral-950">
        {showStatusHeader && (
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-brand-900 dark:text-brand-100">
              Student Deals
            </h1>
            <p className="mt-2 text-sm text-brand-700 dark:text-brand-300">
              Exclusive offers for students
            </p>
          </div>
        )}
        <div className="text-center py-16">
          <p className="text-brand-700 dark:text-brand-300 font-medium mb-4">
            {error}
          </p>
          <Button
            onClick={refetch}
            className="bg-brand-900 hover:bg-brand-900 dark:bg-brand-100 dark:text-black dark:hover:bg-brand-300"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950">
      {/* Hero Section - only show if showHeroSection is true */}
      {showHeroSection && (
        <div className="mb-6 text-center max-w-4xl mx-auto px-4">
          <h1 className="md:text-3xl font-extrabold text-brand-900 dark:text-brand-100 mb-6 leading-tight">
            Unlock Exclusive Student Discounts & Deals
          </h1>
          {/* <p className="md:text-lg text-brand-700 dark:text-brand-300 mb-6 leading-relaxed max-w-3xl mx-auto font-medium">
            Discover thousands of verified student perks, discounts, and special offers from top brands.
            </p> */}
        </div>
      )}

      {/* Hero Search Section - only show if showHeroSection is true */}
      {showHeroSection && (
        <HeroSearchSection
          onSearchResults={handleSearchResults}
          placeholder="Search for deals, stores, or categories..."
        />
      )}

      {/* Filters and Sort - only show if not using search and showFilters is true */}
      {!hasSearched && showFilters && (
        <DealsFilters
          sortOptions={sortOptions}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          totalDeals={deals.length}
          filteredDeals={filteredDeals.length}
          selectedCategory={selectedCategory}
          selectedStore={selectedStore}
          searchTerm={searchTerm}
        />
      )}

      {/* Search Results Header */}
      {hasSearched && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-brand-900 dark:text-brand-100">
            {isSearching
              ? "Searching..."
              : `Found ${searchResults.length} deals`}
          </h2>
        </div>
      )}

      {/* Deals Grid */}
      <DealsGrid
        deals={displayedDeals}
        loading={isSearching}
        emptyMessage={generateEmptyMessage()}
      />

      {/* Load More - only show if not using search */}
      {!hasSearched && showLoadMore && (
        <DealsLoadMore
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
          totalDeals={filteredDeals.length}
        />
      )}
    </div>
  );
};
