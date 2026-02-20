import { useAuth } from '@/features/auth/contexts/AuthContext';
import {
    useCreateDealMutation,
    useDeleteDealMutation,
    useUpdateDealMutation,
    useUserDealsQuery
} from '@/features/deals/hooks/useDealsQuery';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';
import { Deal } from '@/shared/types/entities/deal';
import { useState } from 'react';

export const useAdminDeals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const { user } = useAuth();
  const { showError, showSuccess } = useErrorHandler();

  // React Query hooks - fetch user-related deals after authentication
  const { data: deals = [], isLoading } = useUserDealsQuery();
  const createDealMutation = useCreateDealMutation();
  const updateDealMutation = useUpdateDealMutation();
  const deleteDealMutation = useDeleteDealMutation();

  const handleCreateDeal = () => {
    setEditingDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) {
      return;
    }

    try {
      await deleteDealMutation.mutateAsync(dealId);
      showSuccess('Deal deleted successfully');
    } catch (_error) {
      showError('Failed to delete deal');
    }
  };

  const handleSaveDeal = async (dealData: any) => {
    try {
      if (editingDeal) {
        // Update existing deal
        await updateDealMutation.mutateAsync({
          id: editingDeal.id,
          data: dealData
        });
        showSuccess('Deal updated successfully');
      } else {
        // Create new deal
        await createDealMutation.mutateAsync(dealData);
        showSuccess('Deal created successfully');
      }
      setIsModalOpen(false);
      setEditingDeal(null);
    } catch (_error) {
      showError(editingDeal ? 'Failed to update deal' : 'Failed to create deal');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  return {
    deals,
    isLoading,
    isModalOpen,
    editingDeal,
    user,
    handleCreateDeal,
    handleEditDeal,
    handleDeleteDeal,
    handleSaveDeal,
    closeModal
  };
};
