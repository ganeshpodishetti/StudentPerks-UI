import { Category, CreateCategoryRequest } from '@/features/categories/services/categoryService';
import { FormModal } from '@/shared/components/forms/FormModal';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';
import { useState } from 'react';

interface FormData {
  title: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: CreateCategoryRequest) => Promise<void>;
  category?: Category | null;
}

export default function CategoryFormModal({ isOpen, onClose, onSave, category }: CategoryFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initialState: FormData = {
    title: '',
  };

  const entityFormData = category ? {
    title: category.title || '',
  } : null;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const categoryData: CreateCategoryRequest = {
        title: formData.title,
      };
      await onSave(categoryData);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit}
      entity={entityFormData}
      title={category ? 'Edit Category' : 'Create New Category'}
      description={category ? 'Update the category information below.' : 'Add a new category to the platform.'}
      initialState={initialState}
      isLoading={isLoading}
      submitText={category ? 'Update Category' : 'Create Category'}
    >
      {(formData, handleInputChange) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Category Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter category title"
              required
            />
          </div>
        </>
      )}
    </FormModal>
  );
}
