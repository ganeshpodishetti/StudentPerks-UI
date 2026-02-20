'use client'
import { Category, CreateCategoryRequest } from '@/features/categories/services/categoryService';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  name: string;
  description: string;
  image: File | null;
}

interface CategoryFormProps {
  category?: Category | null;
  onSave: (categoryData: CreateCategoryRequest) => Promise<void>;
  title: string;
  description: string;
}

export default function CategoryForm({ category, onSave, title, description }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>(() => {
    if (category) {
      return {
        name: category.name || '',
        description: category.description || '',
        image: null,
      };
    }
    return {
      name: '',
      description: '',
      image: null,
    };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const categoryData: CreateCategoryRequest = {
        name: formData.name,
        ...(formData.description && { description: formData.description }),
        ...(formData.image && { image: formData.image }),
      };
      await onSave(categoryData);
      router.push('/admin/categories');
    } catch (error) {
      // Error handling is done by the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push('/admin/categories')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Categories
      </Button>

      <Card className="border-0">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/categories')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {category ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
