'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import StoreForm from '@/features/stores/components/forms/StoreForm';
import { useStoreQuery, useUpdateStoreMutation } from '@/features/stores/hooks/useStoresQuery';
import { CreateStoreRequest } from '@/features/stores/services/storeService';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';
import { use } from 'react';

interface EditStorePageProps {
  params: Promise<{ id: string }>;
}

export default function EditStorePage({ params }: EditStorePageProps) {
  const { id } = use(params);
  const { showSuccess, showError } = useErrorHandler();
  const { data: store, isLoading, error } = useStoreQuery(id);
  const updateStoreMutation = useUpdateStoreMutation();

  const handleSave = async (storeData: CreateStoreRequest) => {
    try {
      await updateStoreMutation.mutateAsync({ id, data: storeData });
      showSuccess('Store updated successfully');
    } catch (error) {
      showError('Failed to update store');
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

  if (error || !store) {
    return (
      <AdminLayout>
        <AdminHeader 
          title="Store Not Found"
          description="The store you're looking for doesn't exist."
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="Edit Store"
        description={`Editing: ${store.name}`}
      />

      <StoreForm
        store={store}
        onSave={handleSave}
        title="Store Information"
        description="Update the store details."
      />
    </AdminLayout>
  );
}
