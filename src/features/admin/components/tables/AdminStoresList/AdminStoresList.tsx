import { Store } from '@/features/stores/services/storeService';
import { Card, CardContent } from '@/shared/components/ui/card';
import AdminStoresTable from '../AdminStoresTable/AdminStoresTable';

interface AdminStoresListProps {
  stores: Store[];
  onEditStore?: (storeId: string) => void;
  onDeleteStore?: (storeId: string) => void;
}

export default function AdminStoresList({ stores, onEditStore, onDeleteStore }: AdminStoresListProps) {
  return (
    <Card className="w-full bg-card dark:bg-card shadow-sm border-0">
      <CardContent className="p-0 sm:p-3 md:p-6">
        {/* Desktop Table View */}
        <AdminStoresTable 
          stores={stores}
          onEditStore={onEditStore}
          onDeleteStore={onDeleteStore}
        />

        {stores.length === 0 && (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No stores found. Create your first store to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
