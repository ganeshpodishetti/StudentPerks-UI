import StoreLogoAvatar from '@/shared/components/branding/StoreLogoAvatar';
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/shared/components/ui/dialog";
import { useToast } from "@/shared/components/ui/use-toast";
import { Deal } from '@/shared/types';
import { Calendar, Copy, ExternalLink, Info, MapPin, School, Tag } from 'lucide-react';
import React from 'react';

interface DealDetailProps {
  deal: Deal;
  trigger: React.ReactNode;
  onView?: (dealId: string) => void | Promise<void>;
  onClick?: (dealId: string) => void | Promise<void>;
  onRedeem?: (dealId: string) => void | Promise<void>;
}

const DealDetail: React.FC<DealDetailProps> = ({ deal, trigger, onView, onClick, onRedeem }) => {
  const { toast } = useToast();
  const dealUrl = deal.url?.trim();

  // Format date
  const formatDate = (dateString?: string | null) => {
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
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
      });
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (open) {
      void onView?.(deal.id);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="w-[calc(100%-2rem)] sm:w-full p-4 sm:p-6 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl [&>button]:hidden">
        <DialogHeader className="pb-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              <Badge 
                variant="secondary" 
                className="text-xs bg-brand-100/50 hover:bg-brand-100 transition-colors text-brand-700 dark:bg-brand-900 dark:text-brand-100 rounded-full"
              >
                <Tag className="h-3 w-3 mr-1" />
                {deal.categoryName}
              </Badge>
              <span className="text-xs font-medium text-brand-700 dark:text-brand-300">{deal.storeName}</span>
            </div>
            <Badge variant="default" className="bg-brand-900 hover:bg-brand-700 text-brand-100 dark:bg-brand-100 dark:hover:bg-brand-300 dark:text-brand-900 text-xs flex-shrink-0 rounded-full">
              {deal.discount}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <StoreLogoAvatar
              name={deal.storeName}
              fallbackName={deal.title}
              logoUrl={deal.logoUrl || deal.imageUrl}
              className="w-12 h-12"
              initialClassName="text-base"
              testIdPrefix="deal-detail-logo"
            />
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-bold leading-tight text-brand-900 dark:text-brand-100 mb-1.5">{deal.title}</DialogTitle>
              <div className="flex flex-col gap-1 text-xs font-medium text-brand-700 dark:text-brand-300">
                <div className="flex items-start flex-wrap gap-1">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="text-xs">Expires: {formatDate(deal.endDate)}</span>
                  </div>
                  {daysRemaining !== null && (
                    <span className={`text-xs font-medium ${daysRemaining > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-red-600 dark:text-red-500'}`}>
                      {daysRemaining > 0 ? `(${daysRemaining} days left)` : '(Expired)'}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="text-xs">{formatRedeemType(deal.redeemType)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-100/70 dark:bg-neutral-900/70 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-xs uppercase tracking-wider text-brand-700 dark:text-brand-300 font-medium">Promo Code</span>
                <div className="font-mono font-semibold text-sm text-brand-900 dark:text-brand-100 truncate mt-0.5">{deal.promo || 'No code required'}</div>
              </div>
              {deal.promo && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPromo}
                  className="text-xs flex items-center gap-1 flex-shrink-0 rounded-full border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300 hover:bg-brand-100 hover:text-brand-900 dark:hover:bg-brand-900"
                >
                  <Copy className="h-3 w-3" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* How to Redeem Instructions */}
          {'howToRedeem' in deal && (deal as any).howToRedeem && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-blue-900 dark:text-blue-200 mb-0.5">How to Redeem</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">{(deal as any).howToRedeem}</p>
                </div>
              </div>
            </div>
          )}

          {/* University Specific Info */}
          {'isUniversitySpecific' in deal && (deal as any).isUniversitySpecific && (
            <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-2">
                <School className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-purple-900 dark:text-purple-200 mb-0.5">University Exclusive</h4>
                  <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                    This deal is exclusive to {'universityName' in deal && (deal as any).universityName ? (deal as any).universityName : 'specific universities'}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {dealUrl ? (
          <DialogFooter className="pt-4">
            <Button
              className="w-full text-brand-100 bg-brand-900 hover:bg-brand-700 dark:bg-brand-100 dark:text-brand-900 dark:hover:bg-brand-300 group text-sm font-medium py-2.5 rounded-xl"
              asChild
            >
              <a
                href={dealUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  void onRedeem?.(deal.id);
                  void onClick?.(deal.id);
                }}
                className="flex items-center justify-center gap-2"
              >
                Official Deal Link
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default DealDetail;
