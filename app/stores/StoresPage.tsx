// Migrated from src/components/pages/StoresPage.tsx
'use client'
import { Store as StoreType, fetchStores } from '@/features/stores/services/storeService';
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useToast } from "@/shared/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const StoresPage: React.FC = () => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadStores = async () => {
      setLoading(true);
      try {
        const storesData = await fetchStores();
        setStores(storesData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading stores:", err);
        setError("Failed to load stores. Please try again later.");
        setLoading(false);
        
        toast({
          title: "Error",
          description: "Failed to load stores. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadStores();
  }, [toast]);

  const handleStoreSelect = (storeName: string) => {
    router.push(`/stores/${encodeURIComponent(storeName)}/deals`);
  };

  if (loading) {
    return (
      <div className="py-8 bg-background dark:bg-background transition-colors">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-3 sm:h-4 w-3/4 mb-1" />
                      <Skeleton className="h-2 sm:h-3 w-1/2 hidden sm:block" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md">
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {stores.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Stores Found</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          {stores.map((store) => (
            <Card
              key={store.id}
              onClick={() => handleStoreSelect(store.name)}
              className="group hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 cursor-pointer hover:border-neutral-200 dark:hover:border-neutral-700"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800 shrink-0">
                  <span className="text-neutral-500 font-semibold text-xs sm:text-sm">
                    {store.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-300 leading-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-400 truncate">
                    {store.name}
                  </h3>
                  {store.description && (
                    <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 truncate hidden sm:block">
                      {store.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoresPage;
