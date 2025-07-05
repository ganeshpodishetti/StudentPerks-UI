import { MarkAsReadDealRequest, SubmitDealRequest, SubmittedDeal } from '../types/SubmittedDeal';
import apiClient, { publicApiClient } from './apiClient';

export const submittedDealService = {
  // Public endpoint - no authentication required
  async submitDeal(dealData: SubmitDealRequest): Promise<{ message: string }> {
    try {
      const response = await publicApiClient.post('/api/submit-deal', dealData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin endpoints - authentication required
  async getSubmittedDeals(): Promise<SubmittedDeal[]> {
    try {
      const response = await apiClient.get('/api/get-submitted-deals');
      return response.data || [];
    } catch (error: any) {
      // If we get 204 No Content, return empty array
      if (error.response?.status === 204) {
        return [];
      }
      throw error;
    }
  },

  async markAsRead(id: string, markedAsRead: boolean): Promise<{ message: string }> {
    try {
      const requestData: MarkAsReadDealRequest = { markedAsRead };
      const response = await apiClient.put(`/api/mark-as-read/${id}`, requestData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteSubmittedDeal(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/api/delete-submitted-deal/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
