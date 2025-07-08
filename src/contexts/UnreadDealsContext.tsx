import { submittedDealService } from '@/services/submittedDealService';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

// Context types
export interface UnreadDealsContextType {
  unreadCount: number;
  isLoading: boolean;
  refreshCount: () => Promise<void>;
  updateCount: (count: number) => void;
}

// Create context
export const UnreadDealsContext = createContext<UnreadDealsContextType | undefined>(undefined);

// Provider component
interface UnreadDealsProviderProps {
  children: ReactNode;
}

export const UnreadDealsProvider: React.FC<UnreadDealsProviderProps> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadUnreadCount = async () => {
    try {
      setIsLoading(true);
      const deals = await submittedDealService.getSubmittedDeals();
      const unread = deals.filter(deal => !deal.markedAsRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading unread deals count:', error);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCount = (count: number) => {
    setUnreadCount(count);
  };

  useEffect(() => {
    // Initial load
    loadUnreadCount();
    
    // Set up interval to refresh count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const value: UnreadDealsContextType = {
    unreadCount,
    isLoading,
    refreshCount: loadUnreadCount,
    updateCount,
  };

  return (
    <UnreadDealsContext.Provider value={value}>
      {children}
    </UnreadDealsContext.Provider>
  );
};
