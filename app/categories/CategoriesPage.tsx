// Migrated from src/components/pages/CategoriesPage.tsx
'use client'
import DealList from '@/features/deals/components/display/DealList';
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useToast } from "@/shared/components/ui/use-toast";
import { Category, fetchCategories } from '@/features/categories/services/categoryService';
import React, { useEffect, useState } from 'react';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories. Please try again later.");
        setLoading(false);
        
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadCategories();
  }, [toast]);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

if (loading) {
  return (
    <div className="py-12 bg-background dark:bg-background transition-colors">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-8">Categories</h1>
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
      <div className="py-12">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Categories</h1>
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md">
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Categories</h1>
          </div>
        
          {/* Categories Section - Always visible */}
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-md border border-neutral-100 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400">No categories found</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.name || '')}
                  className="py-2 px-4 rounded-full bg-neutral-900 dark:bg-neutral-800/90 hover:bg-neutral-700 dark:hover:bg-neutral-700 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary/40 text-white font-medium text-sm shadow-sm border border-neutral-700/40 group"
                >
                  <span className="group-hover:text-white transition-colors duration-200">{category.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Deals Section - Show when category is selected */}
          {selectedCategory && (
            <div className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {selectedCategory} Deals
                </h2>
              </div>
              <DealList initialCategory={selectedCategory}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
// ...original code will be placed here...
