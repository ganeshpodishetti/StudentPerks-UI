import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Copy, ExternalLink, Image, Info, MapPin, School, Tag } from 'lucide-react';
import React, { useState } from 'react';
import { Deal } from '../types/Deal';

interface DealDetailProps {
  deal: Deal;
  trigger: React.ReactNode;
}

const DealDetail: React.FC<DealDetailProps> = ({ deal, trigger }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = deal.imageUrl;
  const { toast } = useToast();
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!deal.endDate || deal.endDate === 'No date specified' || deal.endDate.trim() === '') return null;
    try {
      const endDate = new Date(deal.endDate);
      if (isNaN(endDate.getTime())) return null;
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return null;
    }
  };

  const daysRemaining = getDaysRemaining();
  
  // Helper function to format redeem type for display
  const formatRedeemType = (redeemType: string): string => {
    switch (redeemType) {
      case 'Online':
        return 'Online only';
      case 'InStore':
        return 'In-store only';
      case 'Both':
        return 'Online & In-store';
      case 'Unknown':
        return 'Contact store';
      default:
        return redeemType;
    }
  };

  // Handle copy promo code
  const handleCopyPromo = () => {
    if (deal.promo) {
      navigator.clipboard.writeText(deal.promo);
      toast({
        title: "Promo code copied!",
        description: `"${deal.promo}" has been copied to your clipboard.`,
        duration: 3000,
      });
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-4 sm:p-5 m-3 sm:m-4 max-h-[90vh] overflow-y-auto rounded-2xl [&>button]:hidden">
        <DialogHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary" 
                className="text-xs bg-neutral-100 hover:bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 rounded-md"
              >
                <Tag className="h-3 w-3 mr-1" />
                {deal.categoryName}
              </Badge>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{deal.storeName}</span>
            </div>
            <Badge variant="default" className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black text-xs self-start sm:self-auto rounded-md">
              {deal.discount}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-900 flex-shrink-0">
              {!imageError && imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={deal.title} 
                  className="w-full h-full object-contain" 
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-400 dark:text-neutral-500" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base sm:text-lg font-semibold leading-tight text-neutral-800 dark:text-neutral-200 mb-2">{deal.title}</DialogTitle>
              <div className="flex flex-col gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-start flex-wrap gap-1">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                    <span className="text-sm">{formatDate(deal.startDate)} - {formatDate(deal.endDate)}</span>
                  </div>
                  {daysRemaining !== null && (
                    <span className={`text-sm font-medium ${daysRemaining > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-red-600 dark:text-red-500'}`}>
                      {daysRemaining > 0 ? `(${daysRemaining} days left)` : '(Expired)'}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  <span className="text-sm">{formatRedeemType(deal.redeemType)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">{deal.description}</p>
          
          <div className="bg-neutral-100/70 dark:bg-neutral-900/70 p-3 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">Promo Code</span>
                <div className="font-mono font-semibold text-base text-neutral-800 dark:text-neutral-200 truncate mt-0.5">{deal.promo || 'No code required'}</div>
              </div>
              {deal.promo && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPromo}
                  className="text-xs flex items-center gap-1.5 flex-shrink-0 rounded-lg"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* How to Redeem Instructions */}
          {'howToRedeem' in deal && (deal as any).howToRedeem && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 sm:p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2.5">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">How to Redeem</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{(deal as any).howToRedeem}</p>
                </div>
              </div>
            </div>
          )}

          {/* University Specific Info */}
          {'isUniversitySpecific' in deal && (deal as any).isUniversitySpecific && (
            <div className="bg-purple-50 dark:bg-purple-950/20 p-3 sm:p-4 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-2.5">
                <School className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-purple-900 dark:text-purple-200 mb-1">University Exclusive</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                    This deal is exclusive to {'universityName' in deal && (deal as any).universityName ? (deal as any).universityName : 'specific universities'}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-4 sm:pt-5">
          <Button 
            className="w-full bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 group text-sm font-medium py-3 rounded-xl"
            asChild
          >
            <a
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Get This Deal
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DealDetail;
