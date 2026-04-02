// Migrated from src/components/pages/UniversityDealsPage.tsx
'use client'
import DealCard from '@/features/deals/components/display/DealCard/DealCard';
import { useDealsByUniversityQuery } from '@/features/deals/hooks/useDealsQuery';
import { useUniversityQuery } from '@/features/universities/hooks/useUniversitiesQuery';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const UniversityDealsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const universityId = params?.universityId as string;

  // Get university details
  const { 
    data: university, 
    isLoading: universityLoading, 
    error: universityError 
  } = useUniversityQuery(universityId || '');

  // Get deals for this university
  const { 
    data: deals = [], 
    isLoading: dealsLoading, 
    error: dealsError 
  } = useDealsByUniversityQuery(university?.name || '');

  const isLoading = universityLoading || dealsLoading;
  const hasError = universityError || dealsError;

  if (isLoading) {
    return (
      <div className="py-12 bg-background dark:bg-background transition-colors">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-8">{university?.name || 'University'} Deals</h1>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="py-4 px-6 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/40 shadow-sm w-80 flex flex-col items-center justify-center">
                  <Skeleton className="h-8 w-32 mb-4 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                  <Skeleton className="h-6 w-40 mb-2 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                  <Skeleton className="h-4 w-32 mb-2 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                  <Skeleton className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !university) {
    return (
      <div className="container mx-auto p-4">
        <Button
          variant="outline"
          onClick={() => router.push('/universities')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Universities
        </Button>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">
            {universityError 
              ? 'Failed to load university details' 
              : dealsError 
              ? 'Failed to load deals for this university' 
              : 'University not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background dark:bg-background transition-colors pb-20">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        {/* Navigation */}
        <div className="py-8 md:py-12">
          <Button
            variant="ghost"
            onClick={() => router.push('/universities')}
            className="group px-0 hover:bg-transparent text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-brand-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-bold tracking-tight">BACK TO UNIVERSITIES</span>
          </Button>
        </div>

        {/* University Header Section */}
        <div className="mb-16 md:mb-24">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-brand-500/10 blur-2xl rounded-full -z-10 animate-pulse" />
              {university.imageUrl ? (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl bg-white dark:bg-neutral-900 p-2 md:p-3 border border-brand-100 dark:border-brand-900 shadow-sm overflow-hidden">
                  <Image
                    src={university.imageUrl}
                    alt={university.name}
                    width={112}
                    height={112}
                    sizes="(max-width: 768px) 96px, 128px"
                    className="w-full h-full object-contain"
                    unoptimized={!university.imageUrl.startsWith('/')}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl bg-brand-900 flex items-center justify-center text-brand-100 border border-brand-700">
                  <span className="text-2xl md:text-4xl font-black">{university.code || 'UN'}</span>
                </div>
              )}
            </div>

            <div className="text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-brand-100/50 dark:bg-brand-900/50 text-brand-900 dark:text-brand-300 text-[10px] md:text-xs font-bold rounded-full mb-4 tracking-[0.1em] uppercase">
                {university.code} • UNIVERSITY PERKS
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-brand-900 dark:text-brand-100 leading-tight mb-4">
                {university.name}
              </h1>
              <p className="text-sm md:text-lg text-brand-700 dark:text-brand-300 max-w-xl font-medium">
                {[university.city, university.state, university.country].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Deals Section */}
        <div>
          <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-brand-100 dark:border-brand-900 pb-6">
            <h2 className="text-xl md:text-2xl font-black text-brand-900 dark:text-brand-100 uppercase tracking-tight font-sans">
              Exclusive campus offers <span className="text-brand-500 ml-2">({deals.length})</span>
            </h2>
          </div>

          {deals.length === 0 ? (
            <div className="text-center py-20 md:py-32 bg-brand-50/30 dark:bg-brand-900/10 rounded-3xl border border-dashed border-brand-300 dark:border-brand-800">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900 mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-brand-900 dark:text-brand-100 mb-3 uppercase tracking-tight">
                No active deals yet
              </h3>
              <p className="text-brand-700 dark:text-brand-300 max-w-md mx-auto text-sm md:text-base px-6">
                We're curating exclusive student deals for {university.name}. 
                Stay tuned as we rapidly expand our verified perks.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {deals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  showUniversityInfo={false}
                  showCategoryAndStore={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityDealsPage;
