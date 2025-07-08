import { UnreadDealsContext, UnreadDealsContextType } from '@/contexts/UnreadDealsContext';
import { useContext } from 'react';

// Custom hook to use the context
export const useUnreadDealsCount = (): UnreadDealsContextType => {
  const context = useContext(UnreadDealsContext);
  
  if (context === undefined) {
    throw new Error('useUnreadDealsCount must be used within an UnreadDealsProvider');
  }
  
  return context;
};

// Re-export provider for convenience
// Re-export the provider for convenience
export { UnreadDealsProvider } from '@/contexts/UnreadDealsContext';

// Legacy support - can be removed once all components are updated
export const updateUnreadCount = (_newCount: number) => {
  // Deprecated: Use the context updateCount method instead.
};
