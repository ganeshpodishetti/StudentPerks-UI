'use client'
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useToast } from '@/shared/components/ui/use-toast';
import { CreateDealRequest, Deal } from '@/shared/types/entities/deal';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

interface DealFormProps {
  deal?: Deal | null;
  onSave: (dealData: CreateDealRequest) => Promise<void>;
  title: string;
  description: string;
}

export default function DealForm({ deal, onSave, title, description }: DealFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>(() => {
    if (deal) {
      return {
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
      };
    }
    return {
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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      router.push('/admin/deals');
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
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push('/admin/deals')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Deals
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/deals')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {deal ? 'Update Deal' : 'Create Deal'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
