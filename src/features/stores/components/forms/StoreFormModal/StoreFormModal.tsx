import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { CreateStoreRequest, Store } from '@/features/stores/services/storeService';
import { useState } from 'react';
import { FormModal } from '@/shared/components/forms/FormModal';
import { useToast } from '@/shared/components/ui/use-toast';

interface FormData {
  name: string;
  description: string;
  website: string;
}

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (storeData: CreateStoreRequest) => Promise<void>;
  store?: Store | null;
}

export default function StoreFormModal({ isOpen, onClose, onSave, store }: StoreFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initialState: FormData = {
    name: '',
    description: '',
    website: '',
  };

  const entityFormData = store ? {
    name: store.name || '',
    description: store.description || '',
    website: store.website || '',
  } : null;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const storeData: CreateStoreRequest = {
        name: formData.name,
        ...(formData.description && { description: formData.description }),
        ...(formData.website && { website: formData.website }),
      };
      await onSave(storeData);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save store. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit}
      entity={entityFormData}
      title={store ? 'Edit Store' : 'Create New Store'}
      description={store ? 'Update the store information below.' : 'Add a new store to the platform.'}
      initialState={initialState}
      isLoading={isLoading}
      submitText={store ? 'Update Store' : 'Create Store'}
    >
      {(formData, handleInputChange) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter store name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter store description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
        </>
      )}
    </FormModal>
  );
}
