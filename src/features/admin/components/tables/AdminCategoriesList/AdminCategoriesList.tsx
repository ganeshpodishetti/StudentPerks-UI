import { Category } from '@/features/categories/services/categoryService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import AdminCategoriesTable from '../AdminCategoriesTable/AdminCategoriesTable';

interface AdminCategoriesListProps {
  categories: Category[];
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

export default function AdminCategoriesList({ categories, onEditCategory, onDeleteCategory }: AdminCategoriesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Categories</CardTitle>
        <CardDescription>
          {onEditCategory || onDeleteCategory
            ? 'Manage your categories, edit details, or remove outdated categories.'
            : 'View all categories in the system.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-3 md:p-6">
        {/* Desktop Table View */}
        <AdminCategoriesTable 
          categories={categories}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
        />

        {categories.length === 0 && (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No categories found. Create your first category to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
