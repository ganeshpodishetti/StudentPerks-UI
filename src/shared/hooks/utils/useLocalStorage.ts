import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for managing localStorage with TypeScript support
 * Provides automatic serialization/deserialization and error handling
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this key from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing user preferences in localStorage
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  dealsPerPage: number;
  defaultSort: string;
  showExpiredDeals: boolean;
  notificationsEnabled: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  dealsPerPage: 12,
  defaultSort: 'newest',
  showExpiredDeals: false,
  notificationsEnabled: true,
};

export const useUserPreferences = () => {
  return useLocalStorage<UserPreferences>('userPreferences', defaultPreferences);
};

/**
 * Hook for managing recently viewed deals
 */
export const useRecentlyViewed = () => {
  const [recentDeals, setRecentDeals, clearRecentDeals] = useLocalStorage<string[]>('recentlyViewedDeals', []);

  const addRecentDeal = useCallback((dealId: string) => {
    setRecentDeals(prev => {
      const filtered = prev.filter(id => id !== dealId);
      return [dealId, ...filtered].slice(0, 10); // Keep only last 10
    });
  }, [setRecentDeals]);

  return {
    recentDeals,
    addRecentDeal,
    clearRecentDeals,
  };
};