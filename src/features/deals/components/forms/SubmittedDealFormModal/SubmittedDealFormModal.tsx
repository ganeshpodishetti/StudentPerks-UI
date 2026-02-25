import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';
import { SubmitDealRequest } from '@/shared/types/entities/submittedDeal';
import { useEffect, useState } from 'react';
import { submittedDealService } from '../../../services/submittedDealService';

interface FormData {
  title: string;
  url: string;
  promoCode: string;
}

interface SubmittedDealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SubmittedDealFormModal({ isOpen, onClose, onSuccess }: SubmittedDealFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    url: '',
    promoCode: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        title: '',
        url: '',
        promoCode: '',
      });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dealData: SubmitDealRequest = {
        title: formData.title.trim(),
        url: formData.url.trim(),
        ...(formData.promoCode.trim() && { promoCode: formData.promoCode.trim() }),
      };

      await submittedDealService.submitDeal(dealData);
      
      // Show success toast
      toast({
        title: "Deal Submitted!",
        description: "Thanks for sharing! We'll review your deal and add it to the platform soon.",
      });
      
      // Reset form and close modal
      setFormData({ title: '', url: '', promoCode: '' });
      onClose();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting deal:', error);
      
      // Show error toast
      toast({
        title: "Submission Failed",
        description: "Sorry, we couldn't submit your deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit a Deal</DialogTitle>
          <DialogDescription>
            Found a great student deal? Share it with the community! We&apos;ll review and add it to the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Deal Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter the deal title"
              required
              maxLength={250}
            />
            <p className="text-xs text-gray-500">
              What is this deal called? (e.g., &quot;50% Off Student Subscription&quot;)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Deal URL *</Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com/student-deal"
              required
            />
            <p className="text-xs text-gray-500">
              Link to the deal page where students can access this offer
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promoCode">Promo Code</Label>
            <Input
              id="promoCode"
              name="promoCode"
              value={formData.promoCode}
              onChange={handleInputChange}
              placeholder="e.g., STUDENT50"
            />
            <p className="text-xs text-gray-500">
              Optional promo code for this deal
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Deal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
