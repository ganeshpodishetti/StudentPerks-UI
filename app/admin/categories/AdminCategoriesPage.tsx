// Migrated from src/components/pages/AdminCategoriesPage.tsx
'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminCategoriesList from '@/features/admin/components/tables/AdminCategoriesList/AdminCategoriesList';
import { useAdminCategories } from '@/features/admin/hooks/useAdminCategories';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import CategoryFormModal from '@/features/categories/components/forms/CategoryFormModal/CategoryFormModal';

export default function AdminCategoriesPage() {
  const {
    categories,
    isLoading,
    isModalOpen,
    editingCategory,
    user,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
    closeModal
  } = useAdminCategories();

  const { } = useAuth();
  
  const isSuperAdmin = user?.roles?.includes('SuperAdmin') ?? false;

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
        title="Category Management"
        description="Manage deal categories"
        onCreateAction={handleCreateCategory}
        createButtonText="Create Category"
      />

      <AdminCategoriesList 
        categories={categories}
        onEditCategory={isSuperAdmin ? handleEditCategory : undefined}
        onDeleteCategory={isSuperAdmin ? handleDeleteCategory : undefined}
      />

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </AdminLayout>
  );
}
