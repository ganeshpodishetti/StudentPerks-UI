import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { CreateUniversityRequest, University, UpdateUniversityRequest } from '@/shared/types/entities/university';
import { useState } from 'react';
import { FormModal } from '@/shared/components/forms/FormModal';
import { useToast } from '@/shared/components/ui/use-toast';

interface FormData {
  name: string;
  code: string;
  country: string;
  state: string;
  city: string;
  isActive: boolean;
  image?: File | null;
}

interface UniversityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (universityData: CreateUniversityRequest | UpdateUniversityRequest) => Promise<void>;
  university?: University | null;
}

export default function UniversityFormModal({ isOpen, onClose, onSave, university }: UniversityFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initialState: FormData = {
    name: '',
    code: '',
    country: '',
    state: '',
    city: '',
    isActive: true,
    image: null,
  };

  const entityFormData = university ? {
    name: university.name || '',
    code: university.code || '',
    country: university.country || '',
    state: university.state || '',
    city: university.city || '',
    isActive: university.isActive ?? true,
    image: null,
  } : null;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      let universityData: CreateUniversityRequest | UpdateUniversityRequest;
      if (university) {
        universityData = {
          name: formData.name,
          code: formData.code,
          isActive: formData.isActive,
          ...(formData.country && { country: formData.country }),
          ...(formData.state && { state: formData.state }),
          ...(formData.city && { city: formData.city }),
          ...(formData.image && { image: formData.image }),
        };
      } else {
        universityData = {
          name: formData.name,
          code: formData.code,
          ...(formData.country && { country: formData.country }),
          ...(formData.state && { state: formData.state }),
          ...(formData.city && { city: formData.city }),
          ...(formData.image && { image: formData.image }),
        };
      }
      await onSave(universityData);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save university. Please try again.",
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
      title={university ? 'Edit University' : 'Create New University'}
      description={university ? 'Update the university information below.' : 'Add a new university to the platform.'}
      initialState={initialState}
      isLoading={isLoading}
      submitText={university ? 'Update University' : 'Create University'}
    >
      {(formData, handleInputChange, handleFileChange, setFormData) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">University Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter university name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">University Code *</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Enter university code"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
            </div>
          </div>
          {university && (
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active University</Label>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="image">University Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.image && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Selected: {formData.image.name}
              </p>
            )}
          </div>
        </>
      )}
    </FormModal>
  );
}
