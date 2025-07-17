import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface DealsLoadMoreProps {
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  totalDeals: number;
  displayedCount: number;
}

export const DealsLoadMore: React.FC<DealsLoadMoreProps> = ({
  hasMore,
  isLoadingMore,
  onLoadMore,
  totalDeals,
  displayedCount,
}) => {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          You&apos;ve seen all {totalDeals} deal{totalDeals !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      {/* <div className="mb-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Showing {displayedCount} of {totalDeals} deals
        </p>
      </div> */}
      
      <Button
        onClick={onLoadMore}
        disabled={isLoadingMore}
        variant="outline"
        size="lg"
        className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-8 py-3 min-w-[160px] transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
      >
        {isLoadingMore ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
                //   `Load More Deals (${totalDeals - displayedCount} remaining)`
                `Load More Deals`
        )}
      </Button>
    </div>
  );
};
