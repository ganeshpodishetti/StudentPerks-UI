'use client'
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { CreateDealRequest } from '@/shared/types/api/requests';
import type { DealResponse } from '@/shared/types/api/responses';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    CategoryStoreSelection,
    DateSelection,
    DealInformation,
    DealSettings,
    FormData,
    UniversityAndSwitches
} from './DealFormModal/';

type DealFormDeal = DealResponse & {
  isFeatured?: boolean;
};

type DealFormPayload = CreateDealRequest & {
  isFeatured: boolean;
};

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
  deal?: DealFormDeal | null;
  onSave: (dealData: CreateDealRequest) => Promise<void>;
  title: string;
  description: string;
}

export default function DealForm({ deal, onSave, title, description }: DealFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const canManageFeatured = user?.roles?.includes('SuperAdmin') ?? false;

  const [formData, setFormData] = useState<FormData>(() => {
    if (deal) {
      return {
        title: deal.title,
        discount: deal.discount || '',
        promo: deal.promo || '',
        isActive: deal.isActive,
        isFeatured: deal.isFeatured ?? false,
        url: deal.url || '',
        redeemType: deal.redeemType || 'Online',
        howToRedeem: deal.howToRedeem || '',
        endDate: formatDateForInput(deal.endDate || '') || '',
        categoryName: deal.categoryName,
        storeName: deal.storeName,
        universityName: deal.universityName || '',
        isUniversitySpecific: deal.isUniversitySpecific || false,
      };
    }
    return {
      title: '',
      discount: '',
      promo: '',
      isActive: true,
      isFeatured: false,
      url: '',
      redeemType: 'Online',
      howToRedeem: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const isFeatured = canManageFeatured ? formData.isFeatured : (deal?.isFeatured ?? false);

      const dealData: DealFormPayload = {
        title: formData.title,
        discount: formData.discount,
        isActive: formData.isActive,
        isFeatured,
        redeemType: formData.redeemType,
        isUniversitySpecific: formData.isUniversitySpecific || false,
        categoryName: formData.categoryName,
        ...(formData.storeName && { storeName: formData.storeName }),
      };

      if (formData.promo?.trim()) dealData.promo = formData.promo.trim();
      if (formData.howToRedeem?.trim()) dealData.howToRedeem = formData.howToRedeem.trim();
      if (formData.universityName?.trim()) dealData.universityName = formData.universityName.trim();
      if (formData.url?.trim()) dealData.url = formData.url.trim();
      if (formData.endDate?.trim()) {
        const formattedEndDate = formatDateForBackend(formData.endDate);
        if (formattedEndDate) dealData.endDate = formattedEndDate;
      }

      await onSave(dealData);
      router.push('/dashboard/deals');
    } catch {
      // Error handling is done by the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard/deals')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Deals
      </Button>

      <Card className="border-0">
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
              setFormData={setFormData} 
            />
            <DateSelection formData={formData} handleInputChange={handleInputChange} />
            <UniversityAndSwitches
              formData={formData}
              setFormData={setFormData}
              deal={deal}
              canManageFeatured={canManageFeatured}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/deals')}
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
