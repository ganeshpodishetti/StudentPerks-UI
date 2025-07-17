import { DataTable, ColumnDef, cellRenderers } from '@/shared/components/data-display/DataTable';
import { Store } from '@/features/stores/services/storeService';

interface AdminStoresTableProps {
  stores: Store[];
  onEditStore: (store: Store) => void;
  onDeleteStore: (storeId: string) => void;
}

export default function AdminStoresTable({ stores, onEditStore, onDeleteStore }: AdminStoresTableProps) {
  const columns: ColumnDef<Store>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (_, store) => cellRenderers.text(store.name)
    },
    {
      key: 'description',
      header: 'Description',
      render: (_, store) => cellRenderers.description(store.description, 'max-w-[200px]')
    },
    {
      key: 'website',
      header: 'Website',
      render: (_, store) => cellRenderers.link(store.website)
    }
  ];

  return (
    <DataTable
      data={stores}
      columns={columns}
      actions={{
        onEdit: onEditStore,
        onDelete: onDeleteStore
      }}
      emptyMessage="No stores found"
    />
  );
}
