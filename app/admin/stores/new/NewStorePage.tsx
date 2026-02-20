'use client'
import StoreForm from '@/features/stores/components/forms/StoreForm';
import { useCreateStoreMutation } from '@/features/stores/hooks/useStoresQuery';
import { CreateStoreRequest } from '@/features/stores/services/storeService';
import { useToast } from '@/shared/components/ui/use-toast';

export default function NewStorePage() {
  const { toast } = useToast();
  const createStoreMutation = useCreateStoreMutation();

  const handleSave = async (storeData: CreateStoreRequest) => {
    await createStoreMutation.mutateAsync(storeData);
    toast({
      title: "Store created",
      description: "The store has been created successfully.",
    });
  };

  return (
    <StoreForm
      onSave={handleSave}
      title="Create New Store"
      description="Add a new store to the system"
    />
  );
}
