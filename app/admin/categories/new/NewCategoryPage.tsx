'use client'
import CategoryForm from '@/features/categories/components/forms/CategoryForm';
import { useCreateCategoryMutation } from '@/features/categories/hooks/useCategoriesQuery';
import { CreateCategoryRequest } from '@/features/categories/services/categoryService';
import { useToast } from '@/shared/components/ui/use-toast';

export default function NewCategoryPage() {
  const { toast } = useToast();
  const createCategoryMutation = useCreateCategoryMutation();

  const handleSave = async (categoryData: CreateCategoryRequest) => {
    await createCategoryMutation.mutateAsync(categoryData);
    toast({
      title: "Category created",
      description: "The category has been created successfully.",
    });
  };

  return (
    <CategoryForm
      onSave={handleSave}
      title="Create New Category"
      description="Add a new category to the system"
    />
  );
}
