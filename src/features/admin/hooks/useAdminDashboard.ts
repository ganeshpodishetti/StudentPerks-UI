import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useUserDealsQuery } from '@/features/deals/hooks/useDealsQuery';

export const useAdminDashboard = () => {
  const { user } = useAuth();

  // React Query hooks - fetch user-specific deals
  const { data: deals = [], isLoading } = useUserDealsQuery();

  return {
    deals,
    isLoading,
    user,
  };
};
