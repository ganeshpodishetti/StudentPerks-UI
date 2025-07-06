import { UnreadDealsContext, UnreadDealsContextType } from '@/contexts/UnreadDealsContext.ts';
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
export { UnreadDealsProvider } from '@/contexts/UnreadDealsContext.tsx';

// Legacy support - can be removed once all components are updated
export const updateUnreadCount = (_newCount: number) => {
  console.warn('updateUnreadCount is deprecated. Use the context updateCount method instead.');
};
