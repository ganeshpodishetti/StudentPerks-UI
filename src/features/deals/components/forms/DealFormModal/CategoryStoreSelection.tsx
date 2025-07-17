import { Combobox } from '@/shared/components/ui/combobox';
import { Label } from '@/shared/components/ui/label';
import { useCategoriesQuery } from '@/features/categories/hooks/useCategoriesQuery';
import { useStoresQuery } from '@/features/stores/hooks/useStoresQuery';
import { Deal } from '@/shared/types/entities/deal';
import { FormData } from './types';

interface CategoryStoreSelectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  deal?: Deal | null;
}

export default function CategoryStoreSelection({ formData, setFormData, deal }: CategoryStoreSelectionProps) {
  const { data: categories = [] } = useCategoriesQuery();
  const { data: stores = [] } = useStoresQuery();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="categoryName">Category *</Label>
        <Combobox
          options={categories.filter(cat => cat.name).map(cat => ({ value: cat.name!, label: cat.name! }))}
          value={formData.categoryName}
          onValueChange={(value) => setFormData(prev => ({ ...prev, categoryName: value }))}
          placeholder={deal ? "Select category" : "Select or create category"}
          searchPlaceholder="Search categories..."
          emptyText={deal ? "No categories found." : "No categories found. Type to create new."}
          customText="Create category"
          allowCustom={!deal}
        />
        <p className="text-xs text-gray-500 mt-1">{deal ? "Select from existing categories" : "Select existing or type new category name"}</p>
      </div>
      <div>
        <Label htmlFor="storeName">Store *</Label>
        <Combobox
          options={stores.map(store => ({ value: store.name, label: store.name }))}
          value={formData.storeName}
          onValueChange={(value) => setFormData(prev => ({ ...prev, storeName: value }))}
          placeholder={deal ? "Select store" : "Select or create store"}
          searchPlaceholder="Search stores..."
          emptyText={deal ? "No stores found." : "No stores found. Type to create new."}
          customText="Create store"
          allowCustom={!deal}
        />
        <p className="text-xs text-gray-500 mt-1">{deal ? "Select from existing stores" : "Select existing or type new store name"}</p>
      </div>
    </div>
  );
}