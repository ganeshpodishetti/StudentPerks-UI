import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Category, CreateCategoryRequest } from '@/features/categories/services/categoryService';
import { useState } from 'react';
import { FormModal } from '@/shared/components/forms/FormModal';
import { useToast } from '@/shared/components/ui/use-toast';

interface FormData {
  name: string;
  description: string;
  image?: File | null;
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
    name: '',
    description: '',
    image: null,
  };

  const entityFormData = category ? {
    name: category.name || '',
    description: category.description || '',
    image: null
  } : null;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const categoryData: CreateCategoryRequest = {
        name: formData.name,
        ...(formData.description && { description: formData.description }),
        ...(formData.image && { image: formData.image }),
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
      {(formData, handleInputChange, handleFileChange) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter category description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.image && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Selected: {formData.image.name}
              </p>
            )}
          </div>
        </>
      )}
    </FormModal>
  );
}
