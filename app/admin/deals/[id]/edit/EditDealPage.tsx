'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import DealForm from '@/features/deals/components/forms/DealForm';
import { useDealQuery, useUpdateDealMutation } from '@/features/deals/hooks/useDealsQuery';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';
import { useParams } from 'next/navigation';

export default function EditDealPage() {
  const params = useParams();
  const dealId = params.id as string;
  const { showSuccess, showError } = useErrorHandler();
  
  const { data: deal, isLoading } = useDealQuery(dealId);
  const updateDealMutation = useUpdateDealMutation();

  const handleSave = async (dealData: any) => {
    try {
      await updateDealMutation.mutateAsync({
        id: dealId,
        data: dealData
      });
      showSuccess('Deal updated successfully');
    } catch (error) {
      showError('Failed to update deal');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSpinner />
      </AdminLayout>
    );
  }

  if (!deal) {
    return (
      <AdminLayout>
        <AdminHeader 
          title="Deal Not Found"
          description="The deal you're looking for doesn't exist."
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="Edit Deal"
        description={`Editing: ${deal.title}`}
      />

      <DealForm
        deal={deal}
        onSave={handleSave}
        title="Deal Information"
        description="Update the deal details below."
      />
    </AdminLayout>
  );
}
