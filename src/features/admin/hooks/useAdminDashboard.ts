import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useUserDealsQuery } from '@/features/deals/hooks/useDealsQuery';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';

export const useAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { showError, showSuccess } = useErrorHandler();

  // React Query hooks - fetch user-specific deals
  const { data: deals = [], isLoading } = useUserDealsQuery();

  // Test connectivity function
  const testConnectivity = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5254';
      // Test 1: Basic API connection
      const response = await fetch(API_BASE_URL + '/api/deals', {
        credentials: 'include',
        method: 'GET'
      });
      if (response.status === 401) {
        showError("You need to be logged in to access admin features", "Authentication Issue");
        return;
      }
      if (response.status === 200) {
        showSuccess("Successfully connected to backend API", "Connectivity Test Passed");
      } else {
        showError(`Unexpected response status: ${response.status}`, "Connectivity Issue");
      }
    } catch (error: any) {
      showError(error.message || "Could not connect to backend API", "Connection Failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    deals,
    isLoading,
    user,
    handleLogout,
    testConnectivity
  };
};
