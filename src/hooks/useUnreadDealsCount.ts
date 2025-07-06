import { submittedDealService } from '@/services/submittedDealService';
import { useEffect, useState } from 'react';

// Global state for unread count to share across components
let globalUnreadCount = 0;
let globalListeners: (() => void)[] = [];

const notifyListeners = () => {
  globalListeners.forEach(listener => listener());
};

export const updateUnreadCount = (newCount: number) => {
  globalUnreadCount = newCount;
  notifyListeners();
};

export const useUnreadDealsCount = () => {
  const [unreadCount, setUnreadCount] = useState(globalUnreadCount);
  const [isLoading, setIsLoading] = useState(true);

  const loadUnreadCount = async () => {
    try {
      const deals = await submittedDealService.getSubmittedDeals();
      const unread = deals.filter(deal => !deal.markedAsRead).length;
      updateUnreadCount(unread);
    } catch (error) {
      console.error('Error loading unread deals count:', error);
      updateUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Subscribe to global updates
    const listener = () => setUnreadCount(globalUnreadCount);
    globalListeners.push(listener);
    
    // Initial load
    loadUnreadCount();
    
    // Set up interval to refresh count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => {
      // Cleanup
      globalListeners = globalListeners.filter(l => l !== listener);
      clearInterval(interval);
    };
  }, []);

  const refreshCount = () => {
    loadUnreadCount();
  };

  return {
    unreadCount,
    isLoading,
    refreshCount,
  };
};
