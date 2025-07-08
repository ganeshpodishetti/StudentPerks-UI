// Migrated from src/components/pages/AdminStoresPage.tsx
'use client'
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminStoresList from '@/components/admin/AdminStoresList';
import { AdminLayout } from '@/components/admin/shared/AdminLayout';
import StoreFormModal from '@/components/StoreFormModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStores } from '@/hooks/useAdminStores';

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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Stores</CardTitle>
            <CardDescription>
              Manage stores and retail partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminStoresList 
              stores={stores}
              onEditStore={handleEditStore}
              onDeleteStore={handleDeleteStore}
            />
          </CardContent>
        </Card>
      </div>

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
