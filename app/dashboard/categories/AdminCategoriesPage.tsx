// Migrated from src/components/pages/AdminCategoriesPage.tsx
'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminCategoriesList from '@/features/admin/components/tables/AdminCategoriesList/AdminCategoriesList';
import { useAdminCategories } from '@/features/admin/hooks/useAdminCategories';
import { useRouter } from 'next/navigation';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const {
    categories,
    isLoading,
    user,
    handleDeleteCategory,
  } = useAdminCategories();

  const isSuperAdmin = user?.roles?.includes('SuperAdmin') ?? false;

  const handleCreateCategory = () => {
    router.push('/dashboard/categories/new');
  };

  const handleEditCategory = (categoryId: string) => {
    router.push(`/dashboard/categories/${categoryId}/edit`);
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
    </AdminLayout>
  );
}
