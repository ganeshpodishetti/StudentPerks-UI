import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { RedeemType } from '@/shared/types/entities/deal';
import { FormData } from './types';

interface DealSettingsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function DealSettings({ formData, handleInputChange, handleFileChange, setFormData }: DealSettingsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="image">Image (PNG/SVG)</Label>
          <Input 
            id="image" 
            name="image" 
            type="file" 
            accept=".png,.svg,image/png,image/svg+xml" 
            onChange={handleFileChange} 
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100" 
          />
          <p className="text-xs text-gray-500 mt-1">Upload a PNG or SVG image (max 5MB)</p>
        </div>
        <div>
          <Label htmlFor="url">Deal URL</Label>
          <Input id="url" name="url" value={formData.url || ''} onChange={handleInputChange} placeholder="https://example.com/deal" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="promo">Promo Code</Label>
          <Input id="promo" name="promo" value={formData.promo || ''} onChange={handleInputChange} placeholder="e.g., SAVE50" />
        </div>
        <div>
          <Label htmlFor="redeemType">Redeem Type *</Label>
          <Select value={formData.redeemType} onValueChange={(value: string) => setFormData(prev => ({ ...prev, redeemType: value as RedeemType }))}>
            <SelectTrigger><SelectValue placeholder="Select redeem type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="InStore">In-Store</SelectItem>
              <SelectItem value="Both">Both</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}