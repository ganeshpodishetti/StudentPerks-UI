// Migrated from src/components/pages/AdminDealsPage.tsx
'use client'
import AdminDealsList from '@/features/admin/components/tables/AdminDealsList/AdminDealsList';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminNavigation from '@/features/admin/components/layout/AdminNavigation/AdminNavigation';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import DealFormModal from '@/features/deals/components/forms/DealFormModal';
import { useAdminDeals } from '@/features/admin/hooks/useAdminDeals';
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

      <AdminDealsList 
              deals={filteredDeals}
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
            />

      <DealFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveDeal}
        deal={editingDeal}
      />
    </AdminLayout>
  );
}
