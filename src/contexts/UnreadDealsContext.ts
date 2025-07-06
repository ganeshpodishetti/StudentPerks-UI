import { createContext } from 'react';

// Context types
export interface UnreadDealsContextType {
  unreadCount: number;
  isLoading: boolean;
  refreshCount: () => Promise<void>;
  updateCount: (count: number) => void;
}

// Create context
export const UnreadDealsContext = createContext<UnreadDealsContextType | undefined>(undefined);
