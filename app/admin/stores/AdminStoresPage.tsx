// Migrated from src/components/pages/AdminStoresPage.tsx
'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminStoresList from '@/features/admin/components/tables/AdminStoresList/AdminStoresList';
import { useAdminStores } from '@/features/admin/hooks/useAdminStores';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminStoresPage() {
  const router = useRouter();
  const {
    stores,
    isLoading,
    user,
    handleDeleteStore,
  } = useAdminStores();

  const { } = useAuth();
  
  const isSuperAdmin = user?.roles?.includes('SuperAdmin') ?? false;

  const handleCreateStore = () => {
    router.push('/admin/stores/new');
  };

  const handleEditStore = (storeId: string) => {
    router.push(`/admin/stores/${storeId}/edit`);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="Store Management"
        description="Manage stores and their information"
        onCreateAction={handleCreateStore}
        createButtonText="Create Store"
      />

      <AdminStoresList 
        stores={stores}
        onEditStore={isSuperAdmin ? handleEditStore : undefined}
        onDeleteStore={isSuperAdmin ? handleDeleteStore : undefined}
      />
    </AdminLayout>
  );
}
