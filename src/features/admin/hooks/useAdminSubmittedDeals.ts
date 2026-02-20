import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useUnreadDealsCount } from '@/features/deals/hooks/useUnreadDealsCount';
import { submittedDealService } from '@/features/deals/services/submittedDealService';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';
import { SubmittedDeal } from '@/shared/types/entities/submittedDeal';
import { useCallback, useEffect, useState } from 'react';

export const useAdminSubmittedDeals = () => {
  const [deals, setDeals] = useState<SubmittedDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { showError } = useErrorHandler();
  const { updateCount } = useUnreadDealsCount();

  const loadDeals = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await submittedDealService.getSubmittedDeals();
      setDeals(data);
      // Update global unread count
      const unreadCount = data.filter(deal => !deal.markedAsRead).length;
      updateCount(unreadCount);
    } catch (error: any) {
      // Handle 403 Forbidden - user is not authorized
      if (error.response?.status === 403) {
        showError('You do not have permission to access this resource. Please log in as an admin.');
        // Redirect to login after a short delay
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }, 2000);
      } else {
        showError('Failed to load submitted deals');
      }
    } finally {
      setIsLoading(false);
    }
  }, [showError, updateCount]);

  // Only call loadDeals once on mount to avoid repeated API calls
  useEffect(() => {
    loadDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      await submittedDealService.markAsRead(id, isRead);
      // Update the local state
      setDeals(prev => {
        const updatedDeals = prev.map(deal => 
          deal.id === id ? { ...deal, markedAsRead: isRead } : deal
        );
        // Update global unread count
        const unreadCount = updatedDeals.filter(deal => !deal.markedAsRead).length;
        updateCount(unreadCount);
        return updatedDeals;
      });
    } catch (_error) {
      showError('Failed to update deal status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submitted deal?')) {
      return;
    }

    try {
      await submittedDealService.deleteSubmittedDeal(id);
      // Remove from local state and update unread count
      setDeals(prev => {
        const updatedDeals = prev.filter(deal => deal.id !== id);
        // Update global unread count
        const unreadCount = updatedDeals.filter(deal => !deal.markedAsRead).length;
        updateCount(unreadCount);
        return updatedDeals;
      });
    } catch (_error) {
      showError('Failed to delete submitted deal');
    }
  };

  // Get stats
  const stats = {
    total: deals.length,
    unread: deals.filter(deal => !deal.markedAsRead).length,
    read: deals.filter(deal => deal.markedAsRead).length,
  };

  return {
    deals,
    isLoading,
    user,
    stats,
    handleMarkAsRead,
    handleDelete,
    refreshDeals: loadDeals,
  };
};
