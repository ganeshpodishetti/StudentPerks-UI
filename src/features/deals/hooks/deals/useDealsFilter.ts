import { Deal } from '@/shared/types/entities/deal';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface SortOption {
  label: string;
  value: keyof Deal | null;
  direction: 'asc' | 'desc';
}

interface UseDealsFilterReturn {
  filteredDeals: Deal[];
  searchTerm: string;
  selectedCategory: string;
  selectedStore: string;
  activeSort: SortOption;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedStore: (store: string) => void;
  setActiveSort: (sort: SortOption) => void;
}

const sortOptions: SortOption[] = [
  { label: 'Newest First', value: 'startDate', direction: 'desc' },
  { label: 'Oldest First', value: 'startDate', direction: 'asc' },
  { label: 'Alphabetical (A-Z)', value: 'title', direction: 'asc' },
  { label: 'Alphabetical (Z-A)', value: 'title', direction: 'desc' },
  { label: 'Store Name (A-Z)', value: 'storeName', direction: 'asc' },
  { label: 'Store Name (Z-A)', value: 'storeName', direction: 'desc' },
];

interface UseDealsFilterProps {
  deals: Deal[];
  initialCategory?: string;
  initialStore?: string;
}

export const useDealsFilter = ({
  deals,
  initialCategory,
  initialStore,
}: UseDealsFilterProps): UseDealsFilterReturn => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedStore, setSelectedStore] = useState<string>(initialStore || 'All');
  const [activeSort, setActiveSort] = useState<SortOption>(sortOptions[0]);

  // Update selectedCategory when initialCategory prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Update selectedStore when initialStore prop changes
  useEffect(() => {
    if (initialStore) {
      setSelectedStore(initialStore);
    }
  }, [initialStore]);

  // Memoize filter functions for better performance
  const filterByActive = useCallback((deal: Deal) => deal.isActive, []);
  
  const filterByCategory = useCallback((deal: Deal) => {
    if (!selectedCategory || selectedCategory === 'All') return true;
    return deal.categoryName.toLowerCase() === selectedCategory.toLowerCase();
  }, [selectedCategory]);
  
  const filterByStore = useCallback((deal: Deal) => {
    if (!selectedStore || selectedStore === 'All') return true;
    return deal.storeName.toLowerCase() === selectedStore.toLowerCase();
  }, [selectedStore]);
  
  const filterBySearchTerm = useCallback((deal: Deal) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      deal.title.toLowerCase().includes(term) ||
      deal.description.toLowerCase().includes(term) ||
      deal.storeName.toLowerCase().includes(term) ||
      deal.categoryName.toLowerCase().includes(term) ||
      (deal.promo && deal.promo.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  const sortDeals = useCallback((dealsToSort: Deal[]) => {
    if (!activeSort.value) return dealsToSort;
    
    return [...dealsToSort].sort((a, b) => {
      const valueA = a[activeSort.value as keyof Deal];
      const valueB = b[activeSort.value as keyof Deal];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return activeSort.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      // Handle date sorting for startDate and endDate fields
      if (activeSort.value === 'startDate' || activeSort.value === 'endDate') {
        const dateA = new Date(valueA as string);
        const dateB = new Date(valueB as string);
        const comparison = dateA.getTime() - dateB.getTime();
        return activeSort.direction === 'asc' ? comparison : -comparison;
      }
      
      // Handle numeric sorting if needed
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return activeSort.direction === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      return 0;
    });
  }, [activeSort]);

  const filteredDeals = useMemo(() => {
    // Ensure deals is an array, default to empty array if not
    if (!Array.isArray(deals)) {
      return [];
    }

    // Apply all filters in sequence for better performance
    const filtered = deals
      .filter(filterByActive)
      .filter(filterByCategory)
      .filter(filterByStore)
      .filter(filterBySearchTerm);

    // Apply sorting
    return sortDeals(filtered);
  }, [deals, filterByActive, filterByCategory, filterByStore, filterBySearchTerm, sortDeals]);

  return {
    filteredDeals,
    searchTerm,
    selectedCategory,
    selectedStore,
    activeSort,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStore,
    setActiveSort,
  };
};

export { sortOptions };
