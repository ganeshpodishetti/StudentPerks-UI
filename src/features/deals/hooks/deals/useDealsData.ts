import { useDealsQuery } from '@/features/deals/hooks/useDealsQuery';
import { Deal } from '@/shared/types/entities/deal';

interface UseDealsDataReturn {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDealsData = (): UseDealsDataReturn => {
  const { data: deals = [], isLoading, error, refetch } = useDealsQuery();

  return {
    deals,
    loading: isLoading,
    error: error ? 'Failed to load deals. Please try again later.' : null,
    refetch: async () => {
      await refetch();
    },
  };
};
