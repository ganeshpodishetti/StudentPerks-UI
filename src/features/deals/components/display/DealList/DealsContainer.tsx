'use client'
import { Button } from "@/shared/components/ui/button";
import { useDealsData } from '@/features/deals/hooks/deals/useDealsData';
import { sortOptions, useDealsFilter } from '@/features/deals/hooks/deals/useDealsFilter';
import { useDealsLoadMore } from '@/features/deals/hooks/deals/useDealsLoadMore';
import React from "react";
import DealSkeleton from '../DealSkeleton/DealSkeleton';
import HeroSearchSection from '../../search/HeroSearchSection/HeroSearchSection';
import { DealsFilters } from './DealsFilters';
import { DealsGrid } from './DealsGrid';
import { DealsLoadMore } from './DealsLoadMore';

interface DealsContainerProps {
  initialCategory?: string;
  initialStore?: string;
  showHeroSection?: boolean;
  excludeUniversitySpecific?: boolean;
}

export const DealsContainer: React.FC<DealsContainerProps> = ({
  initialCategory,
  initialStore,
  showHeroSection = true,
  excludeUniversitySpecific = false,
}) => {
  const { deals, loading, error, refetch } = useDealsData();

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

  const {
    displayedDeals,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useDealsLoadMore({
    deals: filteredDeals,
    pageSize: 12,
  });

  const generateEmptyMessage = () => {
    if (searchTerm || (selectedCategory && selectedCategory !== 'All') || (selectedStore && selectedStore !== 'All')) {
      return `No deals found${selectedCategory && selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}${selectedStore && selectedStore !== 'All' ? ` from ${selectedStore}` : ''}${searchTerm ? ` matching "${searchTerm}"` : ''}`;
    }
    return 'No deals available';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-950">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Student Deals</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Loading the best offers for students...</p>
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Student Deals</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Exclusive offers for students</p>
        </div>
        <div className="text-center py-16">
          <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-4">{error}</p>
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
              Unlock Exclusive Student 
              <span className="bg-gradient-to-r from-neutral-400 to-neutral-500 bg-clip-text text-transparent"> Discounts & Deals</span>
            </h1>
            {/* <p className="md:text-lg text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed max-w-3xl mx-auto font-medium">
            Discover thousands of verified student perks, discounts, and special offers from top brands.
            </p> */}
          </div>
        )}
        
        {/* Hero Search Section - only show if showHeroSection is true */}
        {showHeroSection && (
          <HeroSearchSection 
            onSearch={setSearchTerm}
            onCategorySelect={setSelectedCategory}
            searchTerm={searchTerm}
          />
        )}
        
        {/* Filters and Sort */}
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
        
        {/* Deals Grid */}
        <DealsGrid
          deals={displayedDeals}
          loading={false}
          emptyMessage={generateEmptyMessage()}
        />
        
        {/* Load More */}
        <DealsLoadMore
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
          totalDeals={filteredDeals.length}
          displayedCount={displayedDeals.length}
        />
      </div>
  );
};
