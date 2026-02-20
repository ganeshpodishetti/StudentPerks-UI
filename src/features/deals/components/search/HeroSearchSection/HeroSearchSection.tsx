'use client'
import { useSearchDeals } from "@/features/deals/hooks/useSearchDeals";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, X } from "lucide-react";
import React, { useCallback, useMemo, useRef, useState } from "react";

interface HeroSearchSectionProps {
  onSearchResults?: (
    deals: any[],
    isLoading: boolean,
    hasSearched: boolean
  ) => void;
  placeholder?: string;
  className?: string;
  defaultFilters?: {
    category?: string;
    store?: string;
    university?: string;
    isActive?: boolean;
  };
}

const HeroSearchSection: React.FC<HeroSearchSectionProps> = ({
  onSearchResults,
  placeholder = "Search for deals, stores, or categories...",
  className = "",
  defaultFilters = {},
}) => {
  const [query, setQuery] = useState("");
  const { searchDeals, clearSearch, deals, isLoading, hasSearched } =
    useSearchDeals();

  // Use ref to store the latest callback without causing re-renders
  const onSearchResultsRef = useRef(onSearchResults);
  onSearchResultsRef.current = onSearchResults;

  // Use ref to track when we last notified to prevent duplicate notifications
  const lastNotificationRef = useRef<{
    isLoading: boolean;
    hasSearched: boolean;
  }>({
    isLoading: false,
    hasSearched: false,
  });

  // Memoize defaultFilters to prevent recreating the object on every render
  const memoizedDefaultFilters = useMemo(
    () => ({
      category: defaultFilters.category,
      store: defaultFilters.store,
      university: defaultFilters.university,
      isActive: defaultFilters.isActive,
    }),
    [
      defaultFilters.category,
      defaultFilters.store,
      defaultFilters.university,
      defaultFilters.isActive,
    ]
  );

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim();

      // Don't search if the query is empty
      if (!trimmedQuery) {
        return;
      }

      const searchParams = {
        ...memoizedDefaultFilters,
        query: trimmedQuery,
        isActive: memoizedDefaultFilters.isActive ?? true, // Default to active deals only
      };

      // Remove undefined values
      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key as keyof typeof searchParams] === undefined) {
          delete searchParams[key as keyof typeof searchParams];
        }
      });

      searchDeals(searchParams);
    },
    [searchDeals, memoizedDefaultFilters]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    clearSearch();
    // Notify parent immediately when clearing
    if (onSearchResultsRef.current) {
      onSearchResultsRef.current([], false, false);
    }
  };

  // Only notify parent when search state transitions (loading -> not loading)
  React.useEffect(() => {
    if (onSearchResultsRef.current && hasSearched) {
      const currentNotification = { isLoading, hasSearched };

      // Only notify if this is a new search completion (was loading, now not loading)
      if (
        lastNotificationRef.current.isLoading !== isLoading ||
        lastNotificationRef.current.hasSearched !== hasSearched
      ) {
        onSearchResultsRef.current(deals, isLoading, hasSearched);
        lastNotificationRef.current = currentNotification;
      }
    }
  }, [isLoading, hasSearched, deals]);

  return (
    <div className={`mb-8 ${className}`}>
      <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-20 h-12 text-base bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full shadow-md backdrop-blur focus:ring-2 focus:ring-blue-400 dark:focus:ring-neutral-400 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder:text-neutral-500"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeroSearchSection;
