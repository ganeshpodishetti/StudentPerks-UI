import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, ExternalLink } from 'lucide-react';
import React, { memo, useState } from 'react';
import { Deal } from '../types/Deal';
import DealDetail from './DealDetail';

interface DealCardProps {
  deal: Deal;
  showUniversityInfo?: boolean;
  compact?: boolean;
}

const DealCard: React.FC<DealCardProps> = memo(({ deal, showUniversityInfo = false, compact = false }) => {
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

  return (
    <Card className={`relative overflow-hidden flex flex-col group hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] active:shadow-md transition-all duration-300 border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl ${compact ? 'p-5' : 'p-6'} ${isExpired ? 'opacity-70' : ''} h-full cursor-pointer hover:border-neutral-200 dark:hover:border-neutral-700 touch-manipulation`}>
      {/* Status indicators - positioned as subtle overlays */}
      <div className="absolute top-7 right-7 flex gap-2">
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-transparent text-neutral-400 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 active:text-neutral-700 dark:active:text-neutral-100 transition-colors touch-manipulation"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>

      {/* Status badges */}
      <div className="mb-3">
        {isExpired && (
          <Badge variant="destructive" className="text-xs px-2 py-0.5">
            <Clock className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        )}
        {isExpiring && !isExpired && (
          <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-300 text-amber-600 dark:text-amber-400">
            <Clock className="h-3 w-3 mr-1" />
            {daysRemaining}d
          </Badge>
        )}
        {deal.discount && (
          <Badge 
            variant="default" 
            className="text-sm font-medium px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-neutral-800"
          >
            {deal.discount}
          </Badge>
        )}
      </div>

      {/* Header with Icon */}
      <div className="flex items-center gap-4 mb-3">
        <DealDetail 
          deal={deal} 
          trigger={
            <div className="cursor-pointer shrink-0 active:scale-95 transition-transform duration-200 touch-manipulation">
              <div className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-active:scale-105 rounded-md`}>
                {!imageError && imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={deal.title} 
                    className="w-full h-full object-contain transition-all duration-300 group-hover:brightness-110 group-active:brightness-105" 
                    onError={handleImageError}
                  />
                ) : (
                  <img 
                    src="/no-image.svg" 
                    alt="No image available" 
                    className="w-full h-full object-contain opacity-60 transition-all duration-300 group-hover:opacity-80 group-active:opacity-75"
                  />
                )}
              </div>
            </div>
          }
        />
        
        {/* Deal Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <DealDetail 
            deal={deal} 
            trigger={
              <h3 className={`${compact ? 'text-sm' : 'text-base'} font-medium text-neutral-800 dark:text-neutral-200 leading-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-active:text-neutral-700 dark:group-active:text-neutral-300 transition-colors duration-300 cursor-pointer `}>
                {deal.title}
              </h3>
            }
          />
          <div className="mt-1">
            <Badge variant="outline" className="text-xs px-2 py-0.5 text-neutral-500 border-neutral-200 dark:border-neutral-700 bg-transparent group-hover:border-neutral-300 group-hover:text-neutral-600 dark:group-hover:border-neutral-600 dark:group-hover:text-neutral-400 group-active:border-neutral-400 group-active:text-neutral-700 dark:group-active:border-neutral-500 dark:group-active:text-neutral-300 transition-colors duration-300">
              {deal.promo ? deal.promo : 'No code required'}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow">
        <p className={`text-sm text-neutral-500 dark:text-neutral-400 ${compact ? 'line-clamp-2' : 'line-clamp-2'} leading-relaxed mb-4`}>
          {deal.description?.replace(/verify student status/gi, '').replace(/verify student/gi, '').trim()}
        </p>
      </div>

      {/* Deal Details - Minimalized
      {!compact && (
        <div className="flex flex-wrap items-center gap-x-6 mb-2 text-xs">
          {(deal.startDate || deal.endDate) && (
            <div className="flex items-center text-neutral-400 dark:text-neutral-500">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>
                {deal.startDate ? new Date(deal.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'Jul 3'}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-neutral-400 dark:text-neutral-500">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            <span>{deal.redeemType === 'Online' ? 'Online only' : deal.redeemType === 'InStore' ? 'In-store only' : deal.redeemType === 'Both' ? 'Online & In-store' : 'Online only'}</span>
          </div>

          {showUniversityInfo && 'universityName' in deal && (deal as any).universityName && (
            <div className="flex items-center text-neutral-400 dark:text-neutral-500">
              <School className="h-3.5 w-3.5 mr-1.5" />
              <span>{(deal as any).universityName}</span>
            </div>
          )}
        </div>
      )} */}
      
      {/* Footer with Tags */}
      <div className="flex items-center flex-wrap gap-4 mt-auto pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {deal.categoryName}
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {deal.storeName}
        </div>
      </div>
    </Card>
  );
});

export default DealCard;