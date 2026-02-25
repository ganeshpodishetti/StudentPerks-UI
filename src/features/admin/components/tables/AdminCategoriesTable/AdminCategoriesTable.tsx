import { Category } from '@/features/categories/services/categoryService';
import { ColumnDef, DataTable, cellRenderers } from '@/shared/components/data-display/DataTable';

interface AdminCategoriesTableProps {
  categories: Category[];
  onEditCategory?: (categoryId: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

export default function AdminCategoriesTable({ categories, onEditCategory, onDeleteCategory }: AdminCategoriesTableProps) {
  const columns: ColumnDef<Category>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (_, category) => cellRenderers.text(category.title)
    }
  ];

  // Only include actions if handlers are provided
  const actions = (onEditCategory || onDeleteCategory) ? {
    onEdit: onEditCategory ? (category: Category) => onEditCategory(category.id) : undefined,
    onDelete: onDeleteCategory
  } : undefined;

  return (
    <DataTable
      data={categories}
      columns={columns}
      actions={actions}
      emptyMessage="No categories found"
    />
  );
}
