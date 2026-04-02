'use client'
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

type NavigationProps = Record<string, never>;

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
  const [isScrolled, setIsScrolled] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  const isUniversityDealsRoute = /^\/universities\/[^/]+\/deals\/?$/.test(pathname || '');

  // Handle scroll to add subtle differentiator
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
    <header className={`bg-white dark:bg-neutral-950 sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'border-b border-neutral-100 dark:border-neutral-900 shadow-sm' : 'border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center h-16 md:h-24">
          
          {/* Left: Logo (Column 1) */}
          <div className="w-1/4 flex justify-start">
            <Link 
              href="/" 
              className="flex items-center gap-2 group outline-none"
              onClick={closeMobileMenu}
            >
              <div className="relative">
                <Image
                  src="/perkscrowd-logo-dark.svg"
                  alt="PerksCrowd logo"
                  width={32}
                  height={32}
                  className="h-7 w-7 dark:hidden transition-transform duration-300 group-hover:rotate-6"
                />
                <Image
                  src="/perkscrowd-logo-light.svg"
                  alt="PerksCrowd logo"
                  width={32}
                  height={32}
                  className="hidden h-7 w-7 dark:block transition-transform duration-300 group-hover:rotate-6"
                />
              </div>
              <span className="text-xl font-bold text-brand-900 dark:text-brand-100 tracking-tight">
                Perks<span className="text-brand-500">Crowd</span>
              </span>
            </Link>
          </div>

          {/* Center: Links (Column 2) - Centered like Google AI */}
          <nav className="flex-1 hidden md:flex justify-center items-center gap-10">
            <Link 
              href="/deals"
              className={`text-sm font-medium transition-all hover:text-brand-900 dark:hover:text-brand-100 relative py-1 ${
                pathname === '/deals' 
                  ? 'text-brand-900 dark:text-brand-100 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-500' 
                  : 'text-brand-500'
              }`}
            >
              Deals
            </Link>
            
            <Link 
              href="/universities" 
              className={`text-sm font-medium transition-all hover:text-brand-900 dark:hover:text-brand-100 relative py-1 ${
                pathname === '/universities' 
                  ? 'text-brand-900 dark:text-brand-100 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-500' 
                  : 'text-brand-500'
              }`}
            >
              Universities
            </Link>
          </nav>

          {/* Right: Actions (Column 3) */}
          <div className="w-1/4 hidden md:flex items-center justify-end gap-5">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-300 group-focus-within:text-brand-500 h-4 w-4 transition-colors" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-36 lg:w-44 text-sm focus:w-48 bg-neutral-50 dark:bg-neutral-900/50 border border-transparent rounded-full focus:outline-none focus:ring-1 focus:ring-brand-500/30 focus:bg-white dark:focus:bg-neutral-900 text-brand-900 dark:text-brand-100 placeholder-brand-300 transition-all font-medium"
              />
            </form>

            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="px-6 py-2 text-sm font-bold text-brand-100 dark:text-brand-900 bg-brand-900 dark:bg-brand-100 rounded-full hover:shadow-xl transition-all"
              >
                Join
              </Link>
              <ThemeToggle />
              <AuthButtons />
            </div>
          </div>

          {/* Mobile elements */}
          <div className="md:hidden flex flex-1 justify-end items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 text-brand-700 dark:text-brand-300"
            >
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              className="p-2 text-brand-900 dark:text-brand-100"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-6 px-1 animate-in fade-in slide-in-from-top-2 duration-300">
             <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-300 h-5 w-5" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 w-full text-sm font-medium bg-neutral-50 dark:bg-neutral-900 border-b border-brand-500 rounded-t-xl focus:outline-none text-brand-900 dark:text-brand-100"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Nav Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300 bg-white dark:bg-neutral-950 absolute left-0 right-0 top-full border-b border-neutral-100 dark:border-neutral-900 shadow-xl px-6">
            <nav className="space-y-1">
              <Link 
                href="/deals"
                className={`flex items-center px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                  pathname === '/deals'
                    ? 'text-brand-900 dark:text-brand-100 bg-neutral-50 dark:bg-neutral-900 font-bold' 
                    : 'text-brand-500'
                }`}
                onClick={closeMobileMenu}
              >
                <Tag className="mr-4 h-5 w-5" />
                Deals
              </Link>
              
              <Link 
                href="/universities" 
                className={`flex items-center px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                  pathname === '/universities' 
                    ? 'text-brand-900 dark:text-brand-100 bg-neutral-50 dark:bg-neutral-900 font-bold' 
                    : 'text-brand-500'
                }`}
                onClick={closeMobileMenu}
              >
                <GraduationCap className="mr-4 h-5 w-5" />
                Universities
              </Link>
              
              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 mt-4">
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center w-full px-4 py-4 rounded-full text-base font-bold text-brand-100 bg-brand-900 dark:bg-brand-100 dark:text-brand-900 shadow-lg"
                >
                  Join PerksCrowd
                </Link>
                <AuthButtonsMobile />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;