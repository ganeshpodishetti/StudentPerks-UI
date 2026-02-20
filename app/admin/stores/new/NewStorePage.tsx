'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import StoreForm from '@/features/stores/components/forms/StoreForm';
import { useCreateStoreMutation } from '@/features/stores/hooks/useStoresQuery';
import { CreateStoreRequest } from '@/features/stores/services/storeService';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';

export default function NewStorePage() {
  const { isLoading: authLoading } = useAuth();
  const { showSuccess, showError } = useErrorHandler();
  const createStoreMutation = useCreateStoreMutation();

  const handleSave = async (storeData: CreateStoreRequest) => {
    try {
      await createStoreMutation.mutateAsync(storeData);
      showSuccess('Store created successfully');
    } catch (error) {
      showError('Failed to create store');
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
        title="Create New Store"
        description="Fill in the details to create a new store"
      />

      <StoreForm
        onSave={handleSave}
        title="Store Information"
        description="Enter the details for your new store."
      />
    </AdminLayout>
  );
}
