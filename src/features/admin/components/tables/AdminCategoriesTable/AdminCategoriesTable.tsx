import { DataTable, ColumnDef, cellRenderers } from '@/shared/components/data-display/DataTable';
import { Category } from '@/features/categories/services/categoryService';

interface AdminCategoriesTableProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function AdminCategoriesTable({ categories, onEditCategory, onDeleteCategory }: AdminCategoriesTableProps) {
  const columns: ColumnDef<Category>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (_, category) => cellRenderers.image(category.imageUrl, category.name || 'Category')
    },
    {
      key: 'name',
      header: 'Name',
      render: (_, category) => cellRenderers.text(category.name)
    },
    {
      key: 'description',
      header: 'Description',
      render: (_, category) => cellRenderers.description(category.description)
    }
  ];

  return (
    <DataTable
      data={categories}
      columns={columns}
      actions={{
        onEdit: onEditCategory,
        onDelete: onDeleteCategory
      }}
      emptyMessage="No categories found"
    />
  );
}
