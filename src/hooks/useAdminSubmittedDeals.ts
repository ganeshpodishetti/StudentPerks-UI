import { useAuth } from '@/contexts/AuthContext';
import { useErrorHandler } from '@/contexts/ErrorContext';
import { submittedDealService } from '@/services/submittedDealService';
import { SubmittedDeal } from '@/types/SubmittedDeal';
import { useCallback, useEffect, useState } from 'react';
import { updateUnreadCount } from './useUnreadDealsCount';

export const useAdminSubmittedDeals = () => {
  const [deals, setDeals] = useState<SubmittedDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const { showError } = useErrorHandler();

  const loadDeals = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await submittedDealService.getSubmittedDeals();
      setDeals(data);
      // Update global unread count
      const unreadCount = data.filter(deal => !deal.markedAsRead).length;
      updateUnreadCount(unreadCount);
    } catch (_error) {
      showError('Failed to load submitted deals');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

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
        updateUnreadCount(unreadCount);
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
        updateUnreadCount(unreadCount);
        return updatedDeals;
      });
    } catch (_error) {
      showError('Failed to delete submitted deal');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const testConnectivity = async () => {
    try {
      await submittedDealService.getSubmittedDeals();
      alert('API connection successful!');
    } catch (_error) {
      alert('API connection failed.');
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
    handleLogout,
    testConnectivity,
    refreshDeals: loadDeals,
  };
};
