import { dealService } from '@/features/deals/services/dealService';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';
import { CursorPaginatedResponse } from '@/shared/types';
import { Deal } from '@/shared/types/entities/deal';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys for caching
export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  list: (filters: string) => [...dealKeys.lists(), { filters }] as const,
  details: () => [...dealKeys.all, 'detail'] as const,
  detail: (id: string) => [...dealKeys.details(), id] as const,
  byCategory: (category: string) => [...dealKeys.all, 'category', category] as const,
  byStore: (store: string) => [...dealKeys.all, 'store', store] as const,
  byUniversity: (university: string) => [...dealKeys.all, 'university', university] as const,
  userDeals: () => [...dealKeys.all, 'user'] as const,
  infinite: () => [...dealKeys.all, 'infinite'] as const,
};

// Fetch all deals with cursor-based pagination
export const useDealsInfiniteQuery = () => {
  const { handleApiError } = useErrorHandler();
  
  return useInfiniteQuery<CursorPaginatedResponse<Deal>, Error>({
    queryKey: dealKeys.infinite(),
    queryFn: ({ pageParam }) => dealService.getDeals({ cursor: pageParam as string | null }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore && lastPage.nextCursor && lastPage.nextCursor !== '') {
        return lastPage.nextCursor;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    meta: {
      onError: handleApiError,
    },
  });
};

// Legacy hook for backward compatibility (fetches first page only)
export const useDealsQuery = () => {
  const { handleApiError } = useErrorHandler();
  
  return useQuery({
    queryKey: dealKeys.lists(),
    queryFn: async () => {
      const response = await dealService.getDeals();
      return response.items;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    meta: {
      onError: handleApiError,
    },
  });
};

// Fetch deals by category
export const useDealsByCategoryQuery = (categoryName: string) => {
  const { handleApiError } = useErrorHandler();
  
  return useQuery({
    queryKey: dealKeys.byCategory(categoryName),
    queryFn: () => dealService.getDealsByCategory(categoryName),
    enabled: !!categoryName && categoryName !== 'All',
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: handleApiError,
    },
  });
};

// Fetch deals by store
export const useDealsByStoreQuery = (storeName: string) => {
  const { handleApiError } = useErrorHandler();
  
  return useQuery({
    queryKey: dealKeys.byStore(storeName),
    queryFn: () => dealService.getDealsByStore(storeName),
    enabled: !!storeName && storeName !== 'All',
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: handleApiError,
    },
  });
};

// Fetch deals by university
export const useDealsByUniversityQuery = (universityName: string) => {
  const { handleApiError } = useErrorHandler();
  
  return useQuery({
    queryKey: dealKeys.byUniversity(universityName),
    queryFn: () => dealService.getDealsByUniversity(universityName),
    enabled: !!universityName && universityName !== 'All',
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: handleApiError,
    },
  });
};

// Fetch single deal
export const useDealQuery = (id: string) => {
  const { handleApiError } = useErrorHandler();
  
  return useQuery({
    queryKey: dealKeys.detail(id),
    queryFn: () => dealService.getDeal(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: handleApiError,
    },
  });
};

// Fetch user-related deals (authenticated) - for admin page
export const useUserDealsQuery = () => {
  const { handleApiError } = useErrorHandler();
  
  return useQuery({
    queryKey: dealKeys.userDeals(),
    queryFn: () => dealService.getUserDeals(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    meta: {
      onError: handleApiError,
    },
  });
};

// Create deal mutation
export const useCreateDealMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, handleApiError } = useErrorHandler();
  
  return useMutation({
    mutationFn: dealService.createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all });
      showSuccess('Deal created successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Update deal mutation
export const useUpdateDealMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, handleApiError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      dealService.updateDeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all });
      showSuccess('Deal updated successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Delete deal mutation
export const useDeleteDealMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, handleApiError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (id: string) => dealService.deleteDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all });
      showSuccess('Deal deleted successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};
