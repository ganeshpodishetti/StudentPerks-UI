"use client";
import { useDealsData } from "@/features/deals/hooks/deals/useDealsData";
import {
    sortOptions,
    useDealsFilter,
} from "@/features/deals/hooks/deals/useDealsFilter";
import { useDealsLoadMore } from "@/features/deals/hooks/deals/useDealsLoadMore";
import { Button } from "@/shared/components/ui/button";
import { Deal } from "@/shared/types/entities/deal";
import React, { useCallback, useState } from "react";
import HeroSearchSection from "../../search/HeroSearchSection/HeroSearchSection";
import DealSkeleton from "../DealSkeleton/DealSkeleton";
import { DealsFilters } from "./DealsFilters";
import { DealsGrid } from "./DealsGrid";
import { DealsLoadMore } from "./DealsLoadMore";

interface DealsContainerProps {
  initialCategory?: string;
  initialStore?: string;
  showHeroSection?: boolean;
  excludeUniversitySpecific?: boolean;
  showFilters?: boolean;
}

export const DealsContainer: React.FC<DealsContainerProps> = ({
  initialCategory,
  initialStore,
  showHeroSection = true,
  excludeUniversitySpecific = false,
  showFilters = true,
}) => {
  const { deals, loading, error, refetch, hasMore: serverHasMore, isFetchingNextPage, fetchNextPage } = useDealsData();
  const [searchResults, setSearchResults] = useState<Deal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Memoize the default filters to prevent recreating the object
  const defaultSearchFilters = React.useMemo(() => ({ isActive: true }), []);

  const {
    filteredDeals,
    searchTerm,
    selectedCategory,
    selectedStore,
    activeSort,
    setSearchTerm,
    setSelectedCategory,
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
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Student Deals
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Loading the best offers for students...
          </p>
        </div>
        <DealSkeleton count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-neutral-950">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Student Deals
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Exclusive offers for students
          </p>
        </div>
        <div className="text-center py-16">
          <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-4">
            {error}
          </p>
          <Button
            onClick={refetch}
            className="bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
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
          <h1 className="md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-300 mb-6 leading-tight">
            Unlock Exclusive Student Discounts & Deals
          </h1>
          {/* <p className="md:text-lg text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed max-w-3xl mx-auto font-medium">
            Discover thousands of verified student perks, discounts, and special offers from top brands.
            </p> */}
        </div>
      )}

      {/* Hero Search Section - only show if showHeroSection is true */}
      {showHeroSection && (
        <HeroSearchSection
          onSearchResults={handleSearchResults}
          defaultFilters={defaultSearchFilters}
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
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
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
      {!hasSearched && (
        <DealsLoadMore
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
          totalDeals={filteredDeals.length}
          displayedCount={displayedDeals.length}
        />
      )}
    </div>
  );
};
