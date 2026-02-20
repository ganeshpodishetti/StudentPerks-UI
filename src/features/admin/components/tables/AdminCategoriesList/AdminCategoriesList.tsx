import { Category } from '@/features/categories/services/categoryService';
import { Card, CardContent } from '@/shared/components/ui/card';
import AdminCategoriesTable from '../AdminCategoriesTable/AdminCategoriesTable';

interface AdminCategoriesListProps {
  categories: Category[];
  onEditCategory?: (categoryId: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

export default function AdminCategoriesList({ categories, onEditCategory, onDeleteCategory }: AdminCategoriesListProps) {
  return (
    <Card className="border-0">
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
