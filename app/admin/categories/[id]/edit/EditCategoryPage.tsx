'use client'
import CategoryForm from '@/features/categories/components/forms/CategoryForm';
import { useCategoryQuery, useUpdateCategoryMutation } from '@/features/categories/hooks/useCategoriesQuery';
import { CreateCategoryRequest } from '@/features/categories/services/categoryService';
import { useToast } from '@/shared/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { use } from 'react';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = use(params);
  const { toast } = useToast();
  const { data: category, isLoading, error } = useCategoryQuery(id);
  const updateCategoryMutation = useUpdateCategoryMutation();

  const handleSave = async (categoryData: CreateCategoryRequest) => {
    await updateCategoryMutation.mutateAsync({ id, data: categoryData });
    toast({
      title: "Category updated",
      description: "The category has been updated successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load category</p>
      </div>
    );
  }

  return (
    <CategoryForm
      category={category}
      onSave={handleSave}
      title="Edit Category"
      description="Update category information"
    />
  );
}
