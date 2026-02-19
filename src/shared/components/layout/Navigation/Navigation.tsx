'use client'
import SubmittedDealFormModal from '@/features/deals/components/forms/SubmittedDealFormModal/SubmittedDealFormModal';
import { useToast } from '@/shared/components/ui/use-toast';
import { GraduationCap, Menu, Plus, Search, Store, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

interface NavigationProps {
  // Props removed as admin/user functionality is hidden
}

// Auth buttons component
const AuthButtons: React.FC = () => {
  // Hide admin and user info from navigation
  return null;
};

// Mobile auth buttons component
const AuthButtonsMobile: React.FC = () => {
  // Hide admin and user info from mobile navigation
  return null;
};

const Navigation: React.FC<NavigationProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitDealModalOpen, setIsSubmitDealModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('header')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page for searching
      if (pathname !== '/') {
        router.push('/');
      }
      setSearchQuery('');
      closeMobileMenu();
    }
  };

  return (
    <header className="bg-white dark:bg-neutral-950 py-4 sticky top-0 z-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              onClick={closeMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 -960 960 960"
                width="32px"
                fill="currentColor"
                className="h-6 w-6 mr-2 sm:h-8 sm:w-8 text-black dark:text-white"
                aria-label="StudentPerks Logo"
              >
                <path d="M855-316v-236L524-373q-21.48 11-45.24 10.5T436-374L99-559q-10-5-17-16.21t-7-22.74q0-11.48 6.97-22.32Q88.95-631.11 99-638l337-183q10.26-5 21.51-9 11.26-4 21.68-4 10.43 0 21.69 4 11.25 4 23.12 9l387 210q10.71 5 17.36 15.7 6.64 10.7 6.64 24.6V-315q0 17.35-11.88 28.67Q911.25-275 895.51-275q-16.74 0-28.63-11.83Q855-298.65 855-316ZM436-139 230-251q-23.19-12.98-35.6-34.24Q182-306.5 182-331v-143l254 138q18.93 13 42.86 13T524-336l253-138v143q0 24.5-12.9 45.76Q751.19-263.98 730-251L524-139q-11.87 6-23.12 9-11.26 3-21.69 3-10.42 0-21.68-3-11.25-3-21.51-9Z"/>
              </svg>
              {/* <span className="bg-gradient-to-r from-neutral-500 to-neutral-600 bg-clip-text text-transparent">StudentPerks</span> */}
              StudentPerks
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              href="/stores" 
              className={`flex items-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none ${
                pathname === '/stores' ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : ''
              }`}
            >
              <Store className="mr-1.5 h-3.5 w-3.5" />
              Stores
            </Link>
            
            <Link 
              href="/universities" 
              className={`flex items-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none ${
                pathname === '/universities' ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : ''
              }`}
            >
              <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
              Universities
            </Link>
          </nav>

          {/* Desktop Theme Toggle and Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-neutral-400 h-3.5 w-3.5" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 w-40 lg:w-48 text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder:text-neutral-500"
              />
            </form>
            <button
              onClick={() => setIsSubmitDealModalOpen(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Submit Deal
            </button>
            <ThemeToggle />
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-neutral-400 h-3.5 w-3.5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2 py-1.5 w-28 text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder:text-neutral-500"
              />
            </form>
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
              
              
              <Link 
                href="/stores" 
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === '/stores' 
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                }`}
                onClick={closeMobileMenu}
              >
                <Store className="mr-2 h-4 w-4" />
                Stores
              </Link>
              
              <Link 
                href="/universities" 
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === '/universities' 
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                }`}
                onClick={closeMobileMenu}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Universities
              </Link>
              
              {/* Submit Deal Button */}
              <button
                onClick={() => {
                  setIsSubmitDealModalOpen(true);
                  closeMobileMenu();
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Submit Deal
              </button>
              
              {/* Mobile Auth Links */}
              <AuthButtonsMobile />
            </div>
          </div>
        )}
      </div>
      
      {/* Submit Deal Modal */}
      <SubmittedDealFormModal
        isOpen={isSubmitDealModalOpen}
        onClose={() => setIsSubmitDealModalOpen(false)}
        onSuccess={() => {
          toast({
            title: "Deal Submitted!",
            description: "Thanks for sharing! We'll review your deal and add it to the platform soon.",
          });
        }}
      />
    </header>
  );
};

export default Navigation;