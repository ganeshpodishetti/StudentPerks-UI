import { DataTable, ColumnDef, cellRenderers } from '@/shared/components/data-display/DataTable';
import { Deal } from '@/shared/types/entities/deal';

interface AdminDealsTableProps {
  deals: Deal[];
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (dealId: string) => void;
}

export default function AdminDealsTable({ deals, onEditDeal, onDeleteDeal }: AdminDealsTableProps) {
  const columns: ColumnDef<Deal>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (_, deal) => cellRenderers.titleWithDescription(deal.title, deal.description)
    },
    {
      key: 'storeName',
      header: 'Store',
      render: (_, deal) => cellRenderers.text(deal.storeName, 'text-neutral-700 dark:text-neutral-300')
    },
    {
      key: 'categoryName',
      header: 'Category',
      render: (_, deal) => cellRenderers.text(deal.categoryName, 'text-neutral-700 dark:text-neutral-300')
    },
    {
      key: 'discount',
      header: 'Discount',
      render: (_, deal) => cellRenderers.badge(deal.discount, 'primary')
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, deal) => cellRenderers.status(deal.isActive)
    }
  ];

  return (
    <div className="w-full">
      <DataTable
        data={deals}
        columns={columns}
        actions={{
          onEdit: onEditDeal,
          onDelete: onDeleteDeal
        }}
        emptyMessage="No deals found"
        className="w-full overflow-x-auto"
      />
    </div>
  );
}