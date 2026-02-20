'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import CategoryForm from '@/features/categories/components/forms/CategoryForm';
import { useCategoryQuery, useUpdateCategoryMutation } from '@/features/categories/hooks/useCategoriesQuery';
import { CreateCategoryRequest } from '@/features/categories/services/categoryService';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';
import { use } from 'react';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = use(params);
  const { showSuccess, showError } = useErrorHandler();
  const { data: category, isLoading, error } = useCategoryQuery(id);
  const updateCategoryMutation = useUpdateCategoryMutation();

  const handleSave = async (categoryData: CreateCategoryRequest) => {
    try {
      await updateCategoryMutation.mutateAsync({ id, data: categoryData });
      showSuccess('Category updated successfully');
    } catch (error) {
      showError('Failed to update category');
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

  if (error || !category) {
    return (
      <AdminLayout>
        <AdminHeader 
          title="Category Not Found"
          description="The category you're looking for doesn't exist."
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="Edit Category"
        description={`Editing: ${category.name}`}
      />

      <CategoryForm
        category={category}
        onSave={handleSave}
        title="Category Information"
        description="Update the category details."
      />
    </AdminLayout>
  );
}
