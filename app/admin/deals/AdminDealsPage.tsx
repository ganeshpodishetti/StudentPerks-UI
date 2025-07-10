// Migrated from src/components/pages/AdminDealsPage.tsx
'use client'
import DealFormModal from '@/components/DealFormModal';
import AdminDealsList from '@/components/admin/AdminDealsList';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { AdminLayout } from '@/components/admin/shared/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminDeals } from '@/hooks/useAdminDeals';
import { useMemo, useState } from 'react';

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

  const [searchTerm, setSearchTerm] = useState('');
  const filteredDeals = useMemo(() => {
    if (!searchTerm.trim()) return deals;
    const term = searchTerm.toLowerCase();
    return deals.filter(d =>
      d.title.toLowerCase().includes(term) ||
      d.description.toLowerCase().includes(term) ||
      d.storeName.toLowerCase().includes(term) ||
      d.categoryName.toLowerCase().includes(term) ||
      (d.discount?.toLowerCase().includes(term) ?? false)
    );
  }, [deals, searchTerm]);

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
        onSearchDeals={setSearchTerm}
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
              deals={filteredDeals}
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
