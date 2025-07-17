import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import React from 'react';

interface DealSkeletonProps {
  count?: number;
}

const DealSkeleton: React.FC<DealSkeletonProps> = ({ count = 9 }) => {
  return (
    <div>
      {/* Skeleton for filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="w-full md:w-64">
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
      
      {/* Skeleton for category filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-18" />
          <Skeleton className="h-6 w-22" />
        </div>
      </div>
      
      {/* Skeleton for deals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(count).fill(0).map((_, index) => (
          <Card
            key={index}
            className="relative overflow-hidden flex flex-col group transition-all duration-300 border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-6 h-full cursor-pointer touch-manipulation"
          >
            {/* Status indicators - positioned as subtle overlays */}
            <div className="absolute top-7 right-7 flex gap-2 z-10">
              <Skeleton className="h-5 w-5 bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {/* Status badges */}
            <div className="mb-3 flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-7 w-20" />
            </div>

            {/* Header with Icon */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 flex items-center justify-center overflow-hidden transition-all duration-300 rounded-md bg-neutral-100 dark:bg-neutral-900">
                <Skeleton className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-1" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-4" />
            </div>

            {/* Footer with Tags */}
            <div className="flex items-center flex-wrap gap-4 mt-auto pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </Card>
        ))}
      </div>
      
      {/* Skeleton for pagination */}
      <div className="flex justify-center my-8">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
};

export default DealSkeleton;
