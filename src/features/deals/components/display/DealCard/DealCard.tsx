'use client'
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Deal } from '@/shared/types';
import { Clock, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import React, { memo, useState } from 'react';
import DealDetail from '../DealDetail/DealDetail';

interface DealCardProps {
  deal: Deal;
  showUniversityInfo?: boolean;
  compact?: boolean;
  showCategoryAndStore?: boolean;
}

const DealCard: React.FC<DealCardProps> = memo(({ deal, showUniversityInfo = false, compact = false, showCategoryAndStore = true }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = deal.imageUrl;
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Calculate days remaining if end date exists
  const getDaysRemaining = () => {
    // Check for null, undefined, empty string, or placeholder text
    if (!deal.endDate || 
        deal.endDate === null || 
        deal.endDate === 'No date specified' || 
        deal.endDate === '' ||
        deal.endDate === 'null') {
      return null;
    }
    
    try {
      const endDate = new Date(deal.endDate);
      // Check if the date is valid
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
  // Only show expired if we have a valid end date AND it's in the past
  const isExpired = daysRemaining !== null && daysRemaining < 0;
  // Only show expiring if we have a valid end date AND it's within 7 days
  const isExpiring = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;

  const cardContent = (
    <Card className={`relative overflow-hidden flex flex-col group hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:shadow-md transition-all duration-300 border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl ${compact ? 'p-4' : 'p-5'} ${isExpired ? 'opacity-70' : ''} h-full cursor-pointer hover:border-neutral-200 dark:hover:border-neutral-700 touch-manipulation`}>
      {/* External link - positioned as subtle overlay */}
      <div className="absolute top-5 right-5 z-10">
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="bg-transparent text-neutral-400 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 active:text-neutral-700 dark:active:text-neutral-100 transition-colors touch-manipulation"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>

      {/* Header with Icon and Title */}
      <div className="flex items-center gap-4 mb-3">
        <div className="shrink-0">
          <div className={`${compact ? 'w-12' : 'w-14'} h-auto flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-active:scale-105 rounded-md`}>
            {!imageError && imageUrl ? (
              <Image
                src={imageUrl}
                alt={deal.title}
                width={compact ? 48 : 56}
                height={compact ? 48 : 56}
                className="object-contain transition-all duration-300 group-hover:brightness-110 group-active:brightness-105 rounded-md"
                style={{ width: '100%', height: 'auto' }}
                onError={handleImageError}
                unoptimized={imageUrl.startsWith('/')}
              />
            ) : (
              <Image
                src="/no-image.svg"
                alt="No image available"
                width={compact ? 48 : 56}
                height={compact ? 48 : 56}
                className="object-contain opacity-60 transition-all duration-300 group-hover:opacity-80 group-active:opacity-75 rounded-md"
                style={{ width: '100%', height: 'auto' }}
                unoptimized
              />
            )}
          </div>
        </div>
        
        {/* Deal Title and Promo */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className={`${compact ? 'text-sm' : 'text-base'} font-medium text-neutral-800 dark:text-neutral-300 leading-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors duration-300 line-clamp-2`}>
            {deal.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            {deal.discount && (
              <Badge 
                variant="default" 
                className="text-xs font-medium px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-white dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-neutral-800"
              >
                {deal.discount}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs px-2 py-0.5 text-neutral-500 border-neutral-200 dark:border-neutral-700 bg-transparent">
              {deal.promo ? deal.promo : 'No code'}
            </Badge>
          </div>
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
      
      {/* Footer with Tags */}
      {showCategoryAndStore && (
        <div className="flex items-center flex-wrap gap-3 mt-auto pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {deal.categoryName}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">•</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {deal.storeName}
          </span>
        </div>
      )}
    </Card>
  );

  return (
    <DealDetail deal={deal} trigger={cardContent} />
  );
});

DealCard.displayName = 'DealCard';

export default DealCard;