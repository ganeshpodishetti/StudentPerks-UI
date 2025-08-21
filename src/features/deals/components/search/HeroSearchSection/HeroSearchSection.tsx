'use client'
import { Input } from "@/shared/components/ui/input";
import React, { useEffect, useState } from 'react';
import { Category, fetchCategories } from '@/features/categories/services/categoryService';

interface HeroSearchSectionProps {
  onSearch: (searchTerm: string) => void;
  onCategorySelect: (categoryName: string) => void;
  searchTerm: string;
}

const HeroSearchSection: React.FC<HeroSearchSectionProps> = ({
  onSearch,
  onCategorySelect,
  searchTerm
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await fetchCategories();
        // Ensure categoriesData is always an array
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading categories:", err);
        setCategories([]); // Set empty array on error
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  return (
    <div className="mb-8">
      {/* Search Section */}
      <div className="mb-6">
        <div className="relative max-w-lg mx-auto">
          <div className="relative flex items-center justify-center">
            <Input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                autoComplete="off"
                placeholder="Search for deals, stores, or categories..."
                className="h-10 text-sm border border-neutral-200 dark:border-neutral-800 rounded-full shadow-md bg-white dark:bg-neutral-900 backdrop-blur focus:ring-2 focus:ring-blue-400 dark:focus:ring-neutral-400 focus:outline-none text-center placeholder:text-center placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-800 dark:text-neutral-100 transition-all duration-200 pl-10 pr-3 max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {/* <div className="text-center">
        
        {loading ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(8)].map((_, index) => (
              <div 
                key={index} 
                className="h-8 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
            <button
              onClick={() => onCategorySelect('All')}
              className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-full text-sm font-medium hover:bg-neutral-900 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-neutral-700 focus:ring-offset-1 whitespace-nowrap"
            >
              All Categories
            </button>
            {Array.isArray(categories) && categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.name || '')}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-full text-sm font-medium hover:bg-neutral-900 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-neutral-700 focus:ring-offset-1 whitespace-nowrap"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
};

export default HeroSearchSection;
