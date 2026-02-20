import { CreateStoreRequest, storeService, UpdateStoreRequest } from '@/features/stores/services/storeService';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys factory for better cache management
export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  list: (filters?: string) => [...storeKeys.lists(), { filters }] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
};

// Legacy export for backward compatibility
export const STORES_QUERY_KEY = storeKeys.all[0];

// Get all stores
export const useStoresQuery = () => {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: storeKeys.lists(),
    queryFn: () => storeService.getStores(),
    staleTime: 10 * 60 * 1000, // 10 minutes - stores change less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
    meta: {
      onError: handleApiError,
    },
  });
};

// Get single store
export const useStoreQuery = (id: string) => {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => storeService.getStore(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: handleApiError,
    },
  });
};

// Create store mutation
export const useCreateStoreMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: (data: CreateStoreRequest) => storeService.createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      showSuccess('Store created successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Update store mutation
export const useUpdateStoreMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreRequest }) => 
      storeService.updateStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      showSuccess('Store updated successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Delete store mutation
export const useDeleteStoreMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: (id: string) => storeService.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      showSuccess('Store deleted successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};
