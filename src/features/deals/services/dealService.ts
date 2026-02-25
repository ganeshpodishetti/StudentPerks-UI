import apiClient, { publicApiClient } from '@/shared/services/api/apiClient';
import { CreateDealRequest, CursorPaginatedResponse, Deal, UpdateDealRequest } from '@/shared/types';

// Default page size from environment variable
const DEFAULT_PAGE_SIZE = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE || '10', 10);

export interface GetDealsParams {
  cursor?: string | null;
  pageSize?: number;
}

export const dealService = {
  // Public endpoint - no authentication required
  async getDeals(params?: GetDealsParams): Promise<CursorPaginatedResponse<Deal>> {
    try {
      const { cursor, pageSize = DEFAULT_PAGE_SIZE } = params || {};
      const queryParams = new URLSearchParams();
      queryParams.append('pageSize', String(pageSize));
      if (cursor) {
        queryParams.append('cursor', cursor);
      }
      
      const url = `/api/deals?${queryParams.toString()}`;
      const response = await publicApiClient.get(url);
      
      // Handle 204 No Content response (empty database)
      if (response.status === 204 || !response.data) {
        return { items: [], nextCursor: null, hasMore: false };
      }
      
      // Handle case where backend returns empty array [] instead of proper format
      if (Array.isArray(response.data)) {
        return { items: response.data, nextCursor: null, hasMore: false };
      }
      
      // Parse hasMore - handle both boolean and string "true"/"false"
      const hasMore = response.data.hasMore === true || response.data.hasMore === 'true';
      
      // Keep nextCursor as-is (don't convert empty string to null)
      const nextCursor = response.data.nextCursor !== undefined && response.data.nextCursor !== null 
        ? response.data.nextCursor 
        : null;
      
      return {
        items: Array.isArray(response.data.items) ? response.data.items : [],
        nextCursor,
        hasMore,
      };
    } catch (error: any) {
      throw error;
    }
  },

  async getDeal(id: string): Promise<Deal> {
    try {
      const response = await publicApiClient.get(`/api/deals/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async getDealsByCategory(categoryName: string): Promise<Deal[]> {
    try {
      const response = await publicApiClient.get(`/api/deals/category?name=${encodeURIComponent(categoryName)}`);
      
      // Handle 404 or empty responses
      if (response.status === 404 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      // If it's a 404 error, return empty array instead of throwing
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  async getDealsByStore(storeName: string): Promise<Deal[]> {
    try {
      const response = await publicApiClient.get(`/api/deals/store?name=${encodeURIComponent(storeName)}`);
      
      // Handle 404 or empty responses
      if (response.status === 404 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      // If it's a 404 error, return empty array instead of throwing
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  async getDealsByUniversity(universityName: string): Promise<Deal[]> {
    try {
      const response = await publicApiClient.get(`/api/deals/university?name=${encodeURIComponent(universityName)}`);
      
      // Handle 404 or empty responses
      if (response.status === 404 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      // If it's a 404 error, return empty array instead of throwing
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Get user-related deals - authentication required
  async getUserDeals(): Promise<Deal[]> {
    try {
      const response = await apiClient.get('/api/deals/user');
      
      // Handle 204 No Content response (empty database)
      if (response.status === 204 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      throw error;
    }
  },

  // Admin endpoints - authentication required
  async createDeal(dealData: CreateDealRequest): Promise<Deal> {
    try {
      // Create JSON payload
      const payload = {
        title: dealData.title,
        description: dealData.description,
        discount: dealData.discount,
        isActive: dealData.isActive,
        redeemType: dealData.redeemType,
        categoryName: dealData.categoryName,
        ...(dealData.storeName && { storeName: dealData.storeName }),
        ...(dealData.promo && { promo: dealData.promo }),
        ...(dealData.url && { url: dealData.url }),
        ...(dealData.startDate && { startDate: dealData.startDate }),
        ...(dealData.endDate && { endDate: dealData.endDate }),
        ...(dealData.howToRedeem && { howToRedeem: dealData.howToRedeem }),
        ...(dealData.universityName && { universityName: dealData.universityName }),
        ...(dealData.isUniversitySpecific !== undefined && { isUniversitySpecific: dealData.isUniversitySpecific }),
      };
      
      const response = await apiClient.post('/api/deals', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateDeal(id: string, dealData: UpdateDealRequest): Promise<Deal> {
    try {
      // Create JSON payload
      const payload = {
        title: dealData.title,
        description: dealData.description,
        discount: dealData.discount,
        isActive: dealData.isActive,
        redeemType: dealData.redeemType,
        categoryName: dealData.categoryName,
        ...(dealData.storeName && { storeName: dealData.storeName }),
        ...(dealData.promo && { promo: dealData.promo }),
        ...(dealData.url && { url: dealData.url }),
        ...(dealData.startDate && { startDate: dealData.startDate }),
        ...(dealData.endDate && { endDate: dealData.endDate }),
        ...(dealData.howToRedeem && { howToRedeem: dealData.howToRedeem }),
        ...(dealData.universityName && { universityName: dealData.universityName }),
        ...(dealData.isUniversitySpecific !== undefined && { isUniversitySpecific: dealData.isUniversitySpecific }),
      };
      
      const response = await apiClient.put(`/api/deals/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteDeal(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/deals/${id}`);
    } catch (error) {
      throw error;
    }
  },

  searchDeals: async (searchParams: {
    query?: string;
  }): Promise<Deal[]> => {
    try {
      // Backend now only accepts a single `query` parameter.
      const query = searchParams.query?.trim() ?? '';

      if (!query) return [];

      const url = `/api/deals/search?query=${encodeURIComponent(query)}`;
      const response = await publicApiClient.get(url);

      if (response.status === 204 || !response.data) return [];

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('DealService: Search error:', error);
      if (error.response?.status === 404) return [];
      throw error;
    }
  }
};

// Keep the legacy function for backward compatibility
export const fetchDeals = dealService.getDeals;