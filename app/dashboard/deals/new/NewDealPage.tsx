'use client'
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import DealForm from '@/features/deals/components/forms/DealForm';
import { useCreateDealMutation } from '@/features/deals/hooks/useDealsQuery';
import type { CreateDealRequest } from '@/shared/types/api/requests';

export default function NewDealPage() {
  const createDealMutation = useCreateDealMutation();

  const handleSave = async (dealData: CreateDealRequest) => {
    await createDealMutation.mutateAsync(dealData);
  };

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
