import { UnreadDealsContext, UnreadDealsContextType } from '@/features/deals/contexts/UnreadDealsContext';
import { ensureClientContext } from '@/shared/utils/runtimeSafety';
import { useContext } from 'react';

const fallbackUnreadDealsContext: UnreadDealsContextType = {
  unreadCount: 0,
  isLoading: false,
  refreshCount: async () => undefined,
  updateCount: () => undefined,
};

// Custom hook to use the context
export const useUnreadDealsCount = (): UnreadDealsContextType => {
  return ensureClientContext(
    useContext(UnreadDealsContext),
    fallbackUnreadDealsContext,
    'useUnreadDealsCount must be used within an UnreadDealsProvider',
  );
};

// Re-export provider for convenience

