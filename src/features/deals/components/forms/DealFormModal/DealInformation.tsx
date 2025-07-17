import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { FormData } from './types';

interface DealInformationProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function DealInformation({ formData, handleInputChange }: DealInformationProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Deal title" />
        </div>
        <div>
          <Label htmlFor="discount">Discount *</Label>
          <Input id="discount" name="discount" value={formData.discount} onChange={handleInputChange} required placeholder="e.g., 50% OFF" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required placeholder="Deal description" rows={3} />
      </div>
      <div>
        <Label htmlFor="howToRedeem">How to Redeem (Optional)</Label>
        <Textarea id="howToRedeem" name="howToRedeem" value={formData.howToRedeem || ''} onChange={handleInputChange} placeholder="Instructions on how to redeem this deal..." rows={2} />
        <p className="text-xs text-gray-500 mt-1">Provide step-by-step instructions for redeeming this deal</p>
      </div>
    </>
  );
}