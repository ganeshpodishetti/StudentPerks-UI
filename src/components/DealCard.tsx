import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ExternalLink, MapPin, School } from 'lucide-react';
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
    if (!deal.endDate) return null;
    try {
      const endDate = new Date(deal.endDate);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 ? diffDays : 0;
    } catch (error) {
      return null;
    }
  };

  const daysRemaining = getDaysRemaining();
  const isExpiring = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining !== null && daysRemaining <= 0;

  return (
    <Card className={`relative overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300 border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg ${compact ? 'p-4' : 'p-5'} ${isExpired ? 'opacity-70' : ''} h-full transform hover:-translate-y-1`}>
      {/* Status indicators - positioned as subtle overlays */}
      <div className="absolute top-3 right-3 flex gap-2">
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-neutral-50 dark:bg-neutral-800 p-1.5 rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
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
            className="text-xs px-2 py-0.5 bg-black/90 hover:bg-black text-white dark:bg-white/90 dark:hover:bg-white dark:text-black"
          >
            {deal.discount}
          </Badge>
        )}
      </div>

      {/* Header with Icon */}
      <div className="flex items-start gap-3 mb-3">
        <DealDetail 
          deal={deal} 
          trigger={
            <div className="cursor-pointer shrink-0">
              <div className={`${compact ? 'w-12 h-12' : 'w-14 h-14'} flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 rounded-md bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700`}>
                {!imageError && imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={deal.title} 
                    className="w-full h-full object-contain" 
                    onError={handleImageError}
                  />
                ) : (
                  <img 
                    src="/no-image.svg" 
                    alt="No image available" 
                    className="w-full h-full object-contain opacity-60"
                  />
                )}
              </div>
            </div>
          } 
        />
        
        {/* Deal Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`${compact ? 'text-sm' : 'text-base'} font-medium text-neutral-800 dark:text-neutral-200 mb-1 leading-tight group-hover:text-black dark:group-hover:text-white transition-colors`}>
            {deal.title}
          </h3>
          {deal.promo && (
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs font-mono px-1.5 py-0 text-neutral-500 border-neutral-200 dark:border-neutral-700">
                {deal.promo}
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow">
        <p className={`text-xs text-neutral-500 dark:text-neutral-400 ${compact ? 'line-clamp-2' : 'line-clamp-3'} leading-relaxed mb-3`}>
          {deal.description}
        </p>
      </div>

      {/* Deal Details - Minimalized */}
      {!compact && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3 text-[10px]">
          {(deal.startDate || deal.endDate) && (
            <div className="flex items-center text-neutral-400 dark:text-neutral-500">
              <Calendar className="h-2.5 w-2.5 mr-1" />
              <span>
                {deal.startDate && new Date(deal.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                {deal.startDate && deal.endDate && ' - '}
                {deal.endDate && new Date(deal.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-neutral-400 dark:text-neutral-500">
            <MapPin className="h-2.5 w-2.5 mr-1" />
            <span>{deal.redeemType === 'Online' ? 'Online only' : deal.redeemType === 'InStore' ? 'In-store only' : deal.redeemType === 'Both' ? 'Online & In-store' : 'Contact store'}</span>
          </div>

          {showUniversityInfo && 'universityName' in deal && (deal as any).universityName && (
            <div className="flex items-center text-neutral-400 dark:text-neutral-500">
              <School className="h-2.5 w-2.5 mr-1" />
              <span>{(deal as any).universityName}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Footer with Tags */}
      <div className="flex items-center flex-wrap gap-1.5 mt-auto pt-3 border-t border-neutral-50 dark:border-neutral-800">
        <Badge 
          variant="secondary" 
          className="text-[10px] bg-neutral-50 hover:bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 px-2 py-0.5 rounded-full"
        >
          {deal.categoryName}
        </Badge>
        <Badge 
          variant="secondary" 
          className="text-[10px] bg-neutral-50 hover:bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 px-2 py-0.5 rounded-full"
        >
          {deal.storeName}
        </Badge>
      </div>
    </Card>
  );
});

export default DealCard;