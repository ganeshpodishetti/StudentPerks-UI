import { categoryService, CreateCategoryRequest, UpdateCategoryRequest } from '@/features/categories/services/categoryService';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys factory for better cache management
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Legacy export for backward compatibility
export const CATEGORIES_QUERY_KEY = categoryKeys.all[0];

// Get all categories
export const useCategoriesQuery = () => {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
    meta: {
      onError: handleApiError,
    },
  });
};

// Get single category
export const useCategoryQuery = (id: string) => {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: handleApiError,
    },
  });
};

// Create category mutation
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      showSuccess('Category created successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Update category mutation
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) => 
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      showSuccess('Category updated successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Delete category mutation
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      showSuccess('Category deleted successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};
