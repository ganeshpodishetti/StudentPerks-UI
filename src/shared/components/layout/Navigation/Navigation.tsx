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
    <header className="bg-white dark:bg-neutral-950 sticky top-0 z-50 w-full border-b border-neutral-100 dark:border-neutral-900 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group outline-none"
              onClick={closeMobileMenu}
            >
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/perkscrowd-logo-dark.svg"
                  alt="PerksCrowd logo"
                  width={36}
                  height={36}
                  className="h-8 w-8 dark:hidden"
                />
                <Image
                  src="/perkscrowd-logo-light.svg"
                  alt="PerksCrowd logo"
                  width={36}
                  height={36}
                  className="hidden h-8 w-8 dark:block"
                />
              </div>
              <span className="text-xl font-bold text-brand-900 dark:text-brand-100 tracking-tighter">
                Perks<span className="text-brand-500">Crowd</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 translate-x-4">
            <Link 
              href="/deals"
              className={`text-sm font-semibold transition-all hover:text-brand-900 dark:hover:text-brand-100 ${
                pathname === '/deals' 
                  ? 'text-brand-900 dark:text-brand-100 border-b-2 border-brand-500/50 pb-1' 
                  : 'text-brand-500'
              }`}
            >
              Deals
            </Link>
            
            <Link 
              href="/universities" 
              className={`text-sm font-semibold transition-all hover:text-brand-900 dark:hover:text-brand-100 ${
                pathname === '/universities' 
                  ? 'text-brand-900 dark:text-brand-100 border-b-2 border-brand-500/50 pb-1' 
                  : 'text-brand-500'
              }`}
            >
              Universities
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-brand-300 group-focus-within:text-brand-500 h-3.5 w-3.5 transition-colors" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-48 lg:w-56 text-[11px] font-bold uppercase tracking-widest bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500 dark:focus:border-brand-500 text-brand-900 dark:text-brand-100 placeholder-brand-300 transition-all"
              />
            </form>

            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-100 dark:text-brand-900 bg-brand-900 dark:bg-brand-100 rounded-xl hover:bg-brand-700 dark:hover:bg-brand-300 transition-all shadow-md active:scale-95"
              >
                Join
              </Link>
              <div className="h-4 w-px bg-neutral-100 dark:bg-neutral-800" />
              <ThemeToggle />
              <AuthButtons />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2.5 rounded-xl text-brand-700 dark:text-brand-300 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              className="p-2.5 rounded-xl text-brand-900 dark:text-brand-100 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-4 px-1">
             <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-brand-300 h-4 w-4" />
              <input
                type="text"
                placeholder="SEARCH DEALS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 w-full text-xs font-bold bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 text-brand-900 dark:text-brand-100"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="px-2 space-y-2">
              <Link 
                href="/deals"
                className={`flex items-center px-4 py-4 rounded-xl text-sm font-bold transition-all border ${
                  pathname === '/deals'
                    ? 'bg-brand-900 text-brand-100' 
                    : 'bg-neutral-50 dark:bg-neutral-900 text-brand-500 border-neutral-100 dark:border-neutral-800'
                }`}
                onClick={closeMobileMenu}
              >
                <Tag className="mr-3 h-4 w-4" />
                Deals
              </Link>
              
              <Link 
                href="/universities" 
                className={`flex items-center px-4 py-4 rounded-xl text-sm font-bold transition-all border ${
                  pathname === '/universities' 
                    ? 'bg-brand-900 text-brand-100' 
                    : 'bg-neutral-50 dark:bg-neutral-900 text-brand-500 border-neutral-100 dark:border-neutral-800'
                }`}
                onClick={closeMobileMenu}
              >
                <GraduationCap className="mr-3 h-4 w-4" />
                Universities
              </Link>
              
              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="flex items-center justify-center w-full px-4 py-5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-brand-100 bg-brand-900 dark:bg-brand-100 dark:text-brand-900 shadow-xl"
              >
                Create Account
              </Link>
              
              <AuthButtonsMobile />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;