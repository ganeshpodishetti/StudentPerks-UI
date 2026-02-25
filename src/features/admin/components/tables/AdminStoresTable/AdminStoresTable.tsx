import { Store } from '@/features/stores/services/storeService';
import { ColumnDef, DataTable, cellRenderers } from '@/shared/components/data-display/DataTable';

interface AdminStoresTableProps {
  stores: Store[];
  onEditStore?: (storeId: string) => void;
  onDeleteStore?: (storeId: string) => void;
}

export default function AdminStoresTable({ stores, onEditStore, onDeleteStore }: AdminStoresTableProps) {
  const columns: ColumnDef<Store>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (_, store) => cellRenderers.text(store.title)
    },
    {
      key: 'website',
      header: 'Website',
      render: (_, store) => cellRenderers.link(store.website)
    },
    {
      key: 'logoUrl',
      header: 'Logo',
      render: (_, store) => store.logoUrl ? cellRenderers.image(store.logoUrl, 'h-8 w-8') : cellRenderers.text('-')
    }
  ];

  // Only include actions if handlers are provided
  const actions = (onEditStore || onDeleteStore) ? {
    onEdit: onEditStore ? (store: Store) => onEditStore(store.id) : undefined,
    onDelete: onDeleteStore
  } : undefined;

  return (
    <DataTable
      data={stores}
      columns={columns}
      actions={actions}
      emptyMessage="No stores found"
    />
  );
}
