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
    <footer className="text-neutral-600 dark:bg-neutral-950 dark:text-neutral-400 py-12 border-t border-gray-100 dark:border-gray-900">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h3 className="text-neutral-800 dark:text-white font-semibold mb-4">
              Connect
            </h3>
            <p className="text-sm mb-4">
              Stay updated with the latest deals and offers
            </p>
            <div className="flex justify-center space-x-4">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/perkscrowd/"
                aria-label="PerksCrowd on Instagram"
                className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    ry="5"
                  ></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="#"
                aria-label="PerksCrowd on X (Twitter)"
                className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-900 mt-8 pt-8 text-center text-xs">
          <div className="mb-2 flex items-center justify-center gap-4">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/brand-use" className="hover:underline">Brand & Fair Use</Link>
          </div>
          <p className="mb-2 text-neutral-600 dark:text-neutral-400">
            All trademarks and logos are property of their respective owners.
          </p>
          <span>
            &copy; {new Date().getFullYear()} PerksCrowd · All rights
            reserved
          </span>
        </div>
      </div>
    </footer>
  )
}
