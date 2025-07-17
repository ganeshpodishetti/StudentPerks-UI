import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { useLocalStorage, useRecentlyViewed, useUserPreferences } from '../useLocalStorage';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window for SSR tests
const originalWindow = global.window;

describe('useLocalStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
  });

  it('returns stored value when localStorage has data', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('stored-value');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('updates localStorage when value is set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });

  it('supports function updates', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(5));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    
    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    
    expect(result.current[0]).toBe(6);
  });

  it('removes value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[2](); // removeValue
    });
    
    expect(result.current[0]).toBe('initial');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
  });

  it('handles JSON parse errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    
    expect(result.current[0]).toBe('fallback');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('handles SSR (no window)', () => {
    // Mock window as undefined for SSR simulation
    const originalWindow = global.window;
    // @ts-ignore
    global.window = undefined;
    
    // The hook should handle the case where window is undefined
    // and return the initial value without crashing
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'), {
      // Use a custom wrapper that doesn't depend on DOM
    });
    
    expect(result.current[0]).toBe('initial');
    
    // Restore window
    global.window = originalWindow;
  });

  it('works with complex objects', () => {
    const complexObject = { name: 'test', items: [1, 2, 3], nested: { value: true } };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(complexObject));
    
    const { result } = renderHook(() => useLocalStorage('test-key', {}));
    
    expect(result.current[0]).toEqual(complexObject);
  });
});

describe('useUserPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('returns default preferences when localStorage is empty', () => {
    const { result } = renderHook(() => useUserPreferences());
    
    expect(result.current[0]).toEqual({
      theme: 'system',
      dealsPerPage: 12,
      defaultSort: 'newest',
      showExpiredDeals: false,
      notificationsEnabled: true,
    });
  });

  it('updates preferences correctly', () => {
    const { result } = renderHook(() => useUserPreferences());
    
    act(() => {
      result.current[1]((prev) => ({ ...prev, theme: 'dark' }));
    });
    
    expect(result.current[0].theme).toBe('dark');
  });
});

describe('useRecentlyViewed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('starts with empty recent deals', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    
    expect(result.current.recentDeals).toEqual([]);
  });

  it('adds deal to recent deals', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    
    act(() => {
      result.current.addRecentDeal('deal-1');
    });
    
    expect(result.current.recentDeals).toEqual(['deal-1']);
  });

  it('moves existing deal to front when added again', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['deal-2', 'deal-1']));
    
    const { result } = renderHook(() => useRecentlyViewed());
    
    act(() => {
      result.current.addRecentDeal('deal-1');
    });
    
    expect(result.current.recentDeals).toEqual(['deal-1', 'deal-2']);
  });

  it('limits recent deals to 10 items', () => {
    const existingDeals = Array.from({ length: 10 }, (_, i) => `deal-${i}`);
    localStorageMock.getItem.mockReturnValue(JSON.stringify(existingDeals));
    
    const { result } = renderHook(() => useRecentlyViewed());
    
    act(() => {
      result.current.addRecentDeal('new-deal');
    });
    
    expect(result.current.recentDeals).toHaveLength(10);
    expect(result.current.recentDeals[0]).toBe('new-deal');
    expect(result.current.recentDeals).not.toContain('deal-9');
  });

  it('clears recent deals', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['deal-1', 'deal-2']));
    
    const { result } = renderHook(() => useRecentlyViewed());
    
    act(() => {
      result.current.clearRecentDeals();
    });
    
    expect(result.current.recentDeals).toEqual([]);
  });
});