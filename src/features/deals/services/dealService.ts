import { CreateDealRequest, Deal, UpdateDealRequest } from '@/shared/types';
import apiClient, { publicApiClient } from '@/shared/services/api/apiClient';

export const dealService = {
  // Public endpoint - no authentication required
  async getDeals(): Promise<Deal[]> {
    try {
      const response = await publicApiClient.get('/api/deals');
      
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

  // Admin endpoints - authentication required
  async createDeal(dealData: CreateDealRequest): Promise<Deal> {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add all fields to FormData
      formData.append('title', dealData.title);
      formData.append('description', dealData.description);
      formData.append('discount', dealData.discount);
      formData.append('isActive', dealData.isActive.toString());
      formData.append('redeemType', dealData.redeemType);
      formData.append('categoryName', dealData.categoryName);
      formData.append('storeName', dealData.storeName);
      
      // Add optional fields if they exist
      if (dealData.image) {
        formData.append('image', dealData.image);
      }
      if (dealData.promo) {
        formData.append('promo', dealData.promo);
      }
      if (dealData.url) {
        formData.append('url', dealData.url);
      }
      if (dealData.startDate) {
        formData.append('startDate', dealData.startDate);
      }
      if (dealData.endDate) {
        formData.append('endDate', dealData.endDate);
      }
      if (dealData.howToRedeem) {
        formData.append('howToRedeem', dealData.howToRedeem);
      }
      if (dealData.universityName) {
        formData.append('universityName', dealData.universityName);
      }
      if (dealData.isUniversitySpecific !== undefined) {
        formData.append('isUniversitySpecific', dealData.isUniversitySpecific.toString());
      }
      
      const response = await apiClient.post('/api/deals', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateDeal(id: string, dealData: UpdateDealRequest): Promise<Deal> {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add all fields to FormData
      formData.append('title', dealData.title);
      formData.append('description', dealData.description);
      formData.append('discount', dealData.discount);
      formData.append('isActive', dealData.isActive.toString());
      formData.append('redeemType', dealData.redeemType);
      formData.append('categoryName', dealData.categoryName);
      formData.append('storeName', dealData.storeName);
      
      // Add optional fields if they exist
      if (dealData.image) {
        formData.append('image', dealData.image);
      }
      if (dealData.promo) {
        formData.append('promo', dealData.promo);
      }
      if (dealData.url) {
        formData.append('url', dealData.url);
      }
      if (dealData.startDate) {
        formData.append('startDate', dealData.startDate);
      }
      if (dealData.endDate) {
        formData.append('endDate', dealData.endDate);
      }
      if (dealData.howToRedeem) {
        formData.append('howToRedeem', dealData.howToRedeem);
      }
      if (dealData.universityName) {
        formData.append('universityName', dealData.universityName);
      }
      if (dealData.isUniversitySpecific !== undefined) {
        formData.append('isUniversitySpecific', dealData.isUniversitySpecific.toString());
      }
      
      
      const response = await apiClient.put(`/api/deals/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
    category?: string;
    store?: string;
    university?: string;
    isActive?: boolean;
  }): Promise<Deal[]> => {
    const urlParams = new URLSearchParams();
    
    if (searchParams.query?.trim()) {
      urlParams.append('query', searchParams.query.trim());
    }
    
    if (searchParams.category) {
      urlParams.append('category', searchParams.category);
    }
    
    if (searchParams.store) {
      urlParams.append('store', searchParams.store);
    }
    
    if (searchParams.university) {
      urlParams.append('university', searchParams.university);
    }
    
    if (searchParams.isActive !== undefined) {
      urlParams.append('isActive', searchParams.isActive.toString());
    }

    const response = await publicApiClient.get(`/api/deals/search?${urlParams.toString()}`);
      
    // Handle 204 No Content response (no results)
    if (response.status === 204 || !response.data){
      return [];
    }
      
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  }
};

// Keep the legacy function for backward compatibility
export const fetchDeals = dealService.getDeals;