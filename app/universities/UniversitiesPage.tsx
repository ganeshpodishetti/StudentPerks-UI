// Migrated from src/components/pages/UniversitiesPage.tsx
'use client'
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useToast } from "@/shared/components/ui/use-toast";
import { University, fetchUniversities } from '@/features/universities/services/universityService';
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
        console.error("Error loading universities:", err);
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

  if (loading) {
      return (
        <div className="py-12 bg-background dark:bg-background transition-colors">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-8">Universities</h1>
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                {[...Array(12)].map((_, index) => (
                  <div
                    key={index}
                    className="py-2 px-4 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/40 shadow-sm w-40 h-10 flex items-center justify-center"
                  >
                    <Skeleton className="h-5 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                  </div>
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
    <div className="container mx-auto p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Universities</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse universities and discover exclusive student deals and offers.
        </p>
      </div>

      {universities.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Universities Found</h2>
          <p className="text-gray-500 dark:text-gray-400">
            We&apos;re working on adding universities to our platform. Check back soon!
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {universities.map((university) => (
            <button
              key={university.id}
              onClick={() => handleUniversitySelect(university.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-900/90 dark:bg-neutral-800/90 hover:bg-neutral-900 dark:hover:bg-neutral-900 active:bg-neutral-800 dark:active:bg-neutral-700 hover:scale-105 active:scale-95 hover:shadow-lg active:shadow-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary/40 text-white font-medium text-sm shadow-sm border border-neutral-800/40 group touch-manipulation"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition-all duration-200">
                {university.imageUrl ? (
                  <Image
                    src={university.imageUrl}
                    alt={university.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    unoptimized={university.imageUrl.startsWith('/')}
                  />
                ) : (
                  <span className="text-white font-bold text-xs opacity-60 group-hover:opacity-90 group-active:opacity-100 transition-opacity duration-200">
                    {university.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="group-hover:text-white group-active:text-gray-100 transition-colors duration-200">{university.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversitiesPage;
