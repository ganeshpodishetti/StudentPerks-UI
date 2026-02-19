// Store Deals Page
'use client'
import DealCard from '@/features/deals/components/display/DealCard/DealCard';
import { useDealsByStoreQuery } from '@/features/deals/hooks/useDealsQuery';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const StoreDealsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const storeName = decodeURIComponent(params?.storeName as string || '');

  // Get deals for this store
  const { 
    data: deals = [], 
    isLoading, 
    error 
  } = useDealsByStoreQuery(storeName);

  if (isLoading) {
    return (
      <div className="py-12 bg-background dark:bg-background transition-colors">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-8">{storeName} Deals</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/40">
                  <Skeleton className="h-8 w-32 mb-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                  <Skeleton className="h-6 w-full mb-2 bg-neutral-200 dark:bg-neutral-700 rounded" />
                  <Skeleton className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Button
          variant="outline"
          onClick={() => router.push('/stores')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stores
        </Button>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">Failed to load deals for this store</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background dark:bg-background transition-colors">
      <div className="container mx-auto p-4" style={{ maxWidth: '80%'}}>
        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => router.push('/stores')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stores
        </Button>

        {/* Store header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {storeName}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            {deals.length} {deals.length === 1 ? 'deal' : 'deals'} available
          </p>
        </div>

        {/* Deals grid */}
        {deals.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              No Deals Found
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              There are currently no deals available for {storeName}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} showCategoryAndStore={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDealsPage;
