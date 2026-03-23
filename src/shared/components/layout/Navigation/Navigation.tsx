'use client'
import { useToast } from '@/shared/components/ui/use-toast';
import { GraduationCap, Menu, Search, Tag, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ThemeToggle = dynamic(() => import('../ThemeToggle/ThemeToggle'), {
  ssr: false,
  loading: () => <div aria-hidden className="h-9 w-9 rounded-md" />,
});



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

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const isUniversityDealsRoute = /^\/universities\/[^/]+\/deals\/?$/.test(pathname || '');

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
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/deals?search=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery('');
      closeMobileMenu();
    }
  };

  if (isUniversityDealsRoute) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-neutral-950 py-4 sticky top-0 z-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              onClick={closeMobileMenu}
            >
              <Image
                src="/perkscrowd-logo-dark.svg"
                alt="PerksCrowd logo"
                width={40}
                height={40}
                className="h-7 w-7 sm:h-9 sm:w-9 dark:hidden"
              />
              <Image
                src="/perkscrowd-logo-light.svg"
                alt="PerksCrowd logo"
                width={40}
                height={40}
                className="hidden h-7 w-7 sm:h-9 sm:w-9 dark:block"
              />
              PerksCrowd
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              href="/deals"
              className={`flex items-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white font-medium text-sm transition-colors focus:outline-none ${
                pathname === '/deals' ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1' : ''
              }`}
            >
              <Tag className="mr-1.5 h-3.5 w-3.5" />
              Deals
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

            <ThemeToggle />
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Icon Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            {/* Mobile Search Input - expands when icon clicked */}
            {isMobileSearchOpen && (
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-neutral-400 h-3.5 w-3.5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-2 py-1.5 w-28 text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder:text-neutral-500"
                  autoFocus
                />
              </form>
            )}
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
                href="/deals"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === '/deals'
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                }`}
                onClick={closeMobileMenu}
              >
                <Tag className="mr-2 h-4 w-4" />
                Deals
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
              

              
              {/* Mobile Auth Links */}
              <AuthButtonsMobile />
            </div>
          </div>
        )}
      </div>
      

    </header>
  );
};

export default Navigation;