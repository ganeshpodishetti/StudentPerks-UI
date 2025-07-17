// Migrated from src/components/pages/AdminStoresPage.tsx
'use client'
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminNavigation from '@/features/admin/components/layout/AdminNavigation/AdminNavigation';
import AdminStoresList from '@/features/admin/components/tables/AdminStoresList/AdminStoresList';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import StoreFormModal from '@/features/stores/components/forms/StoreFormModal/StoreFormModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useAdminStores } from '@/features/admin/hooks/useAdminStores';

export default function AdminStoresPage() {
  const {
    stores,
    isLoading,
    isModalOpen,
    editingStore,
    user,
    handleCreateStore,
    handleEditStore,
    handleDeleteStore,
    handleSaveStore,
    closeModal
  } = useAdminStores();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  return (
    <AdminLayout navigation={<AdminNavigation />}>
      <AdminHeader 
        user={user}
        onCreateDeal={handleCreateStore}
        onLogout={handleLogout}
        onTestConnectivity={() => {}}
        title="Store Management"
        createButtonText="Create Store"
      />

      <AdminStoresList 
              stores={stores}
              onEditStore={handleEditStore}
              onDeleteStore={handleDeleteStore}
            />

      <StoreFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveStore}
        store={editingStore}
      />
    </AdminLayout>
  );
}
// ...original code will be placed here...
