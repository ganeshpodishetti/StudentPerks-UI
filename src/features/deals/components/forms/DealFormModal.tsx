import { CreateDealRequest, Deal } from '@/shared/types/entities/deal';
import { useState } from 'react';
import { FormModal } from '@/shared/components/forms/FormModal';
import { useToast } from '@/shared/components/ui/use-toast';
import {
  CategoryStoreSelection,
  DateSelection,
  DealInformation,
  DealSettings,
  FormData,
  UniversityAndSwitches,
} from './DealFormModal/';

const formatDateForBackend = (date: string): string | null => {
  if (!date) return null;
  const dateObj = new Date(date + 'T00:00:00.000Z');
  if (isNaN(dateObj.getTime())) return null;
  return dateObj.toISOString();
};

const formatDateForInput = (date: string): string => {
  if (!date) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toISOString().split('T')[0];
};

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dealData: CreateDealRequest) => Promise<void>;
  deal?: Deal | null;
}

export default function DealFormModal({ isOpen, onClose, onSave, deal }: DealFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initialState: FormData = {
    title: '',
    description: '',
    discount: '',
    image: null,
    promo: '',
    isActive: true,
    url: '',
    redeemType: 'Online',
    howToRedeem: '',
    startDate: '',
    endDate: '',
    categoryName: '',
    storeName: '',
    universityName: '',
    isUniversitySpecific: false,
  };

  const entityFormData = deal ? {
    title: deal.title,
    description: deal.description,
    discount: deal.discount || '',
    image: null,
    promo: deal.promo || '',
    isActive: deal.isActive,
    url: deal.url || '',
    redeemType: deal.redeemType || 'Online',
    howToRedeem: deal.howToRedeem || '',
    startDate: formatDateForInput(deal.startDate || '') || '',
    endDate: formatDateForInput(deal.endDate || '') || '',
    categoryName: deal.categoryName,
    storeName: deal.storeName,
    universityName: deal.universityName || '',
    isUniversitySpecific: deal.isUniversitySpecific || false,
  } : null;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const dealData: CreateDealRequest = {
        title: formData.title,
        description: formData.description,
        discount: formData.discount,
        isActive: formData.isActive,
        url: formData.url,
        redeemType: formData.redeemType,
        isUniversitySpecific: formData.isUniversitySpecific || false,
        categoryName: formData.categoryName,
        storeName: formData.storeName,
      };

      if (formData.image) dealData.image = formData.image;
      if (formData.promo?.trim()) dealData.promo = formData.promo.trim();
      if (formData.howToRedeem?.trim()) dealData.howToRedeem = formData.howToRedeem.trim();
      if (formData.universityName?.trim()) dealData.universityName = formData.universityName.trim();
      if (formData.url?.trim()) dealData.url = formData.url.trim();
      if (formData.startDate?.trim()) {
        const formattedStartDate = formatDateForBackend(formData.startDate);
        if (formattedStartDate) dealData.startDate = formattedStartDate;
      }
      if (formData.endDate?.trim()) {
        const formattedEndDate = formatDateForBackend(formData.endDate);
        if (formattedEndDate) dealData.endDate = formattedEndDate;
      }

      await onSave(dealData);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save deal. Please try again.",
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
      title={deal ? 'Edit Deal' : 'Create New Deal'}
      description={deal ? 'Update the deal information below.' : 'Fill in the details to create a new deal.'}
      initialState={initialState}
      isLoading={isLoading}
      submitText={deal ? 'Update Deal' : 'Create Deal'}
    >
      {(formData, handleInputChange, handleFileChange, setFormData) => (
        <>
          <DealInformation formData={formData} handleInputChange={handleInputChange} />
          <CategoryStoreSelection formData={formData} setFormData={setFormData} deal={deal} />
          <DealSettings 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleFileChange={handleFileChange} 
            setFormData={setFormData} 
          />
          <DateSelection formData={formData} handleInputChange={handleInputChange} />
          <UniversityAndSwitches formData={formData} setFormData={setFormData} deal={deal} />
        </>
      )}
    </FormModal>
  );
}
