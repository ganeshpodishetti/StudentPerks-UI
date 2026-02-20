'use client'
import StoreForm from '@/features/stores/components/forms/StoreForm';
import { useStoreQuery, useUpdateStoreMutation } from '@/features/stores/hooks/useStoresQuery';
import { CreateStoreRequest } from '@/features/stores/services/storeService';
import { useToast } from '@/shared/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { use } from 'react';

interface EditStorePageProps {
  params: Promise<{ id: string }>;
}

export default function EditStorePage({ params }: EditStorePageProps) {
  const { id } = use(params);
  const { toast } = useToast();
  const { data: store, isLoading, error } = useStoreQuery(id);
  const updateStoreMutation = useUpdateStoreMutation();

  const handleSave = async (storeData: CreateStoreRequest) => {
    await updateStoreMutation.mutateAsync({ id, data: storeData });
    toast({
      title: "Store updated",
      description: "The store has been updated successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load store</p>
      </div>
    );
  }

  return (
    <StoreForm
      store={store}
      onSave={handleSave}
      title="Edit Store"
      description="Update store information"
    />
  );
}
