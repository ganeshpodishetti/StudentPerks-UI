'use client'
import { useDealInteractionTracker } from '@/features/deals/hooks/useDealInteractionTracker';
import StoreLogoAvatar from '@/shared/components/branding/StoreLogoAvatar';
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Deal } from '@/shared/types';
import { Clock, ExternalLink } from 'lucide-react';
import React, { memo } from 'react';
import DealDetail from '../DealDetail/DealDetail';

interface DealCardProps {
  deal: Deal;
  showUniversityInfo?: boolean;
  compact?: boolean;
  showCategoryAndStore?: boolean;
}

const DealCard: React.FC<DealCardProps> = memo((props) => {
  const { deal, compact = false, showCategoryAndStore = true } = props;
  const showUniversityInfo = props.showUniversityInfo ?? false;
  const dealUrl = deal.url?.trim();
  const { trackDealClick, trackDealRedeem, trackDealView } = useDealInteractionTracker();

  // Calculate days remaining if end date exists
  const getDaysRemaining = () => {
    // Check for null, undefined, empty string, or placeholder text
    if (!deal.endDate || deal.endDate === 'No date specified' || deal.endDate === '') {
      return null;
    }
    
    try {
      const endDate = new Date(deal.endDate);
      // Check if the date is valid
      if (isNaN(endDate.getTime())) return null;
      
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return null;
    }
  };

  const daysRemaining = getDaysRemaining();
  // Only show expired if we have a valid end date AND it's in the past
  const isExpired = daysRemaining !== null && daysRemaining < 0;
  // Only show expiring if we have a valid end date AND it's within 7 days
  const isExpiring = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;

  const cardContent = (
    <Card className={`relative overflow-hidden flex flex-col group hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:shadow-md transition-all duration-300 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-3 sm:p-4 ${compact ? 'sm:p-4' : 'sm:p-5'} ${isExpired ? 'opacity-70' : ''} h-full cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 touch-manipulation`}>
      {/* Header with Title */}
      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
        <StoreLogoAvatar
          name={deal.storeName}
          fallbackName={deal.title}
          logoUrl={deal.logoUrl || deal.imageUrl}
          testIdPrefix="deal-card-logo"
        />
        {/* Deal Title and Discount */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className={`text-sm ${compact ? 'sm:text-sm' : 'sm:text-base'} font-medium text-brand-900 dark:text-brand-300 leading-tight group-hover:text-brand-700 dark:group-hover:text-brand-500 transition-colors duration-300 line-clamp-2`}>
            {deal.title}
          </h3>
          {deal.discount && (
            <div className="mt-1 sm:mt-1.5">
              <Badge 
                variant="default" 
                className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 bg-brand-900 hover:bg-brand-700 text-white dark:bg-brand-300 dark:hover:bg-brand-300 dark:text-brand-900"
              >
                {deal.discount}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Status badges */}
      {(isExpired || isExpiring) && (
        <div className="mb-2">
          {isExpired && (
            <Badge variant="destructive" className="text-xs px-2 py-0.5">
              <Clock className="h-3 w-3 mr-1" />
              Expired
            </Badge>
          )}
          {isExpiring && !isExpired && (
            <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-300 text-amber-600 dark:text-amber-400">
              <Clock className="h-3 w-3 mr-1" />
              {daysRemaining}d left
            </Badge>
          )}
        </div>
      )}
      
      {/* Footer with Tags and Link */}
      {showCategoryAndStore && (
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs font-medium text-brand-700 dark:text-brand-300">
              {deal.categoryName}
            </span>
            <span className="text-[10px] sm:text-xs text-brand-300 dark:text-brand-700">•</span>
            <span className="text-[10px] sm:text-xs font-medium text-brand-700 dark:text-brand-300">
              {deal.storeName}
            </span>
            {showUniversityInfo && deal.universityName && (
              <>
                <span className="text-[10px] sm:text-xs text-brand-300 dark:text-brand-700">•</span>
                <span className="text-[10px] sm:text-xs font-medium text-brand-700 dark:text-brand-300">
                  {deal.universityName}
                </span>
              </>
            )}
          </div>
          {dealUrl ? (
            <a
              href={dealUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${deal.title} deal in a new tab`}
              onClick={(e) => {
                e.stopPropagation();
                void trackDealClick(deal.id);
              }}
              className="text-brand-700 hover:text-brand-900 dark:text-brand-300 dark:hover:text-brand-100 transition-colors touch-manipulation"
            >
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      )}
    </Card>
  );

  return (
    <DealDetail
      deal={deal}
      trigger={cardContent}
      onView={trackDealView}
      onClick={trackDealClick}
      onRedeem={trackDealRedeem}
    />
  );
});

DealCard.displayName = 'DealCard';

export default DealCard;