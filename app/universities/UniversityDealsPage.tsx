// Migrated from src/components/pages/UniversityDealsPage.tsx
'use client'
import DealCard from '@/features/deals/components/display/DealCard/DealCard';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDealsByUniversityQuery } from '@/features/deals/hooks/useDealsQuery';
import { useUniversityQuery } from '@/features/universities/hooks/useUniversitiesQuery';
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
    <div className="w-full min-h-screen bg-background dark:bg-background transition-colors">
      <div className="container mx-auto p-4" style={{ maxWidth: '80%'}}>
      {/* Back button */}
      <Button
        variant="outline"
        onClick={() => router.push('/universities')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Universities
      </Button>

      {/* University header */}
      <div className="mb-8">
        <div className="flex items-center space-x-6 mb-4">
          <div className="flex-shrink-0">
            {university.imageUrl ? (
              <Image
                src={university.imageUrl}
                alt={university.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-lg object-cover"
                unoptimized={university.imageUrl.startsWith('/')}
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {university.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {university.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-mono mb-1">
              {university.code}
            </p>
            {[university.city, university.state, university.country].filter(Boolean).length > 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                {[university.city, university.state, university.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Exclusive student deals and offers for {university.name} students
        </p>
      </div>

      {/* Deals section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Available Deals ({deals.length})
        </h2>

        {deals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Deals Available Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We&apos;re working on adding exclusive deals for {university.name} students. 
              Check back soon for exciting offers!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
