import { ColumnDef, DataTable, cellRenderers } from '@/shared/components/data-display/DataTable';
import { University } from '@/shared/types/entities/university';

interface AdminUniversitiesTableProps {
  universities: University[];
  onEditUniversity: (university: University) => void;
  onDeleteUniversity: (universityId: string) => void;
}

export default function AdminUniversitiesTable({ universities, onEditUniversity, onDeleteUniversity }: AdminUniversitiesTableProps) {
  const columns: ColumnDef<University>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (_, university) => cellRenderers.image(university.imageUrl, university.name || 'University')
    },
    {
      key: 'name',
      header: 'Name',
      render: (_, university) => cellRenderers.text(university.name)
    },
    {
      key: 'code',
      header: 'Code',
      render: (_, university) => (
        <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-mono">
          {university.code}
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      render: (_, university) => (
        <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          {[university.city, university.state, university.country].filter(Boolean).join(', ') || '-'}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, university) => cellRenderers.status(university.isActive ?? false)
    }
  ];

  return (
    <DataTable
      data={universities}
      columns={columns}
      actions={{
        onEdit: onEditUniversity,
        onDelete: onDeleteUniversity
      }}
      emptyMessage="No universities found"
    />
  );
}
