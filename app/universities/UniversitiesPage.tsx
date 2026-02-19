// Migrated from src/components/pages/UniversitiesPage.tsx
'use client'
import { University, fetchUniversities } from '@/features/universities/services/universityService';
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useToast } from "@/shared/components/ui/use-toast";
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

  const getLocation = (university: University) => {
    const parts = [university.city, university.state, university.country].filter(Boolean);
    return parts.join(', ') || '';
  };

  if (loading) {
    return (
      <div className="py-8 bg-background dark:bg-background transition-colors">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/2" />
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
    <div className="container mx-auto p-4">
      {universities.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Universities Found</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {universities.map((university) => (
            <Card
              key={university.id}
              onClick={() => handleUniversitySelect(university.id)}
              className="group hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl p-4 cursor-pointer hover:border-neutral-200 dark:hover:border-neutral-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800 shrink-0">
                  {university.imageUrl ? (
                    <Image
                      src={university.imageUrl}
                      alt={university.name}
                      width={40}
                      height={40}
                      className="object-contain rounded-md"
                      unoptimized={university.imageUrl.startsWith('/')}
                    />
                  ) : (
                    <span className="text-neutral-500 font-semibold text-sm">
                      {university.code || university.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-300 leading-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-400 truncate">
                    {university.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium px-1.5 py-0.5 bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-800 rounded">
                      {university.code}
                    </span>
                    {getLocation(university) && (
                      <span className="text-xs text-neutral-400 truncate">
                        {getLocation(university)}
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
