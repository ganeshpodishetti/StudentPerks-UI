'use client'
import DealFormModal from '@/components/DealFormModal';
import AdminDealsList from '@/components/admin/AdminDealsList';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { AdminLayout } from '@/components/admin/shared/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminDeals } from '@/hooks/useAdminDeals';

export default function AdminDealsPage() {
  const {
    deals,
    isLoading,
    isModalOpen,
    editingDeal,
    user,
    handleCreateDeal,
    handleEditDeal,
    handleDeleteDeal,
    handleSaveDeal,
    handleLogout,
    testConnectivity,
    closeModal
  } = useAdminDeals();

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  return (
    <AdminLayout
      navigation={<AdminNavigation />}
    >
      <AdminHeader 
        user={user}
        onCreateDeal={handleCreateDeal}
        onLogout={handleLogout}
        onTestConnectivity={testConnectivity}
        title="Deals Management"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Deals</CardTitle>
            <CardDescription>
              Manage deals and special offers for students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminDealsList 
              deals={deals}
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
            />
          </CardContent>
        </Card>
      </div>

      <DealFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveDeal}
        deal={editingDeal}
      />
    </AdminLayout>
  );
}
