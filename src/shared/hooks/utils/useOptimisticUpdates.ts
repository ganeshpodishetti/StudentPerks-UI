import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Custom hook for optimistic updates with rollback capability
 * Provides a consistent pattern for updating cache optimistically
 */
export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback(
    async <TData, TVariables>(
      queryKey: unknown[],
      mutationFn: (variables: TVariables) => Promise<TData>,
      variables: TVariables,
      updateFn: (oldData: TData | undefined, variables: TVariables) => TData | undefined
    ) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<TData>(queryKey, (old) => updateFn(old, variables));

      try {
        // Perform the actual mutation
        const result = await mutationFn(variables);
        
        // Update with the real result
        queryClient.setQueryData<TData>(queryKey, result);
        
        return result;
      } catch (error) {
        // Rollback on error
        queryClient.setQueryData<TData>(queryKey, previousData);
        throw error;
      }
    },
    [queryClient]
  );

  const invalidateQueries = useCallback(
    (queryKey: unknown[]) => {
      return queryClient.invalidateQueries({ queryKey });
    },
    [queryClient]
  );

  const setQueryData = useCallback(
    <TData>(queryKey: unknown[], data: TData | ((old: TData | undefined) => TData | undefined)) => {
      return queryClient.setQueryData<TData>(queryKey, data);
    },
    [queryClient]
  );

  const getQueryData = useCallback(
    <TData>(queryKey: unknown[]) => {
      return queryClient.getQueryData<TData>(queryKey);
    },
    [queryClient]
  );

  return {
    optimisticUpdate,
    invalidateQueries,
    setQueryData,
    getQueryData,
  };
};