import { CreateStoreRequest, Store } from '@/features/stores/services/storeService';
import { FormModal } from '@/shared/components/forms/FormModal';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';
import { useState } from 'react';

interface FormData {
  title: string;
  website: string;
  logoUrl: string;
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
    title: '',
    website: '',
    logoUrl: '',
  };

  const entityFormData = store ? {
    title: store.title || '',
    website: store.website || '',
    logoUrl: store.logoUrl || '',
  } : null;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const storeData: CreateStoreRequest = {
        title: formData.title,
        ...(formData.website && { website: formData.website }),
        ...(formData.logoUrl && { logoUrl: formData.logoUrl }),
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
            <Label htmlFor="title">Store Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter store title"
              required
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

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </>
      )}
    </FormModal>
  );
}
