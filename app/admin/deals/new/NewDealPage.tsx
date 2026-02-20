'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import DealForm from '@/features/deals/components/forms/DealForm';
import { useCreateDealMutation } from '@/features/deals/hooks/useDealsQuery';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';

export default function NewDealPage() {
  const { isLoading: authLoading } = useAuth();
  const { showSuccess, showError } = useErrorHandler();
  const createDealMutation = useCreateDealMutation();

  const handleSave = async (dealData: any) => {
    try {
      await createDealMutation.mutateAsync(dealData);
      showSuccess('Deal created successfully');
    } catch (error) {
      showError('Failed to create deal');
      throw error;
    }
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="Create New Deal"
        description="Fill in the details to create a new deal"
      />

      <DealForm
        onSave={handleSave}
        title="Deal Information"
        description="Enter the details for your new deal."
      />
    </AdminLayout>
  );
}
