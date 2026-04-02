'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  
  // Don't show footer on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null
  }

  return (
    <footer className="bg-neutral-50/50 dark:bg-neutral-950/20 border-t border-brand-100 dark:border-brand-900 pt-16 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16 md:mb-24">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-6 text-xl font-bold text-brand-900 dark:text-brand-100 tracking-tighter">
              PerksCrowd
            </Link>
            <p className="text-sm text-brand-700 dark:text-brand-300 max-w-xs leading-relaxed font-medium mb-8">
              The smarter way to save on campus and beyond. Verified student perks and everyday discovered deals.
            </p>
            <div className="flex items-center gap-5">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/perkscrowd/"
                className="text-brand-300 hover:text-brand-900 dark:text-brand-700 dark:hover:text-brand-300 transition-all transform hover:scale-110"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="#"
                className="text-brand-300 hover:text-brand-900 dark:text-brand-700 dark:hover:text-brand-300 transition-all transform hover:scale-110"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-900 dark:text-brand-100">Platform</h3>
            <div className="flex flex-col gap-4 text-sm font-bold tracking-tight">
              <Link href="/" className="text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-100 transition-colors">Home</Link>
              <Link href="/universities" className="text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-100 transition-colors">Universities</Link>
              <Link href="/login" className="text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-100 transition-colors">Member Access</Link>
            </div>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-900 dark:text-brand-100">Legal</h3>
            <div className="flex flex-col gap-4 text-sm font-bold tracking-tight">
              <Link href="/terms" className="text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-100 transition-colors">Terms of Use</Link>
              <Link href="/privacy" className="text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-100 transition-colors">Privacy Policy</Link>
              <Link href="/brand-use" className="text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-100 transition-colors">Brand Assets</Link>
            </div>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-900 dark:text-brand-100">Support</h3>
            <div className="flex flex-col gap-4 text-sm font-bold tracking-tight">
              <a href="mailto:support@perkscrowd.com" className="text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-100 transition-colors">Contact Us</a>
              <Link href="/resend-confirmation" className="text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-100 transition-colors">Verify Account</Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-100 dark:border-brand-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span className="text-[10px] font-black text-brand-900 dark:text-brand-100 tracking-widest">
              &copy; {new Date().getFullYear()} PerksCrowd
            </span>
            <div className="hidden md:block h-3 w-px bg-brand-100 dark:bg-brand-900"></div>
            <p className="text-[10px] font-bold text-brand-300 dark:text-brand-700 tracking-widest leading-relaxed text-center md:text-left">
              All trademarks belong to their respective owners. Smart savers use PerksCrowd.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-900 text-brand-100 dark:bg-brand-100 dark:text-brand-900 rounded-full text-[10px] font-black uppercase tracking-[0.1em]">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Live Status
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
