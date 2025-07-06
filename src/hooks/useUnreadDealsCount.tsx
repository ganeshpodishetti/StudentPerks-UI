// Re-export from context for backward compatibility
export { UnreadDealsProvider, useUnreadDealsCount } from '@/contexts/UnreadDealsContext';

// Legacy support - can be removed once all components are updated
export const updateUnreadCount = (_newCount: number) => {
  console.warn('updateUnreadCount is deprecated. Use the context updateCount method instead.');
};
