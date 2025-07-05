import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { University, fetchUniversities } from '../services/universityService';

const UniversitiesPage: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    navigate(`/universities/${universityId}/deals`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
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
            We're working on adding universities to our platform. Check back soon!
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {universities.map((university) => (
            <button
              key={university.id}
              onClick={() => handleUniversitySelect(university.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-900/90 dark:bg-neutral-800/90 hover:bg-neutral-900 dark:hover:bg-neutral-900 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary/40 text-white font-medium text-sm shadow-sm border border-neutral-800/40 group"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-white/20 transition-all duration-200">
                {university.imageUrl ? (
                  <img
                    src={university.imageUrl}
                    alt={university.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xs opacity-60 group-hover:opacity-90 transition-opacity duration-200">
                    {university.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="group-hover:text-white transition-colors duration-200">{university.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversitiesPage;
