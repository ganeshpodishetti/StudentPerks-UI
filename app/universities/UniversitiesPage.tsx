// Migrated from src/components/pages/UniversitiesPage.tsx
'use client'
import { fetchUniversities, University } from '@/features/universities/services/universityService';
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useToast } from "@/shared/components/ui/use-toast";
import { browserConsole } from '@/shared/utils/runtimeSafety';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const UniversitiesPage: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadUniversities = async () => {
      setLoading(true);
      try {
        const universitiesData = await fetchUniversities();
        setUniversities(universitiesData);
        setLoading(false);
      } catch (err) {
        browserConsole.error('Error loading universities:', err);
        setError("Failed to load universities. Please try again later.");
        setLoading(false);
        
        toast({
          title: "Error",
          description: "Failed to load universities. Please try again later.",
          variant: "destructive",
        });
      }
    };

    loadUniversities();
  }, [toast]);

  const handleUniversitySelect = (universityId: string) => {
    router.push(`/universities/${universityId}/deals`);
  };

  const getLocation = (university: University) => {
    const parts = [university.city, university.state, university.country].filter(Boolean);
    return parts.join(', ') || '';
  };

  if (loading) {
    return (
      <div className="py-8 bg-background dark:bg-background transition-colors">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-3 sm:h-4 w-3/4 mb-1" />
                      <Skeleton className="h-2 sm:h-3 w-1/2 hidden sm:block" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-background dark:bg-background transition-colors">
      <section className="max-w-4xl mx-auto text-center mb-16 md:mb-20 px-4">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-brand-500 dark:text-brand-300 mb-4 opacity-80">
          YOUR CAMPUS. YOUR PERKS.
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-brand-900 dark:text-brand-100 leading-[1.1] tracking-tight mb-6">
          Find Your <span className="text-brand-500">University.</span>
        </h1>
        <p className="text-sm md:text-lg text-brand-700 dark:text-brand-300 max-w-2xl mx-auto leading-relaxed">
          Access exclusive deals and community perks specifically verified for your campus. 
          Smart saving starts where you study.
        </p>
      </section>

      {universities.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-brand-900 dark:text-brand-300 mb-2">No Universities Found</h2>
          <p className="text-brand-700 dark:text-brand-500 text-sm">
            Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {universities.map((university) => (
            <Card
              key={university.id}
              onClick={() => handleUniversitySelect(university.id)}
              className="group hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 shadow-sm"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden rounded-xl bg-brand-100/50 dark:bg-brand-900/50 shrink-0 border border-brand-100 dark:border-brand-900">
                  {university.imageUrl ? (
                    <Image
                      src={university.imageUrl}
                      alt={university.name || 'University logo'}
                      width={48}
                      height={48}
                      loading="lazy"
                      sizes="(max-width: 640px) 40px, 48px"
                      className="w-full h-full object-contain p-1 rounded-lg"
                      unoptimized={!university.imageUrl.startsWith('/')}
                    />
                  ) : (
                    <span className="text-brand-700 dark:text-brand-300 font-bold text-xs sm:text-sm">
                      {university.code || university.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-brand-900 dark:text-brand-300 leading-tight group-hover:text-brand-500 transition-colors truncate">
                    {university.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-brand-900 text-brand-100 dark:bg-brand-100 dark:text-brand-900 rounded-full uppercase tracking-wider">
                      {university.code}
                    </span>
                    {getLocation(university) && (
                      <span className="text-[10px] sm:text-xs font-medium text-brand-300 dark:text-brand-700 truncate hidden sm:inline">
                        • {getLocation(university)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversitiesPage;
