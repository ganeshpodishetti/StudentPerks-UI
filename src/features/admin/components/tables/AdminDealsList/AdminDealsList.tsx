import { Card } from '@/shared/components/ui/card';
import { Deal } from '@/shared/types/entities/deal';
import AdminDealsCards from '../AdminDealsCards/AdminDealsCards';
import AdminDealsTable from '../AdminDealsTable/AdminDealsTable';

interface AdminDealsListProps {
  deals: Deal[];
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (dealId: string) => void;
}

export default function AdminDealsList({ deals, onEditDeal, onDeleteDeal }: AdminDealsListProps) {
  return (
    <Card>
        <AdminDealsTable 
          deals={deals}
          onEditDeal={onEditDeal}
          onDeleteDeal={onDeleteDeal}
        />

        {/* Mobile Card View */}
        <AdminDealsCards 
          deals={deals}
          onEditDeal={onEditDeal}
          onDeleteDeal={onDeleteDeal}
        />

        {deals.length === 0 && (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No deals found. Create your first deal to get started!
          </div>
        )}
    </Card>
  );
}
